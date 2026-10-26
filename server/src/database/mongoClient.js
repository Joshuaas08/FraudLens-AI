// ============================================================================
// FraudLens AI: MongoDB / Mongoose Client & Application Data Store
// Used for Case Management, Analyst Notes, Workflow Metadata, and Audit Events
// ============================================================================

import mongoose from 'mongoose';
import { seedCases, seedAuditEvents } from './seedData.js';

let isMongoConnected = false;

// In-memory fallback stores with Mongoose-compatible interface
const memoryCases = [...seedCases];
const memoryAuditEvents = [...seedAuditEvents];

// Mongoose Schema Definitions
const NoteSchema = new mongoose.Schema({
  id: { type: String, required: true },
  author: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  actionTaken: { type: String }
});

const CaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['FRAUD', 'RECONCILIATION', 'EXPOSURE', 'LOAN_AUDIT', 'CLOSE_BLOCKER'],
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM' 
  },
  status: { 
    type: String, 
    enum: ['NEW', 'IN_INVESTIGATION', 'PENDING_APPROVAL', 'RESOLVED', 'FALSE_POSITIVE', 'ESCALATED'],
    default: 'NEW' 
  },
  assignedTo: { type: String, default: 'Unassigned' },
  entityId: { type: String, required: true },
  financialImpact: { type: Number, default: 0.0 },
  currency: { type: String, default: 'INR' },
  source: { type: String, default: 'Exasol Analytical Watcher' },
  evidence: [{ type: String }],
  notes: [NoteSchema],
  sarReportGenerated: { type: Boolean, default: false }
}, { timestamps: true });

const AuditEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  actor: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  targetType: { 
    type: String, 
    enum: ['CASE', 'TRANSACTION', 'RECON_ITEM', 'LOAN_APPLICATION', 'CLOSE_TASK'],
    required: true 
  },
  targetId: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String, default: '127.0.0.1' }
});

let CaseModel;
let AuditEventModel;

try {
  CaseModel = mongoose.model('Case', CaseSchema);
  AuditEventModel = mongoose.model('AuditEvent', AuditEventSchema);
} catch (e) {
  CaseModel = mongoose.models.Case;
  AuditEventModel = mongoose.models.AuditEvent;
}

export async function initializeMongo() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    console.log(`[MongoDB] Attempting connection to: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 1500,
        connectTimeoutMS: 1500
      });
      isMongoConnected = true;
      console.log('[MongoDB] Connected successfully to native MongoDB cluster.');
      
      const count = await CaseModel.countDocuments();
      if (count === 0) {
        await CaseModel.insertMany(seedCases);
        await AuditEventModel.insertMany(seedAuditEvents);
        console.log(`[MongoDB] Initialized collections with ${seedCases.length} cases and ${seedAuditEvents.length} audit logs.`);
      }
    } catch (err) {
      isMongoConnected = false;
      console.warn(`[MongoDB] Native MongoDB connection failed (${err.message}).`);
      console.log('[MongoDB] Falling back to High-Fidelity In-Memory Repository mode (Mongoose-compatible).');
    }
  } else {
    isMongoConnected = false;
    console.log('[MongoDB] No MONGODB_URI configured. Running in High-Fidelity In-Memory Repository mode (Mongoose-compatible). Application operational.');
  }

  return { isConnected: isMongoConnected };
}

// Unified Repository API
export const CaseRepository = {
  async getAll(filter = {}) {
    if (isMongoConnected) {
      return await CaseModel.find(filter).sort({ createdAt: -1 });
    }
    let res = [...memoryCases];
    if (filter.status) res = res.filter(c => c.status === filter.status);
    if (filter.category) res = res.filter(c => c.category === filter.category);
    if (filter.severity) res = res.filter(c => c.severity === filter.severity);
    return res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(caseId) {
    if (isMongoConnected) {
      return await CaseModel.findOne({ caseId });
    }
    return memoryCases.find(c => c.caseId === caseId) || null;
  },

  async create(caseData) {
    if (isMongoConnected) {
      return await CaseModel.create(caseData);
    }
    const newCase = {
      ...caseData,
      notes: caseData.notes || [],
      evidence: caseData.evidence || [],
      sarReportGenerated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryCases.unshift(newCase);
    return newCase;
  },

  async update(caseId, updates) {
    if (isMongoConnected) {
      return await CaseModel.findOneAndUpdate({ caseId }, { ...updates, updatedAt: new Date() }, { new: true });
    }
    const idx = memoryCases.findIndex(c => c.caseId === caseId);
    if (idx === -1) return null;
    memoryCases[idx] = {
      ...memoryCases[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return memoryCases[idx];
  },

  async addNote(caseId, noteData) {
    const note = {
      id: `NOTE-${Date.now()}`,
      author: noteData.author || 'Analyst',
      text: noteData.text,
      timestamp: new Date().toISOString(),
      actionTaken: noteData.actionTaken || 'NOTE_ADDED'
    };

    if (isMongoConnected) {
      return await CaseModel.findOneAndUpdate(
        { caseId },
        { $push: { notes: note }, updatedAt: new Date() },
        { new: true }
      );
    }

    const item = memoryCases.find(c => c.caseId === caseId);
    if (item) {
      item.notes.push(note);
      item.updatedAt = new Date().toISOString();
      return item;
    }
    return null;
  }
};

export const AuditRepository = {
  async getAll(limit = 100) {
    if (isMongoConnected) {
      return await AuditEventModel.find().sort({ timestamp: -1 }).limit(limit);
    }
    return [...memoryAuditEvents]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },

  async logEvent(eventData) {
    const event = {
      eventId: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: eventData.actor || 'System Analyst',
      role: eventData.role || 'Investigator',
      action: eventData.action,
      targetType: eventData.targetType,
      targetId: eventData.targetId,
      details: eventData.details || {},
      ipAddress: eventData.ipAddress || '127.0.0.1'
    };

    if (isMongoConnected) {
      return await AuditEventModel.create(event);
    }
    memoryAuditEvents.unshift(event);
    return event;
  }
};

export function getMongoStatus() {
  return {
    connected: isMongoConnected,
    mode: isMongoConnected ? 'NATIVE_MONGODB' : 'IN_MEMORY_PERSISTED',
    casesCount: memoryCases.length,
    auditEventsCount: memoryAuditEvents.length
  };
}
