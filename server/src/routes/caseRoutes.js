import express from 'express';
import { CaseRepository, AuditRepository } from '../database/mongoClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, category, severity } = req.query;
    const filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (category && category !== 'ALL') filter.category = category;
    if (severity && severity !== 'ALL') filter.severity = severity;

    const cases = await CaseRepository.getAll(filter);
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await CaseRepository.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Case not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, category, severity, entityId, financialImpact, evidence, assignedTo, actor } = req.body;
    const caseId = `CASE-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newCase = await CaseRepository.create({
      caseId,
      title,
      category,
      severity: severity || 'MEDIUM',
      status: 'NEW',
      assignedTo: assignedTo || 'Unassigned',
      entityId,
      financialImpact: financialImpact || 0,
      currency: 'INR',
      evidence: evidence || [],
      notes: []
    });

    await AuditRepository.logEvent({
      actor: actor || 'Analyst',
      role: 'Risk Officer',
      action: 'CASE_CREATED',
      targetType: 'CASE',
      targetId: caseId,
      details: { title, severity, category }
    });

    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, actor, reason } = req.body;
    const updated = await CaseRepository.update(req.params.id, { status });
    if (!updated) return res.status(404).json({ error: 'Case not found' });

    await AuditRepository.logEvent({
      actor: actor || 'Analyst',
      role: 'Investigator',
      action: 'STATUS_UPDATE',
      targetType: 'CASE',
      targetId: req.params.id,
      details: { newStatus: status, reason }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add investigation note
router.post('/:id/notes', async (req, res) => {
  try {
    const { author, text, actionTaken } = req.body;
    if (!text) return res.status(400).json({ error: 'Note text required' });

    const updated = await CaseRepository.addNote(req.params.id, { author, text, actionTaken });
    if (!updated) return res.status(404).json({ error: 'Case not found' });

    await AuditRepository.logEvent({
      actor: author || 'Analyst',
      role: 'Investigator',
      action: 'NOTE_ADDED',
      targetType: 'CASE',
      targetId: req.params.id,
      details: { noteSummary: text.substring(0, 80), actionTaken }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate and export official SAR / STR report
router.post('/:id/generate-sar', async (req, res) => {
  try {
    const { actor } = req.body;
    const item = await CaseRepository.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Case not found' });

    await CaseRepository.update(req.params.id, { sarReportGenerated: true });

    await AuditRepository.logEvent({
      actor: actor || 'Amit Patel',
      role: 'Fraud Risk Investigator',
      action: 'SAR_REPORT_EXPORTED',
      targetType: 'CASE',
      targetId: req.params.id,
      details: {
        reportFormat: "FIU-IND_XML_v3.2",
        jurisdiction: "Financial Intelligence Unit - India",
        reportedEntity: item.entityId,
        financialVolume: item.financialImpact
      }
    });

    res.json({
      success: true,
      caseId: req.params.id,
      fiuReferenceNumber: `STR-FIU-IND-${Date.now()}`,
      reportTimestamp: new Date().toISOString(),
      status: "TRANSMITTED_TO_REGULATOR"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Audit Trail events
router.get('/audit/trail', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const events = await AuditRepository.getAll(limit);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
