import express from 'express';
import { exasolClient } from '../database/exasolClient.js';
import { getMongoStatus, CaseRepository } from '../database/mongoClient.js';

const router = express.Router();

router.get('/status', (req, res) => {
  const exasolStatus = exasolClient.getSystemStatus();
  const mongoStatus = getMongoStatus();

  res.json({
    platform: "FraudLens AI — Unified Financial Risk Intelligence Platform",
    version: "1.0.0",
    event: "ExaThon India 2026",
    track: "Money, Risk & Regulation",
    status: "HEALTHY",
    databases: {
      analyticalEngine: {
        engine: "Exasol Personal (Columnar In-Memory)",
        mode: exasolStatus.engineMode,
        connected: exasolStatus.connected,
        host: exasolStatus.host,
        port: exasolStatus.port,
        schema: exasolStatus.schema,
        tablesLoaded: exasolStatus.tablesLoaded,
        metrics: exasolStatus.metrics,
        lastQueries: exasolStatus.lastQueries
      },
      applicationStore: {
        engine: "MongoDB with Mongoose",
        mode: mongoStatus.mode,
        connected: mongoStatus.connected,
        casesCount: mongoStatus.casesCount,
        auditEventsCount: mongoStatus.auditEventsCount
      }
    }
  });
});

router.get('/overview', async (req, res) => {
  try {
    const transactions = exasolClient.tables.TRANSACTIONS;
    const criticalTxns = transactions.filter(t => t.risk_level === 'CRITICAL' || t.risk_score >= 85);
    const reconData = await exasolClient.queryThreeWayReconciliation();
    const exposureData = await exasolClient.queryUnifiedExposures();
    const closeData = await exasolClient.queryMonthEndReadiness();
    const openCases = await CaseRepository.getAll({ status: 'IN_INVESTIGATION' });

    // Financial volume metrics
    const totalTxnVolume = transactions.reduce((s, t) => s + t.amount, 0);
    const totalExposureMonitored = exposureData.results.reduce((s, r) => s + r.totalGrossExposure, 0);
    const totalVarianceAtRisk = reconData.stats.totalDiscrepancyAmount;

    res.json({
      summaryCards: {
        totalTransactionVolume: totalTxnVolume,
        flaggedTransactionsCount: criticalTxns.length,
        reconciliationMatchRate: reconData.stats.matchRatePercentage,
        totalVarianceAtRisk: totalVarianceAtRisk,
        totalExposureMonitored: totalExposureMonitored,
        regulatoryBreachCount: exposureData.results.filter(r => r.limitStatus === 'BREACHED').length,
        closeReadinessPercentage: closeData.stats.readinessPct,
        activeInvestigationCases: openCases.length
      },
      recentAlerts: criticalTxns.slice(0, 5),
      recentReconExceptions: reconData.results.filter(r => r.reconStatus !== 'MATCHED').slice(0, 4),
      exposureBreaches: exposureData.results.filter(r => r.limitStatus === 'BREACHED' || r.conflictStatus === 'CRITICAL_CONFLICT'),
      closeCockpit: closeData.stats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
