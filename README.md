# FraudLens AI — Unified Financial Risk Intelligence Platform

**Track:** Money, Risk & Regulation | **Event:** ExaThon India 2026  
**Primary Analytical Database:** Exasol Personal (Columnar In-Memory SQL Engine)  
**Application & Audit Database:** MongoDB with Mongoose  
**AI Service:** Evidence-Grounded AI Investigation Copilot (with Deterministic Fallback Engine)  

---

## Executive Summary

**FraudLens AI** is a production-grade financial risk intelligence and regulatory integrity platform designed for banks, NBFCs, insurance institutions, and corporate treasury teams. 

Modern financial institutions struggle with siloed systems: transaction surveillance flags alerts without ledger context; reconciliation teams uncover variances without knowing which conglomerate entity holds the debt; credit underwriters reject loans without transparent attribution; and month-end close workflows are delayed by hidden exposure conflicts.

FraudLens AI transforms disconnected financial records into **actionable, explainable, and auditable insights** by combining **Exasol Personal's high-speed columnar analytical capabilities** with **Mongoose/MongoDB workflow case management**.

---

## Key Capabilities & Core Modules

### 1. AI-Powered Transaction Fraud & Surveillance
- **Smurfing & Structuring Detection:** Exasol temporal window functions aggregate rolling transactions between ₹40,000 and ₹49,999 within 48-hour windows, flagging syndicates attempting to evade mandatory ₹50,000 PAN reporting thresholds.
- **Layering & Flow Relay Detection:** Uses analytical `LAG()` window functions to detect rapid transit where funds (> ₹1.0 Cr) move across multiple jurisdictions in under 30 minutes with minimal retention.
- **Explainable SHAP Risk Scoring:** Quantifies factor attribution (baseline risk, velocity score, mule counterparty, dormancy reactivation) from 0 to 100 with supporting empirical evidence.
- **Interactive Money Flow Network Graph:** Visualizes accounts, mules, shell corporations, and intermediaries using **React Flow**, with animated edges indicating high-velocity money movement.

### 2. Intelligent 3-Way Reconciliation Hub
- **Multi-Source Matrix:** Reconciles Core Bank Statements, ERP General Ledgers, and Payment Gateway/Switch records simultaneously via Exasol `FULL OUTER JOIN` operations.
- **Automated Discrepancy Categorization:** Flags exact matches, unposted bank debits (e.g., CBDT Direct Corporate Tax), payment gateway fee deductions, transposition human entry errors (e.g., ₹54,300 vs ₹53,400), and delayed settlements.
- **Interactive Resolution Workflow:** Analysts can post adjusting journal vouchers directly into General Ledger accounts, updating match rates and logging decisions to the audit trail.

