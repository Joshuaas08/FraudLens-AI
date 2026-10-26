import express from 'express';
import { exasolClient } from '../database/exasolClient.js';
import { FraudDetectionEngine } from '../services/fraudDetectionEngine.js';

const router = express.Router();

// Get all analyzed transactions with explainable risk breakdown
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await FraudDetectionEngine.analyzeTransactions();
    const { riskLevel, channel, search } = req.query;

    let filtered = transactions;
    if (riskLevel && riskLevel !== 'ALL') {
      filtered = filtered.filter(t => t.risk_level === riskLevel);
    }
    if (channel && channel !== 'ALL') {
      filtered = filtered.filter(t => t.channel === channel);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(q) ||
        t.account_name.toLowerCase().includes(q) ||
        t.counterparty_name.toLowerCase().includes(q) ||
        t.account_id.toLowerCase().includes(q)
      );
    }

    res.json({
      count: filtered.length,
      transactions: filtered
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single transaction detail with explainable SHAP factors
router.get('/transactions/:id', async (req, res) => {
  try {
    const transactions = await FraudDetectionEngine.analyzeTransactions();
    const txn = transactions.find(t => t.id === req.params.id);
    if (!txn) return res.status(404).json({ error: 'Transaction not found' });
    res.json(txn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exasol Smurfing / Structuring Query
router.get('/smurfing-syndicates', async (req, res) => {
  try {
    const data = await exasolClient.querySmurfingSyndicates();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exasol Layering Query
router.get('/layering-chains', async (req, res) => {
  try {
    const data = await exasolClient.queryLayeringRings();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// React Flow Network Graph Data
router.get('/network-graph', async (req, res) => {
  try {
    const graphData = await FraudDetectionEngine.getTransactionNetworkGraph();
    res.json(graphData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
