import express from 'express';
import { AICopilotService } from '../services/aiCopilotService.js';

const router = express.Router();

router.post('/query', async (req, res) => {
  try {
    const { query, context } = req.body;
    if (!query) return res.status(400).json({ error: 'Query text is required' });

    const response = await AICopilotService.processQuery(query, context);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/prompts', (req, res) => {
  res.json([
    {
      id: "PROMPT-1",
      category: "Fraud Intelligence",
      label: "Why was transaction TXN-8902 flagged as Critical?",
      query: "Why was transaction TXN-8902 flagged as Critical risk, and what is the underlying smurfing pattern?"
    },
    {
      id: "PROMPT-2",
      category: "Reconciliation",
      label: "Show me all unresolved reconciliation mismatches over ₹1,00,000",
      query: "Show me all unresolved reconciliation mismatches over ₹1,00,000 and explain why REF-2026-9003 is missing in ledger."
    },
    {
      id: "PROMPT-3",
      category: "Exposure Intelligence",
      label: "What is our conflicting exposure for Vanguard Steel across systems?",
      query: "What is our conflicting exposure for Vanguard Steel across Core Banking and Derivatives, and is it breaching the RBI regulatory limit?"
    },
    {
      id: "PROMPT-4",
      category: "Loan Explainability",
      label: "Why was loan application LN-2026-881 declined?",
      query: "Why was loan application LN-2026-881 declined, and what are the specific factor impacts on the credit decision?"
    },
    {
      id: "PROMPT-5",
      category: "Month-End Close",
      label: "What are the remaining blockers for the 2026-M10 financial close?",
      query: "What are the remaining critical blockers and outstanding variances preventing our 2026-M10 month-end financial close?"
    }
  ]);
});

export default router;
