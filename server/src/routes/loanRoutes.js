import express from 'express';
import { exasolClient } from '../database/exasolClient.js';
import { LoanExplainerEngine } from '../services/loanExplainerEngine.js';

const router = express.Router();

router.get('/applications', async (req, res) => {
  try {
    const loans = exasolClient.tables.LOAN_APPLICATIONS;
    const explainedList = loans.map(loan => {
      const explanation = LoanExplainerEngine.explainLoanDecision(loan);
      return {
        ...loan,
        approvalProbabilityPct: explanation.approvalProbabilityPct,
        topFactors: explanation.factors.slice(0, 3)
      };
    });
    res.json(explainedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/applications/:id/explain', (req, res) => {
  const loan = exasolClient.tables.LOAN_APPLICATIONS.find(l => l.id === req.params.id);
  if (!loan) return res.status(404).json({ error: 'Loan application not found' });

  const explanation = LoanExplainerEngine.explainLoanDecision(loan);
  res.json({
    loan,
    ...explanation
  });
});

// Interactive What-If Simulation
router.post('/applications/:id/simulate', (req, res) => {
  const loan = exasolClient.tables.LOAN_APPLICATIONS.find(l => l.id === req.params.id);
  if (!loan) return res.status(404).json({ error: 'Loan application not found' });

  const tweaks = req.body; // { collateralIncrease, debtReductionAmount, resolvedBounces, settledUndisclosedDebt }
  const simulationResult = LoanExplainerEngine.simulateScenario(loan, tweaks);

  res.json({
    loanId: loan.id,
    applicantName: loan.applicant_name,
    simulationResult
  });
});

export default router;