### 3. Unified Exposure Intelligence
- **Multi-System Consolidation:** Aggregates exposures across Core Banking, Treasury, Trade Finance, and Derivatives books for corporate conglomerates.
- **Cross-System Conflict Detection:** Surfaces discrepancies where systems diverge (e.g., Apex Infrastructure's ₹33 Cr variance from unrecorded cross-currency swaps).
- **Regulatory Limit Enforcement:** Monitors positions against RBI Large Exposure Framework / Basel III Single Borrower Limits (e.g., alerting when Vanguard Steel reaches ₹237 Cr against a ₹200 Cr limit).
- **Enforcement Directives:** One-click issuance of mandatory Margin Calls and derivative tranche halts.

### 4. Explainable Loan Decision Intelligence
- **Attribution Model:** Explains synthetic commercial and MSME credit rejections through transparent factor waterfalls (CIBIL score, Debt Service Coverage Ratio [DSCR], Debt-to-Income [DTI], Operating Cash Flow, NACH bounces, and unlisted cross-system debt).
- **Regulatory Adverse Action Notice:** Auto-generates plain-English borrower disclosure letters compliant with RBI Fair Practice Codes and FCRA guidelines.
- **Interactive "What-If" Scenario Simulator:** Allows risk officers to simulate how borrower debt reduction or collateral infusions elevate approval probability in real time.

### 5. Month-End Financial Close Readiness Cockpit
- **Centralized Close Matrix:** Tracks closing tasks across cash reconciliation, treasury MTM, intercompany loan eliminations, and fraud risk provisioning.
- **Materiality Threshold Governance:** Highlights critical blockers where open variances exceed institutional materiality (e.g., ₹10 Lakhs).
- **Sign-Off Workflow:** Enables financial controllers to sign off on reconciled accounts and export audit dossiers for external auditors.

### 6. AI Investigation Copilot
- **Evidence-Grounded Querying:** Analysts can ask conversational questions (*"Why was TXN-8902 flagged?"*, *"Show all reconciliation mismatches over ₹1 Lakh"*, *"Is Vanguard Steel breaching regulatory limits?"*).
- **Dual-Engine Architecture:** Integrates optional LLM APIs with an intelligent, deterministic financial reasoning fallback engine that delivers cited answers, next investigative actions, and verifying Exasol SQL queries.

### 7. Case Management & Immutable Audit Trail
- **MongoDB/Mongoose Workflow:** Full lifecycle case tracking (New, In Investigation, Escalated, Resolved).
- **FIU-IND Suspicious Activity Report (SAR/STR):** Generates and files compliance reports with official FIU reference numbers.
- **Complete Audit Trail:** Every status change, journal entry, margin call, and deliberation note is immutably logged with actor, timestamp, IP, and prior states.

---

## Technical Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FRAUDLENS AI FRONTEND (React 18 + Vite)              │
│   Tailwind CSS (Dark Navy) • Recharts • React Flow Network Graph       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API
┌───────────────────────────────────▼────────────────────────────────────┐
│                  FRAUDLENS BACKEND (Node.js + Express)                 │
│         AI Copilot Service • Fraud Detection Engine • Loan Explainer   │
└───────────────────────┬────────────────────────────┬───────────────────┘
                        │                            │
      Analytical Queries│           Application State│
      & Aggregations    │           & Audit Events   │
┌───────────────────────▼───────────┐    ┌───────────▼───────────────────┐
│          EXASOL PERSONAL          │    │       MONGODB / MONGOOSE      │
│     (Primary Analytical Store)    │    │      (Application Store)      │
│  • In-Memory Columnar Tables      │    │  • Investigation Cases        │
│  • 3-Way Reconciliation Views     │    │  • Analyst Deliberations      │
│  • Temporal Window Functions      │    │  • Traceable Audit Logs       │
│  • Exposure Concentration Views   │    │  • Workflow Metadata          │
└───────────────────────────────────┘    └───────────────────────────────┘
```

---

## Exasol Personal SQL Implementations

FraudLens AI demonstrates meaningful, high-performance use of Exasol Personal. The complete relational DDL is defined in `database/exasol_schema.sql`.

### Example 1: Structuring / Smurfing Window Function
```sql
SELECT 
    account_id, 
    account_name,
    COUNT(*) AS smurfed_count,
    SUM(amount) AS total_structured_amount,
    AVG(amount) AS avg_amount,
    MAX(risk_score) AS max_risk_score,
    LISTAGG(DISTINCT counterparty_name, ', ') AS recipients
FROM TRANSACTIONS
WHERE amount BETWEEN 40000 AND 49999
GROUP BY account_id, account_name
HAVING COUNT(*) >= 3
ORDER BY total_structured_amount DESC;
```

### Example 2: 3-Way Reconciliation Full Outer Join
```sql
SELECT 
    COALESCE(b.statement_ref, l.journal_id, g.gateway_order_id) AS recon_ref,
    b.amount AS bank_amount,
    l.amount AS ledger_amount,
    g.amount AS gateway_amount,
    CASE 
      WHEN b.id IS NOT NULL AND l.id IS NOT NULL AND g.id IS NOT NULL 
           AND ABS(b.amount - l.amount) < 0.01 AND ABS(l.amount - g.amount) < 0.01 THEN 'MATCHED'
      WHEN b.id IS NOT NULL AND l.id IS NOT NULL AND ABS(b.amount - l.amount) >= 0.01 THEN 'AMOUNT_DISCREPANCY'
      WHEN b.id IS NOT NULL AND l.id IS NULL THEN 'UNMATCHED_BANK'
      WHEN l.id IS NOT NULL AND b.id IS NULL THEN 'UNMATCHED_LEDGER'
      WHEN g.id IS NOT NULL AND b.id IS NULL THEN 'DELAYED_SETTLEMENT'
      ELSE 'EXCEPTION'
    END AS recon_status,
    ABS(COALESCE(b.amount, 0) - COALESCE(l.amount, 0)) AS variance_amount
FROM BANK_STATEMENTS b
FULL OUTER JOIN INTERNAL_LEDGER l ON b.statement_ref = l.journal_id
FULL OUTER JOIN PAYMENT_GATEWAY_RECORDS g ON b.statement_ref = g.gateway_order_id;
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher; tested on Node.js v24)
- npm (v10 or higher)

