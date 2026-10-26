import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { exasolClient } from '../src/database/exasolClient.js';
import { initializeMongo, CaseRepository, AuditRepository } from '../src/database/mongoClient.js';
import { FraudDetectionEngine } from '../src/services/fraudDetectionEngine.js';
import { LoanExplainerEngine } from '../src/services/loanExplainerEngine.js';
import { AICopilotService } from '../src/services/aiCopilotService.js';

describe('FraudLens AI Engine & Analytical Database Tests', () => {
  before(async () => {
    await exasolClient.initialize();
    await initializeMongo();
  });

  test('Exasol Analytical Engine initializes with tables loaded', () => {
    const status = exasolClient.getSystemStatus();
    assert.strictEqual(status.connected, true);
    assert.ok(status.metrics.transactionsCount > 0, 'Transactions table should be populated');
    assert.ok(status.metrics.bankRecordsCount > 0, 'Bank records table should be populated');
    assert.ok(status.metrics.exposuresCount > 0, 'Facility exposures table should be populated');
  });

  test('Exasol smurfing window function detects sub-50k structuring pattern', async () => {
    const smurfData = await exasolClient.querySmurfingSyndicates();
    assert.ok(smurfData.results.length >= 1, 'Should identify at least 1 structuring syndicate');
    const syndicate = smurfData.results[0];
    assert.strictEqual(syndicate.accountId, 'ACC-IN-4901');
    assert.ok(syndicate.transactionCount >= 5, 'Should capture multiple sub-50k transactions');
    assert.ok(syndicate.avgAmount >= 40000 && syndicate.avgAmount <= 49999, 'Amounts should hover below 50k');
  });

  test('Exasol 3-Way Reconciliation accurately identifies matches, amount discrepancies, and unposted tax', async () => {
    const recon = await exasolClient.queryThreeWayReconciliation();
    assert.ok(recon.stats.totalRecords > 0);
    assert.ok(recon.stats.matchRatePercentage > 0);

    const taxMismatch = recon.results.find(r => r.reconciliationRef === 'REF-2026-9003');
    assert.ok(taxMismatch, 'Should find unposted CBDT tax entry');
    assert.strictEqual(taxMismatch.reconStatus, 'UNMATCHED_BANK');
    assert.strictEqual(taxMismatch.varianceAmount, 420000.00);

    const exactMatch = recon.results.find(r => r.reconciliationRef === 'REF-2026-9001');
    assert.ok(exactMatch);
    assert.strictEqual(exactMatch.reconStatus, 'MATCHED');
  });

  test('Exasol Unified Exposure detects Vanguard Steel regulatory limit breach and Apex spread', async () => {
    const exposureData = await exasolClient.queryUnifiedExposures();
    const vanguard = exposureData.results.find(r => r.entityName.includes('Vanguard'));
    assert.ok(vanguard, 'Vanguard Steel must exist');
    assert.strictEqual(vanguard.limitStatus, 'BREACHED', 'Vanguard net exposure must breach RBI limit');
    assert.ok(vanguard.totalNetExposure > vanguard.regulatoryLimit);

    const apex = exposureData.results.find(r => r.entityName.includes('Apex'));
    assert.ok(apex);
    assert.strictEqual(apex.conflictStatus, 'CRITICAL_CONFLICT', 'Apex cross-system spread must trigger conflict');
  });

  test('Explainable Loan Engine produces factor waterfall and adverse action notice', () => {
    const loan = exasolClient.tables.LOAN_APPLICATIONS.find(l => l.id === 'LN-2026-881');
    assert.ok(loan);
    const explanation = LoanExplainerEngine.explainLoanDecision(loan);
    assert.strictEqual(explanation.decision, 'DECLINED');
    assert.ok(explanation.factors.some(f => f.name.includes('DSCR') && f.impact.includes('NEGATIVE')));
    assert.ok(explanation.customerNotice.principalDeclineFactors.length > 0);

    // What-If Simulation
    const simulation = LoanExplainerEngine.simulateScenario(loan, {
      collateralIncrease: 5000000,
      debtReductionAmount: 10000000,
      resolvedBounces: 6
    });
    assert.ok(simulation.simulatedApprovalProbability > explanation.approvalProbabilityPct);
  });

  test('Exasol Month-End Close cockpit tracks critical blockers and readiness', async () => {
    const close = await exasolClient.queryMonthEndReadiness();
    assert.ok(close.stats.totalTasks > 0);
    assert.ok(close.stats.criticalBlockers >= 2, 'Should detect critical blockers');
    assert.strictEqual(close.stats.closeHealth, 'BLOCKED');
  });

  test('AI Investigation Copilot generates evidence-grounded responses for fraud questions', async () => {
    const response = await AICopilotService.processQuery('Why was TXN-8902 flagged as high risk?');
    assert.strictEqual(response.intent, 'TRANSACTION_FRAUD');
    assert.ok(response.evidence.length > 0);
    assert.ok(response.recommendedActions.length > 0);
    assert.ok(response.exasolSql.includes('TRANSACTIONS'));
  });

  test('Application Database (MongoDB / Mongoose Repository) manages cases and audit logs', async () => {
    const initialCases = await CaseRepository.getAll();
    assert.ok(initialCases.length > 0);

    // Test creating note
    const updated = await CaseRepository.addNote(initialCases[0].caseId, {
      author: 'Test Auditor',
      text: 'Verified cross-system reconciliation balance',
      actionTaken: 'AUDIT_VERIFIED'
    });
    assert.ok(updated.notes.some(n => n.text.includes('Verified cross-system')));

    // Test Audit log
    const auditLog = await AuditRepository.logEvent({
      actor: 'Test Runner',
      role: 'QA Engineer',
      action: 'SYSTEM_TEST_RUN',
      targetType: 'CASE',
      targetId: 'TEST-01',
      details: { testSuite: 'Unit & Analytical' }
    });
    assert.strictEqual(auditLog.action, 'SYSTEM_TEST_RUN');
  });
});
