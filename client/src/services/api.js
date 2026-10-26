// ============================================================================
// FraudLens AI: Frontend API Client
// Handles communication with Express backend & Exasol Analytical Engine
// ============================================================================

const API_BASE = '/api';

export const api = {
  // System Status
  async getSystemStatus() {
    const res = await fetch(`${API_BASE}/analytics/status`);
    if (!res.ok) throw new Error('Failed to load system status');
    return await res.json();
  },

  async getOverview() {
    const res = await fetch(`${API_BASE}/analytics/overview`);
    if (!res.ok) throw new Error('Failed to load overview data');
    return await res.json();
  },

  // Fraud Detection
  async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/fraud/transactions?${query}`);
    if (!res.ok) throw new Error('Failed to load transactions');
    return await res.json();
  },

  async getTransactionDetail(id) {
    const res = await fetch(`${API_BASE}/fraud/transactions/${id}`);
    if (!res.ok) throw new Error('Failed to load transaction detail');
    return await res.json();
  },

  async getSmurfingData() {
    const res = await fetch(`${API_BASE}/fraud/smurfing-syndicates`);
    if (!res.ok) throw new Error('Failed to load smurfing data');
    return await res.json();
  },

  async getNetworkGraph() {
    const res = await fetch(`${API_BASE}/fraud/network-graph`);
    if (!res.ok) throw new Error('Failed to load network graph');
    return await res.json();
  },

  // 3-Way Reconciliation
  async getReconciliationMatrix(status = 'ALL') {
    const res = await fetch(`${API_BASE}/reconciliation/matrix?status=${status}`);
    if (!res.ok) throw new Error('Failed to load reconciliation matrix');
    return await res.json();
  },

  async resolveReconciliationException(payload) {
    const res = await fetch(`${API_BASE}/reconciliation/resolve-exception`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to resolve exception');
    return await res.json();
  },

  // Exposures
  async getUnifiedExposures() {
    const res = await fetch(`${API_BASE}/exposure/summary`);
    if (!res.ok) throw new Error('Failed to load exposures');
    return await res.json();
  },

  async getFacilities(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/exposure/facilities?${query}`);
    if (!res.ok) throw new Error('Failed to load facilities');
    return await res.json();
  },

  async takeExposureAction(payload) {
    const res = await fetch(`${API_BASE}/exposure/action-exposure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to dispatch exposure action');
    return await res.json();
  },

  // Loan Explainability
  async getLoanApplications() {
    const res = await fetch(`${API_BASE}/loans/applications`);
    if (!res.ok) throw new Error('Failed to load loan applications');
    return await res.json();
  },

  async explainLoan(id) {
    const res = await fetch(`${API_BASE}/loans/applications/${id}/explain`);
    if (!res.ok) throw new Error('Failed to get loan explanation');
    return await res.json();
  },

  async simulateLoanScenario(id, tweaks) {
    const res = await fetch(`${API_BASE}/loans/applications/${id}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tweaks)
    });
    if (!res.ok) throw new Error('Failed to simulate loan scenario');
    return await res.json();
  },

  // Month-End Close
  async getMonthEndReadiness() {
    const res = await fetch(`${API_BASE}/month-end/readiness`);
    if (!res.ok) throw new Error('Failed to load month-end readiness');
    return await res.json();
  },

  async updateCloseTask(id, payload) {
    const res = await fetch(`${API_BASE}/month-end/tasks/${id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update close task');
    return await res.json();
  },

  // Case Management & Audit
  async getCases(filter = {}) {
    const query = new URLSearchParams(filter).toString();
    const res = await fetch(`${API_BASE}/cases?${query}`);
    if (!res.ok) throw new Error('Failed to load cases');
    return await res.json();
  },

  async updateCaseStatus(id, status, reason = '') {
    const res = await fetch(`${API_BASE}/cases/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason, actor: 'Current Analyst' })
    });
    if (!res.ok) throw new Error('Failed to update case status');
    return await res.json();
  },

  async addCaseNote(id, note) {
    const res = await fetch(`${API_BASE}/cases/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error('Failed to add case note');
    return await res.json();
  },

  async generateSarReport(id) {
    const res = await fetch(`${API_BASE}/cases/${id}/generate-sar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'Amit Patel (Fraud Investigator)' })
    });
    if (!res.ok) throw new Error('Failed to generate SAR report');
    return await res.json();
  },

  async getAuditTrail(limit = 50) {
    const res = await fetch(`${API_BASE}/cases/audit/trail?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to load audit trail');
    return await res.json();
  },

  // AI Copilot
  async queryCopilot(query, context = {}) {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, context })
    });
    if (!res.ok) throw new Error('Failed to query Copilot');
    return await res.json();
  },

  async getCopilotPrompts() {
    const res = await fetch(`${API_BASE}/copilot/prompts`);
    if (!res.ok) throw new Error('Failed to load suggested prompts');
    return await res.json();
  }
};
