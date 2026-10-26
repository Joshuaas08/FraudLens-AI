import express from 'express';
import { exasolClient } from '../database/exasolClient.js';
import { AuditRepository } from '../database/mongoClient.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const data = await exasolClient.queryUnifiedExposures();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/facilities', (req, res) => {
  const { entityName, systemSource } = req.query;
  let facilities = exasolClient.tables.FACILITY_EXPOSURES;

  if (entityName) {
    facilities = facilities.filter(f => f.entity_name.toLowerCase().includes(entityName.toLowerCase()));
  }
  if (systemSource && systemSource !== 'ALL') {
    facilities = facilities.filter(f => f.system_source === systemSource);
  }

  res.json({ count: facilities.length, facilities });
});

// Trigger Margin Call or Limit Freeze for breached exposure
router.post('/action-exposure', async (req, res) => {
  try {
    const { entityName, actionType, requestedAmount, actor } = req.body;

    await AuditRepository.logEvent({
      actor: actor || 'Dr. Vikramaditya Sen (CRO)',
      role: 'Chief Risk Officer',
      action: actionType || 'MARGIN_CALL_ISSUED',
      targetType: 'CASE',
      targetId: entityName,
      details: {
        actionType,
        requestedAmount,
        reason: 'Consolidated cross-system exposure exceeded regulatory limits'
      }
    });

    res.json({
      success: true,
      message: `Action '${actionType}' successfully dispatched for ${entityName}. Margin call notice transmitted.`,
      entityName
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
