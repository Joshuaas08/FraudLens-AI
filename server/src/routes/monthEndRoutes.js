import express from 'express';
import { exasolClient } from '../database/exasolClient.js';
import { AuditRepository } from '../database/mongoClient.js';

const router = express.Router();

router.get('/readiness', async (req, res) => {
  try {
    const data = await exasolClient.queryMonthEndReadiness();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update or sign off close task
router.post('/tasks/:id/update', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, actor } = req.body;

    const task = exasolClient.updateCloseTask(id, status, notes);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await AuditRepository.logEvent({
      actor: actor || 'Priya Sharma (Senior Accountant)',
      role: 'Financial Close Lead',
      action: status === 'COMPLETED' ? 'CLOSE_TASK_SIGNED_OFF' : 'CLOSE_TASK_STATUS_CHANGED',
      targetType: 'CLOSE_TASK',
      targetId: id,
      details: {
        taskName: task.task_name,
        newStatus: status,
        notes
      }
    });

    res.json({
      success: true,
      message: `Task ${task.task_name} marked as ${status}.`,
      task
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