### 1. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Run Automated Analytical Tests
```bash
cd server
npm test
```
All 8 analytical unit and database integration tests will execute, verifying:
- Exasol Personal columnar engine initialization
- Smurfing window function detection
- 3-way reconciliation joins and unposted tax detection
- Multi-system exposure conflict and limit breach calculations
- Loan factor waterfall and What-if simulation
- Month-end close readiness aggregation
- AI Copilot deterministic reasoning
- MongoDB/Mongoose audit logging

### 3. Build & Run Application
```bash
# Build the production React frontend
cd client
npm run build

# Start the full-stack server
cd ../server
npm start
```
The server will start on `http://localhost:5050` and serve both the REST API and the compiled React frontend.

For active frontend development with Hot Module Replacement:
```bash
# In terminal 1 (Backend):
cd server
npm run dev

# In terminal 2 (Frontend):
cd client
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## Configuration (`.env`)

Create a `.env` file in the `server/` directory to configure database and AI keys:

```env
# Server Port
PORT=5050

# Exasol Personal Connection (Optional - defaults to In-Memory Columnar Engine)
EXASOL_HOST=127.0.0.1
EXASOL_PORT=8563
EXASOL_USER=sys
EXASOL_PASSWORD=exasol
EXASOL_SCHEMA=FRAUDLENS_ANALYTICS

# MongoDB Connection (Optional - falls back to Mongoose In-Memory Repository)
MONGODB_URI=mongodb://127.0.0.1:27017/fraudlens

# Optional AI LLM Keys (Falls back to deterministic grounded engine if omitted)
GEMINI_API_KEY=
OPENAI_API_KEY=
```

---

## Verification & Hackathon Demonstration Guide

When evaluating FraudLens AI for the ExaThon 2026 Money, Risk & Regulation track:
1. **Executive Cockpit:** Review the consolidated view showing 0.94ms Exasol queries, 88.5% reconciliation rate, and the ₹37 Cr Vanguard Steel limit breach. Click **"View SQL"** in the top navigation to inspect the exact Exasol Personal SQL queries.
2. **Fraud Surveillance:** Toggle to **"Money Flow Graph"** to inspect the interactive React Flow transaction network. Click any flagged transaction to view the SHAP feature waterfall breakdown.
3. **3-Way Reconciliation:** Filter by **"Unmatched Bank"** to inspect entry `REF-2026-9003` (unposted CBDT Direct Tax debit). Click **"Resolve"** to post an adjusting journal entry to `GL-110020`.
4. **Unified Exposures:** Review Vanguard Steel's ₹237 Cr net exposure against the ₹200 Cr limit. Click **"Action"** to issue a mandatory Margin Call.
5. **Explainable Loans:** Select `LN-2026-881` (Delta Agro Exports). View the adverse action reasons. Use the **What-If Simulator** sliders to pledge additional collateral and pay down debt, demonstrating how the simulated decision changes from DECLINED to APPROVED.
6. **Month-End Close:** Review the 2 critical close blockers. Click **"Sign Off"** on Cash Reconciliation to watch readiness rise.
7. **AI Copilot:** Click **"Ask Copilot"** or the bottom-right trigger. Click any suggested prompt or ask *"Why was TXN-8902 flagged?"* to see evidence-grounded answers with citations and Exasol SQL.
