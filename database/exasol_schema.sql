-- ============================================================================
-- FraudLens AI: Exasol Personal Analytical Database Schema
-- Track: Money, Risk & Regulation | ExaThon India 2026
-- Optimized for In-Memory Columnar Analytics, Window Functions & Real-time Risk
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS FRAUDLENS_ANALYTICS;
OPEN SCHEMA FRAUDLENS_ANALYTICS;

-- 1. High-Volume Financial Transactions
CREATE TABLE IF NOT EXISTS TRANSACTIONS (
    id VARCHAR(64) PRIMARY KEY,
    account_id VARCHAR(64) NOT NULL,
    account_name VARCHAR(128),
    counterparty_id VARCHAR(64) NOT NULL,
    counterparty_name VARCHAR(128),
    amount DECIMAL(18,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    channel VARCHAR(20) NOT NULL, -- UPI, RTGS, NEFT, IMPS, SWIFT, WIRE
    direction VARCHAR(10) NOT NULL, -- INBOUND, OUTBOUND
    timestamp TIMESTAMP NOT NULL,
    counterparty_bank VARCHAR(100),
    geo_country VARCHAR(50),
    geo_city VARCHAR(50),
    ip_address VARCHAR(45),
    device_id VARCHAR(64),
    mcc_code VARCHAR(10),
    status VARCHAR(20) DEFAULT 'COMPLETED', -- COMPLETED, FLAGGED, BLOCKED, HELD
    risk_score DECIMAL(5,2) DEFAULT 0.0,
    risk_level VARCHAR(20) DEFAULT 'LOW' -- LOW, MEDIUM, HIGH, CRITICAL
);

-- 2. Bank Statement Records (Core Banking / External Statement Feeds)
CREATE TABLE IF NOT EXISTS BANK_STATEMENTS (
    id VARCHAR(64) PRIMARY KEY,
    statement_ref VARCHAR(64) NOT NULL,
    account_id VARCHAR(64) NOT NULL,
    booking_date DATE NOT NULL,
    value_date DATE NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    raw_narrative VARCHAR(255),
    channel VARCHAR(20),
    matched_status VARCHAR(20) DEFAULT 'UNMATCHED' -- MATCHED, UNMATCHED, PARTIAL
);

-- 3. Internal Ledger Entries (General Ledger / ERP Records)
CREATE TABLE IF NOT EXISTS INTERNAL_LEDGER (
    id VARCHAR(64) PRIMARY KEY,
    journal_id VARCHAR(64) NOT NULL,
    account_code VARCHAR(32) NOT NULL,
    debit DECIMAL(18,2) DEFAULT 0.0,
    credit DECIMAL(18,2) DEFAULT 0.0,
    amount DECIMAL(18,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    posting_date DATE NOT NULL,
    cost_center VARCHAR(32),
    batch_id VARCHAR(64),
    description VARCHAR(255),
    recon_status VARCHAR(20) DEFAULT 'OPEN' -- OPEN, RECONCILED, EXCEPTION
);

-- 4. Payment Gateway / Switch Records (Settlement Logs)
CREATE TABLE IF NOT EXISTS PAYMENT_GATEWAY_RECORDS (
    id VARCHAR(64) PRIMARY KEY,
    gateway_order_id VARCHAR(64) NOT NULL,
    merchant_id VARCHAR(64) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    fee DECIMAL(18,2) DEFAULT 0.0,
    currency VARCHAR(3) DEFAULT 'INR',
    auth_code VARCHAR(32),
    status VARCHAR(20) DEFAULT 'CAPTURED',
    settlement_timestamp TIMESTAMP NOT NULL,
    settlement_status VARCHAR(20) DEFAULT 'PENDING'
);

-- 5. Multi-System Facility Exposures (Treasury, Trade, Core, Retail, Derivatives)
CREATE TABLE IF NOT EXISTS FACILITY_EXPOSURES (
    id VARCHAR(64) PRIMARY KEY,
    entity_id VARCHAR(64) NOT NULL,
    entity_name VARCHAR(128) NOT NULL,
    parent_group VARCHAR(128) NOT NULL,
    system_source VARCHAR(32) NOT NULL, -- CORE_BANKING, TREASURY, TRADE_FINANCE, RETAIL_LENDING, DERIVATIVES
    facility_type VARCHAR(64) NOT NULL, -- TERM_LOAN, LETTER_OF_CREDIT, BANK_GUARANTEE, FX_FORWARD, OVERDRAFT
    gross_exposure DECIMAL(18,2) NOT NULL,
    net_exposure DECIMAL(18,2) NOT NULL,
    collateral_value DECIMAL(18,2) DEFAULT 0.0,
    risk_weight DECIMAL(5,2) DEFAULT 1.0,
    regulatory_limit DECIMAL(18,2) NOT NULL,
    as_of_date DATE NOT NULL
);

-- 6. Synthetic Loan Applications (Credit & Risk Assessment)
CREATE TABLE IF NOT EXISTS LOAN_APPLICATIONS (
    id VARCHAR(64) PRIMARY KEY,
    applicant_id VARCHAR(64) NOT NULL,
    applicant_name VARCHAR(128) NOT NULL,
    business_type VARCHAR(64) NOT NULL,
    requested_amount DECIMAL(18,2) NOT NULL,
    annual_income DECIMAL(18,2) NOT NULL,
    cibil_score INTEGER NOT NULL,
    dscr DECIMAL(5,2) NOT NULL, -- Debt Service Coverage Ratio
    dti DECIMAL(5,2) NOT NULL,  -- Debt-to-Income Ratio %
    operating_cash_flow DECIMAL(18,2) NOT NULL,
    bounce_count_12m INTEGER NOT NULL,
    ltv_ratio DECIMAL(5,2) NOT NULL,
    undisclosed_debt_detected DECIMAL(18,2) DEFAULT 0.0,
    decision VARCHAR(20) NOT NULL, -- APPROVED, DECLINED, CONDITIONAL
    risk_score DECIMAL(5,2) NOT NULL,
    decision_date TIMESTAMP NOT NULL
);

-- 7. Month-End Financial Close Tasks & Checklist
CREATE TABLE IF NOT EXISTS MONTH_END_TASKS (
    id VARCHAR(64) PRIMARY KEY,
    task_name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL, -- CASH_RECON, EXPOSURE_VALIDATION, FRAUD_PROVISIONING, INTERCOMPANY, REGULATORY
    entity_code VARCHAR(32) NOT NULL,
    period VARCHAR(10) NOT NULL, -- e.g., 2026-M09
    assigned_to VARCHAR(64) NOT NULL,
    status VARCHAR(20) NOT NULL, -- COMPLETED, IN_PROGRESS, BLOCKED, NOT_STARTED
    materiality_threshold DECIMAL(18,2) NOT NULL,
    variance_amount DECIMAL(18,2) DEFAULT 0.0,
    blocker_severity VARCHAR(20) DEFAULT 'NONE', -- CRITICAL, WARNING, NONE
    completed_at TIMESTAMP
);

-- ============================================================================
-- EXASOL ANALYTICAL VIEWS
-- ============================================================================

-- View 1: 3-Way Reconciliation Matrix (Bank vs Ledger vs Gateway)
CREATE OR REPLACE VIEW V_THREE_WAY_RECONCILIATION AS
SELECT 
    COALESCE(b.statement_ref, l.journal_id, g.gateway_order_id) AS reconciliation_ref,
    b.id AS bank_record_id,
    b.amount AS bank_amount,
    b.booking_date AS bank_date,
    l.id AS ledger_record_id,
    l.amount AS ledger_amount,
    l.posting_date AS ledger_date,
    g.id AS gateway_record_id,
    g.amount AS gateway_amount,
    g.fee AS gateway_fee,
    g.settlement_timestamp AS gateway_date,
    CASE 
        WHEN b.id IS NOT NULL AND l.id IS NOT NULL AND g.id IS NOT NULL 
             AND ABS(b.amount - l.amount) < 0.01 AND ABS(l.amount - g.amount) < 0.01 THEN 'EXACT_MATCH'
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

-- View 2: Multi-System Unified Exposure Discrepancies
CREATE OR REPLACE VIEW V_UNIFIED_EXPOSURE_SUMMARY AS
SELECT 
    parent_group,
    entity_name,
    COUNT(DISTINCT system_source) AS reporting_systems_count,
    SUM(gross_exposure) AS aggregated_gross_exposure,
    SUM(net_exposure) AS aggregated_net_exposure,
    SUM(collateral_value) AS aggregated_collateral,
    MAX(regulatory_limit) AS group_regulatory_limit,
    MAX(gross_exposure) - MIN(gross_exposure) AS cross_system_variance,
    CASE 
        WHEN (MAX(gross_exposure) - MIN(gross_exposure)) > 10000000 THEN 'CRITICAL_CONFLICT'
        WHEN (MAX(gross_exposure) - MIN(gross_exposure)) > 2000000 THEN 'MODERATE_CONFLICT'
        WHEN COUNT(DISTINCT system_source) < 2 THEN 'SINGLE_SYSTEM_REPORT'
        ELSE 'CONSISTENT'
    END AS conflict_status,
    CASE 
        WHEN SUM(net_exposure) > MAX(regulatory_limit) THEN 'LIMIT_BREACHED'
        WHEN SUM(net_exposure) > MAX(regulatory_limit) * 0.85 THEN 'LIMIT_WARNING'
        ELSE 'WITHIN_LIMIT'
    END AS limit_status
FROM FACILITY_EXPOSURES
GROUP BY parent_group, entity_name;

-- View 3: Month-End Financial Close Blockers & Health
CREATE OR REPLACE VIEW V_MONTH_END_CLOSE_READINESS AS
SELECT 
    period,
    COUNT(*) AS total_close_tasks,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) AS completed_tasks,
    COUNT(CASE WHEN status = 'BLOCKED' OR blocker_severity = 'CRITICAL' THEN 1 END) AS critical_blockers,
    COUNT(CASE WHEN blocker_severity = 'WARNING' THEN 1 END) AS warning_blockers,
    SUM(CASE WHEN status != 'COMPLETED' THEN variance_amount ELSE 0 END) AS outstanding_variance_amount,
    ROUND((COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) * 100.0) / COUNT(*), 2) AS readiness_percentage
FROM MONTH_END_TASKS
GROUP BY period;
