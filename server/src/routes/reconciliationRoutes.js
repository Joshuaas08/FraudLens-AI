import express from 'express';
import { exasolClient } from '../database/exasolClient.js';
import { AuditRepository } from '../database/mongoClient.js';

const router = express.Router();

router.get('/matrix', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'ALL' ? status : null;
    const data = await exasolClient.queryThreeWayReconciliation(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resolve or post adjusting journal for a reconciliation item
router.post('/resolve-exception', async (req, res) => {
  try {
    const { refKey, action, adjustmentAmount, journalNote, actor } = req.body;

    if (!refKey) return res.status(400).json({ error: 'Missing refKey' });

    // Update state in Exasol tables
    const bankItem = exasolClient.tables.BANK_STATEMENTS.find(b => b.statement_ref === refKey);
    const ledgerItem = exasolClient.tables.INTERNAL_LEDGER.find(l => l.journal_id === refKey);

    if (bankItem) bankItem.matched_status = 'MATCHED';
    if (ledgerItem) ledgerItem.recon_status = 'RECONCILED';

    // If missing in ledger, simulate creating compensating journal entry
    if (!ledgerItem && bankItem) {
      exasolClient.tables.INTERNAL_LEDGER.push({
        id: `LDG-ADJ-${Date.now()}`,
        journal_id: refKey,
        account_code: "GL-110020",
        debit: bankItem.amount,
        credit: 0.0,
        amount: bankItem.amount,
        currency: "INR",
        posting_date: new Date().toISOString().split('T')[0],
        cost_center: "CC-ADJUSTING-VOUCHER",
        batch_id: `BAT-ADJ-${Date.now()}`,
        description: journalNote || `Manual adjusting journal posted for ${refKey}`,
        recon_status: "RECONCILED"
      });
    }

    // Log to Audit Trail in MongoDB
    await AuditRepository.logEvent({
      actor: actor || 'Priya Sharma (Senior Accountant)',
      role: 'Finance & Reconciliation Lead',
      action: 'RECONCILIATION_EXCEPTION_RESOLVED',
      targetType: 'RECON_ITEM',
      targetId: refKey,
      details: {
        actionTaken: action || 'POST_ADJUSTING_JOURNAL',
        adjustmentAmount: adjustmentAmount || bankItem?.amount || ledgerItem?.amount,
        journalNote
      }
    });

    res.json({
      success: true,
      message: `Reconciliation exception for ${refKey} successfully resolved and adjusting voucher posted.`,
      refKey
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
