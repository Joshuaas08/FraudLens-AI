// ============================================================================
// FraudLens AI: Comprehensive Seed Data for Financial Analytics & Simulation
// ============================================================================

export const seedTransactions = [
  // Smurfing / Structuring Ring (Evading 50k PAN threshold)
  {
    id: "TXN-8901",
    account_id: "ACC-IN-4901",
    account_name: "Mehra Traders & Supply",
    counterparty_id: "ACC-MULE-101",
    counterparty_name: "Karan Verma (Retail)",
    amount: 48900.00,
    currency: "INR",
    channel: "UPI",
    direction: "OUTBOUND",
    timestamp: "2026-10-25T08:14:22Z",
    counterparty_bank: "HDFC Bank",
    geo_country: "India",
    geo_city: "Surat",
    ip_address: "103.21.58.12",
    device_id: "DEV-AND-9921",
    mcc_code: "5399",
    status: "FLAGGED",
    risk_score: 88.5,
    risk_level: "HIGH"
  },
  {
    id: "TXN-8902",
    account_id: "ACC-IN-4901",
    account_name: "Mehra Traders & Supply",
    counterparty_id: "ACC-MULE-102",
    counterparty_name: "Ramesh Solanki (Retail)",
    amount: 49200.00,
    currency: "INR",
    channel: "IMPS",
    direction: "OUTBOUND",
    timestamp: "2026-10-25T09:30:10Z",
    counterparty_bank: "ICICI Bank",
    geo_country: "India",
    geo_city: "Surat",
    ip_address: "103.21.58.12",
    device_id: "DEV-AND-9921",
    mcc_code: "5399",
    status: "FLAGGED",
    risk_score: 91.0,
    risk_level: "CRITICAL"
  },
  {
    id: "TXN-8903",
    account_id: "ACC-IN-4901",
    account_name: "Mehra Traders & Supply",
    counterparty_id: "ACC-MULE-103",
    counterparty_name: "Suresh P (Retail)",
    amount: 47800.00,
    currency: "INR",
    channel: "UPI",
    direction: "OUTBOUND",
    timestamp: "2026-10-25T11:45:00Z",
    counterparty_bank: "State Bank of India",
    geo_country: "India",
    geo_city: "Surat",
    ip_address: "103.21.58.12",
    device_id: "DEV-AND-9921",
    mcc_code: "5399",
    status: "FLAGGED",
    risk_score: 93.0,
    risk_level: "CRITICAL"
  },
  {
    id: "TXN-8904",
    account_id: "ACC-IN-4901",
    account_name: "Mehra Traders & Supply",
    counterparty_id: "ACC-MULE-104",
    counterparty_name: "Deepak Joshi (Retail)",
    amount: 49500.00,
    currency: "INR",
    channel: "IMPS",
    direction: "OUTBOUND",
    timestamp: "2026-10-25T14:20:30Z",
    counterparty_bank: "Axis Bank",
    geo_country: "India",
    geo_city: "Ahmedabad",
    ip_address: "103.21.58.12",
    device_id: "DEV-AND-9921",
    mcc_code: "5399",
    status: "FLAGGED",
    risk_score: 94.5,
    risk_level: "CRITICAL"
  },
  {
    id: "TXN-8905",
    account_id: "ACC-IN-4901",
    account_name: "Mehra Traders & Supply",
    counterparty_id: "ACC-MULE-105",
    counterparty_name: "Anil Patel (Retail)",
    amount: 48500.00,
    currency: "INR",
    channel: "UPI",
    direction: "OUTBOUND",
    timestamp: "2026-10-25T16:05:15Z",
    counterparty_bank: "Kotak Mahindra Bank",
    geo_country: "India",
    geo_city: "Ahmedabad",
    ip_address: "103.21.58.12",
    device_id: "DEV-AND-9921",
    mcc_code: "5399",
    status: "FLAGGED",
    risk_score: 96.0,
    risk_level: "CRITICAL"
  },
  {
    id: "TXN-8906",
    account_id: "ACC-IN-4901",
    account_name: "Mehra Traders & Supply",
    counterparty_id: "ACC-MULE-106",
    counterparty_name: "Pooja Mehta (Retail)",
    amount: 49100.00,
    currency: "INR",
    channel: "UPI",
    direction: "OUTBOUND",
    timestamp: "2026-10-25T18:40:00Z",
    counterparty_bank: "Punjab National Bank",
    geo_country: "India",
    geo_city: "Surat",
    ip_address: "103.21.58.12",
    device_id: "DEV-AND-9921",
    mcc_code: "5399",
    status: "FLAGGED",
    risk_score: 97.5,
    risk_level: "CRITICAL"
  },

  // Rapid Layering Ring (High Velocity Cross-Border Layering)
  {
    id: "TXN-7701",
    account_id: "ACC-OFF-882",
    account_name: "Horizon Shell Investments Ltd",
    counterparty_id: "ACC-MID-551",
    counterparty_name: "Delta Apex Offshore Holdings",
    amount: 14500000.00,
    currency: "INR",
    channel: "RTGS",
    direction: "OUTBOUND",
    timestamp: "2026-10-26T04:10:00Z",
    counterparty_bank: "Standard Chartered",
    geo_country: "Mauritius",
    geo_city: "Port Louis",
    ip_address: "196.27.104.3",
    device_id: "DEV-API-772",
    mcc_code: "6211",
    status: "FLAGGED",
    risk_score: 89.0,
    risk_level: "HIGH"
  },
  {
    id: "TXN-7702",
    account_id: "ACC-MID-551",
    account_name: "Delta Apex Offshore Holdings",
    counterparty_id: "ACC-SHELL-332",
    counterparty_name: "Starlight Logistics FZE",
    amount: 14250000.00,
    currency: "INR",
    channel: "SWIFT",
    direction: "OUTBOUND",
    timestamp: "2026-10-26T04:18:00Z",
    counterparty_bank: "Emirates NBD",
    geo_country: "UAE",
    geo_city: "Dubai",
    ip_address: "94.200.12.8",
    device_id: "DEV-API-772",
    mcc_code: "4789",
    status: "FLAGGED",
    risk_score: 94.0,
    risk_level: "CRITICAL"
  },
  {
    id: "TXN-7703",
    account_id: "ACC-SHELL-332",
    account_name: "Starlight Logistics FZE",
    counterparty_id: "ACC-CORP-900",
    counterparty_name: "Apex Logistics India Pvt Ltd",
    amount: 14100000.00,
    currency: "INR",
    channel: "RTGS",
    direction: "OUTBOUND",
    timestamp: "2026-10-26T04:26:00Z",
    counterparty_bank: "State Bank of India",
    geo_country: "India",
    geo_city: "Mumbai",
    ip_address: "94.200.12.8",
    device_id: "DEV-API-994",
    mcc_code: "4789",
    status: "FLAGGED",
    risk_score: 96.5,
    risk_level: "CRITICAL"
  },

  // Dormant Account Reactivation & Rapid Drain
  {
    id: "TXN-6601",
    account_id: "ACC-DORM-701",
    account_name: "Vikrant Mehra (Personal NRI)",
    counterparty_id: "ACC-EXT-998",
    counterparty_name: "Global Escrow Geneva",
    amount: 7500000.00,
    currency: "INR",
    channel: "SWIFT",
    direction: "INBOUND",
    timestamp: "2026-10-26T06:00:00Z",
    counterparty_bank: "UBS Switzerland",
    geo_country: "Switzerland",
    geo_city: "Geneva",
    ip_address: "185.122.40.11",
    device_id: "DEV-WEB-551",
    mcc_code: "6011",
    status: "FLAGGED",
    risk_score: 82.0,
    risk_level: "HIGH"
  },
  {
    id: "TXN-6602",
    account_id: "ACC-DORM-701",
    account_name: "Vikrant Mehra (Personal NRI)",
    counterparty_id: "ACC-CRYPTO-88",
    counterparty_name: "CoinVertex P2P Desk",
    amount: 2500000.00,
    currency: "INR",
    channel: "RTGS",
    direction: "OUTBOUND",
    timestamp: "2026-10-26T06:14:00Z",
    counterparty_bank: "Yes Bank",
    geo_country: "India",
    geo_city: "Delhi",
    ip_address: "185.122.40.11",
    device_id: "DEV-WEB-551",
    mcc_code: "6051",
    status: "FLAGGED",
    risk_score: 91.5,
    risk_level: "CRITICAL"
  },
  {
    id: "TXN-6603",
    account_id: "ACC-DORM-701",
    account_name: "Vikrant Mehra (Personal NRI)",
    counterparty_id: "ACC-MULE-201",
    counterparty_name: "Sanjay Bullion Trading",
    amount: 3000000.00,
    currency: "INR",
    channel: "RTGS",
    direction: "OUTBOUND",
    timestamp: "2026-10-26T06:22:00Z",
    counterparty_bank: "Federal Bank",
    geo_country: "India",
    geo_city: "Jaipur",
    ip_address: "185.122.40.11",
    device_id: "DEV-WEB-551",
    mcc_code: "5944",
    status: "FLAGGED",
    risk_score: 93.0,
    risk_level: "CRITICAL"
  },
  {
    id: "TXN-6604",
    account_id: "ACC-DORM-701",
    account_name: "Vikrant Mehra (Personal NRI)",
    counterparty_id: "ACC-MULE-202",
    counterparty_name: "Naveen Cash Voucher Hub",
    amount: 1950000.00,
    currency: "INR",
    channel: "RTGS",
    direction: "OUTBOUND",
    timestamp: "2026-10-26T06:31:00Z",
    counterparty_bank: "IndusInd Bank",
    geo_country: "India",
    geo_city: "Gurugram",
    ip_address: "185.122.40.11",
    device_id: "DEV-WEB-551",
    mcc_code: "6540",
    status: "FLAGGED",
    risk_score: 95.0,
    risk_level: "CRITICAL"
  },

  // Legitimate High-Volume Corporate Transactions (Baseline)
  {
    id: "TXN-5011",
    account_id: "ACC-CORP-101",
    account_name: "Tata Steel Logistics Ltd",
    counterparty_id: "ACC-VEND-401",
    counterparty_name: "Jindal Rail Components",
    amount: 3840000.00,
    currency: "INR",
    channel: "RTGS",
    direction: "OUTBOUND",
    timestamp: "2026-10-25T10:15:00Z",
    counterparty_bank: "State Bank of India",
    geo_country: "India",
    geo_city: "Jamshedpur",
    ip_address: "115.112.90.4",
    device_id: "DEV-ERP-101",
    mcc_code: "5051",
    status: "COMPLETED",
    risk_score: 12.0,
    risk_level: "LOW"
  },
  {
    id: "TXN-5012",
    account_id: "ACC-CORP-102",
    account_name: "Infosys Cloud Services",
    counterparty_id: "ACC-VEND-402",
    counterparty_name: "Microsoft India Operations",
    amount: 8200000.00,
    currency: "INR",
    channel: "NEFT",
    direction: "OUTBOUND",
    timestamp: "2026-10-25T11:00:00Z",
    counterparty_bank: "Citibank NA",
    geo_country: "India",
    geo_city: "Bengaluru",
    ip_address: "182.72.64.20",
    device_id: "DEV-ERP-202",
    mcc_code: "7372",
    status: "COMPLETED",
    risk_score: 8.5,
    risk_level: "LOW"
  },
  {
    id: "TXN-5013",
    account_id: "ACC-CORP-103",
    account_name: "Reliance Retail Supply Chain",
    counterparty_id: "ACC-VEND-403",
    counterparty_name: "Unilever Consumer Goods",
    amount: 12450000.00,
    currency: "INR",
    channel: "RTGS",
    direction: "OUTBOUND",
    timestamp: "2026-10-26T02:30:00Z",
    counterparty_bank: "HDFC Bank",
    geo_country: "India",
    geo_city: "Mumbai",
    ip_address: "103.19.88.55",
    device_id: "DEV-ERP-303",
    mcc_code: "5411",
    status: "COMPLETED",
    risk_score: 14.2,
    risk_level: "LOW"
  },
  {
    id: "TXN-5014",
    account_id: "ACC-CORP-104",
    account_name: "Apollo Hospitals Enterprise",
    counterparty_id: "ACC-VEND-404",
    counterparty_name: "Siemens Healthcare Diagnostics",
    amount: 4500000.00,
    currency: "INR",
    channel: "RTGS",
    direction: "OUTBOUND",
    timestamp: "2026-10-26T05:12:00Z",
    counterparty_bank: "Deutsche Bank",
    geo_country: "India",
    geo_city: "Chennai",
    ip_address: "122.165.41.9",
    device_id: "DEV-ERP-404",
    mcc_code: "8062",
    status: "COMPLETED",
    risk_score: 9.8,
    risk_level: "LOW"
  },
  {
    id: "TXN-5015",
    account_id: "ACC-CORP-105",
    account_name: "Adani Green Energy Ltd",
    counterparty_id: "ACC-VEND-405",
    counterparty_name: "Suzlon Wind Systems",
    amount: 29800000.00,
    currency: "INR",
    channel: "RTGS",
    direction: "OUTBOUND",
    timestamp: "2026-10-26T07:45:00Z",
    counterparty_bank: "Bank of Baroda",
    geo_country: "India",
    geo_city: "Ahmedabad",
    ip_address: "103.24.12.90",
    device_id: "DEV-ERP-505",
    mcc_code: "4911",
    status: "COMPLETED",
    risk_score: 18.0,
    risk_level: "LOW"
  }
];

// 3-Way Reconciliation Records
export const seedBankStatements = [
  {
    id: "BNK-001",
    statement_ref: "REF-2026-9001",
    account_id: "AC-MAIN-01",
    booking_date: "2026-10-24",
    value_date: "2026-10-24",
    amount: 154000.00,
    currency: "INR",
    raw_narrative: "CMS-COLL/PAYTM-PG/REF-2026-9001",
    channel: "PG_SWEEP",
    matched_status: "MATCHED"
  },
  {
    id: "BNK-002",
    statement_ref: "REF-2026-9002",
    account_id: "AC-MAIN-01",
    booking_date: "2026-10-24",
    value_date: "2026-10-24",
    amount: 248950.00, // Gateway deduces fee 1,050 => Ledger has 250,000
    currency: "INR",
    raw_narrative: "RAZORPAY-SETTLE/NET/REF-2026-9002",
    channel: "PG_SWEEP",
    matched_status: "AMOUNT_DISCREPANCY"
  },
  {
    id: "BNK-003",
    statement_ref: "REF-2026-9003",
    account_id: "AC-MAIN-01",
    booking_date: "2026-10-24",
    value_date: "2026-10-24",
    amount: 420000.00, // Missing in Ledger (Bank direct tax debit)
    currency: "INR",
    raw_narrative: "CHQ-RTGS/DIRECT-TAX/CBDT-CORP-ADV-TAX",
    channel: "RTGS",
    matched_status: "UNMATCHED_LEDGER"
  },
  {
    id: "BNK-004",
    statement_ref: "REF-2026-9004",
    account_id: "AC-MAIN-01",
    booking_date: "2026-10-25",
    value_date: "2026-10-25",
    amount: 88500.00,
    currency: "INR",
    raw_narrative: "NEFT-IN/ZEE-ENTERTAINMENT/ADV-OCT",
    channel: "NEFT",
    matched_status: "MATCHED"
  },
  {
    id: "BNK-005",
    statement_ref: "REF-2026-9005",
    account_id: "AC-MAIN-01",
    booking_date: "2026-10-25",
    value_date: "2026-10-25",
    amount: 54300.00, // Transposition discrepancy: Ledger entered 53400
    currency: "INR",
    raw_narrative: "IMPS/VENDOR-PAY/SUPPLIER-552",
    channel: "IMPS",
    matched_status: "AMOUNT_DISCREPANCY"
  },
  {
    id: "BNK-006",
    statement_ref: "REF-2026-9006",
    account_id: "AC-MAIN-01",
    booking_date: "2026-10-25",
    value_date: "2026-10-25",
    amount: 1850000.00,
    currency: "INR",
    raw_narrative: "RTGS-OUT/DELL-INDIA-HW-PURCHASE",
    channel: "RTGS",
    matched_status: "MATCHED"
  },
  {
    id: "BNK-007",
    statement_ref: "REF-2026-9007",
    account_id: "AC-MAIN-01",
    booking_date: "2026-10-25",
    value_date: "2026-10-25",
    amount: 675000.00, // Duplicate entry in Bank
    currency: "INR",
    raw_narrative: "DUP-DEBIT/SWITCH-RETRY/VENDOR-PAY-9007",
    channel: "RTGS",
    matched_status: "DUPLICATE_ENTRY"
  },
  {
    id: "BNK-008",
    statement_ref: "REF-2026-9008",
    account_id: "AC-MAIN-01",
    booking_date: "2026-10-26",
    value_date: "2026-10-26",
    amount: 310000.00,
    currency: "INR",
    raw_narrative: "UPI-BULK-CREDIT/MERCHANT-AGG",
    channel: "UPI",
    matched_status: "MATCHED"
  }
];

export const seedInternalLedger = [
  {
    id: "LDG-001",
    journal_id: "REF-2026-9001",
    account_code: "GL-110020",
    debit: 154000.00,
    credit: 0.0,
    amount: 154000.00,
    currency: "INR",
    posting_date: "2026-10-24",
    cost_center: "CC-MUMBAI-TREASURY",
    batch_id: "BAT-2026-10-24-A",
    description: "Paytm PG Settlement Clearance",
    recon_status: "RECONCILED"
  },
  {
    id: "LDG-002",
    journal_id: "REF-2026-9002",
    account_code: "GL-110020",
    debit: 250000.00, // Gross amount recorded; bank received 248,950
    credit: 0.0,
    amount: 250000.00,
    currency: "INR",
    posting_date: "2026-10-24",
    cost_center: "CC-MUMBAI-TREASURY",
    batch_id: "BAT-2026-10-24-A",
    description: "Razorpay Daily E-comm Batched Inflow",
    recon_status: "EXCEPTION"
  },
  {
    id: "LDG-004",
    journal_id: "REF-2026-9004",
    account_code: "GL-110020",
    debit: 88500.00,
    credit: 0.0,
    amount: 88500.00,
    currency: "INR",
    posting_date: "2026-10-25",
    cost_center: "CC-MEDIA-COMM",
    batch_id: "BAT-2026-10-25-A",
    description: "Media License Advance Received",
    recon_status: "RECONCILED"
  },
  {
    id: "LDG-005",
    journal_id: "REF-2026-9005",
    account_code: "GL-210040",
    debit: 0.0,
    credit: 53400.00, // Transposition error (Bank is 54,300)
    amount: 53400.00,
    currency: "INR",
    posting_date: "2026-10-25",
    cost_center: "CC-PROCUREMENT",
    batch_id: "BAT-2026-10-25-B",
    description: "Vendor Raw Materials Supplier 552",
    recon_status: "EXCEPTION"
  },
  {
    id: "LDG-006",
    journal_id: "REF-2026-9006",
    account_code: "GL-150010",
    debit: 0.0,
    credit: 1850000.00,
    amount: 1850000.00,
    currency: "INR",
    posting_date: "2026-10-25",
    cost_center: "CC-IT-INFRA",
    batch_id: "BAT-2026-10-25-C",
    description: "Dell Enterprise Server Infrastructure",
    recon_status: "RECONCILED"
  },
  {
    id: "LDG-007",
    journal_id: "REF-2026-9007",
    account_code: "GL-210040",
    debit: 0.0,
    credit: 675000.00, // Only 1 debit in ledger; bank has duplicate 675k
    amount: 675000.00,
    currency: "INR",
    posting_date: "2026-10-25",
    cost_center: "CC-PROCUREMENT",
    batch_id: "BAT-2026-10-25-B",
    description: "Logistics Fleet Maintenance Q3",
    recon_status: "EXCEPTION"
  },
  {
    id: "LDG-008",
    journal_id: "REF-2026-9008",
    account_code: "GL-110020",
    debit: 310000.00,
    credit: 0.0,
    amount: 310000.00,
    currency: "INR",
    posting_date: "2026-10-26",
    cost_center: "CC-RETAIL-BANKING",
    batch_id: "BAT-2026-10-26-A",
    description: "UPI Point-of-Sale Settlement",
    recon_status: "RECONCILED"
  },
  {
    id: "LDG-009",
    journal_id: "REF-2026-9009",
    account_code: "GL-210040",
    debit: 0.0,
    credit: 890000.00, // Missing in Bank (Unpresented vendor cheque)
    amount: 890000.00,
    currency: "INR",
    posting_date: "2026-10-26",
    cost_center: "CC-PROJECTS",
    batch_id: "BAT-2026-10-26-B",
    description: "Unpresented Cheque to Larsen Heavy Engineering",
    recon_status: "OPEN"
  }
];

export const seedPaymentGateway = [
  {
    id: "PG-001",
    gateway_order_id: "REF-2026-9001",
    merchant_id: "MERCH-PAYTM-99",
    amount: 154000.00,
    fee: 0.0,
    currency: "INR",
    auth_code: "AUTH-89211",
    status: "CAPTURED",
    settlement_timestamp: "2026-10-24T04:00:00Z",
    settlement_status: "SETTLED"
  },
  {
    id: "PG-002",
    gateway_order_id: "REF-2026-9002",
    merchant_id: "MERCH-RAZOR-44",
    amount: 250000.00,
    fee: 1050.00, // Explains bank net of 248,950
    currency: "INR",
    auth_code: "AUTH-99120",
    status: "CAPTURED",
    settlement_timestamp: "2026-10-24T05:30:00Z",
    settlement_status: "SETTLED"
  },
  {
    id: "PG-010",
    gateway_order_id: "REF-2026-9010",
    merchant_id: "MERCH-STRIPE-12",
    amount: 720000.00,
    fee: 14400.00,
    currency: "INR",
    auth_code: "AUTH-44109",
    status: "CAPTURED",
    settlement_timestamp: "2026-10-21T10:00:00Z",
    settlement_status: "DELAYED_PENDING" // T+5 delayed settlement
  }
];

// Multi-System Facility Exposures
export const seedFacilityExposures = [
  {
    id: "EXP-001",
    entity_id: "ENT-APEX-01",
    entity_name: "Apex Infrastructure & Ports Group",
    parent_group: "Apex Conglomerate Holdings",
    system_source: "CORE_BANKING",
    facility_type: "TERM_LOAN",
    gross_exposure: 1120000000.00, // 112 Cr
    net_exposure: 980000000.00,
    collateral_value: 340000000.00,
    risk_weight: 1.0,
    regulatory_limit: 2200000000.00,
    as_of_date: "2026-10-25"
  },
  {
    id: "EXP-002",
    entity_id: "ENT-APEX-01",
    entity_name: "Apex Infrastructure & Ports Group",
    parent_group: "Apex Conglomerate Holdings",
    system_source: "TREASURY",
    facility_type: "FX_FORWARD",
    gross_exposure: 1450000000.00, // 145 Cr (Conflicting: 33 Cr unrecorded swap in Core Banking)
    net_exposure: 1390000000.00,
    collateral_value: 120000000.00,
    risk_weight: 1.2,
    regulatory_limit: 2200000000.00,
    as_of_date: "2026-10-25"
  },
  {
    id: "EXP-003",
    entity_id: "ENT-APEX-01",
    entity_name: "Apex Infrastructure & Ports Group",
    parent_group: "Apex Conglomerate Holdings",
    system_source: "TRADE_FINANCE",
    facility_type: "LETTER_OF_CREDIT",
    gross_exposure: 450000000.00, // 45 Cr
    net_exposure: 410000000.00,
    collateral_value: 90000000.00,
    risk_weight: 0.8,
    regulatory_limit: 2200000000.00,
    as_of_date: "2026-10-25"
  },
  {
    id: "EXP-004",
    entity_id: "ENT-VANGUARD-02",
    entity_name: "Vanguard Steel & Mining Ltd",
    parent_group: "Vanguard Global Industries",
    system_source: "CORE_BANKING",
    facility_type: "TERM_LOAN",
    gross_exposure: 1850000000.00,
    net_exposure: 1720000000.00,
    collateral_value: 650000000.00,
    risk_weight: 1.1,
    regulatory_limit: 2000000000.00, // Close to limit
    as_of_date: "2026-10-25"
  },
  {
    id: "EXP-005",
    entity_id: "ENT-VANGUARD-02",
    entity_name: "Vanguard Steel & Mining Ltd",
    parent_group: "Vanguard Global Industries",
    system_source: "DERIVATIVES",
    facility_type: "COMMODITY_SWAP",
    gross_exposure: 680000000.00,
    net_exposure: 650000000.00,
    collateral_value: 80000000.00,
    risk_weight: 1.5,
    regulatory_limit: 2000000000.00, // Aggregate Net: 2.37 Cr > 2.0 Cr Limit (BREACH!)
    as_of_date: "2026-10-25"
  },
  {
    id: "EXP-006",
    entity_id: "ENT-RELIANCE-03",
    entity_name: "Zenith Petrochemicals Ltd",
    parent_group: "Zenith Holdings",
    system_source: "CORE_BANKING",
    facility_type: "WORKING_CAPITAL",
    gross_exposure: 890000000.00,
    net_exposure: 750000000.00,
    collateral_value: 450000000.00,
    risk_weight: 0.9,
    regulatory_limit: 1800000000.00,
    as_of_date: "2026-10-25"
  },
  {
    id: "EXP-007",
    entity_id: "ENT-RELIANCE-03",
    entity_name: "Zenith Petrochemicals Ltd",
    parent_group: "Zenith Holdings",
    system_source: "TRADE_FINANCE",
    facility_type: "BANK_GUARANTEE",
    gross_exposure: 910000000.00,
    net_exposure: 760000000.00,
    collateral_value: 380000000.00,
    risk_weight: 0.9,
    regulatory_limit: 1800000000.00,
    as_of_date: "2026-10-25"
  },
  {
    id: "EXP-008",
    entity_id: "ENT-NOVA-04",
    entity_name: "Nova Cloud Softwares India",
    parent_group: "Nova Global Tech",
    system_source: "CORE_BANKING",
    facility_type: "CREDIT_LINE",
    gross_exposure: 120000000.00,
    net_exposure: 95000000.00,
    collateral_value: 150000000.00,
    risk_weight: 0.5,
    regulatory_limit: 500000000.00,
    as_of_date: "2026-10-25"
  }
];

// Synthetic Loan Applications for Explainability
export const seedLoanApplications = [
  {
    id: "LN-2026-881",
    applicant_id: "APP-SME-109",
    applicant_name: "Delta Agro Exports LLP",
    business_type: "Agricultural Wholesale",
    requested_amount: 15000000.00, // 1.5 Cr
    annual_income: 18500000.00,
    cibil_score: 618,
    dscr: 0.82, // Min req 1.25 -> Primary Decline Driver
    dti: 68.5,  // Max allowed 50%
    operating_cash_flow: -2450000.00, // Negative OCF
    bounce_count_12m: 7, // 7 NACH bounces
    ltv_ratio: 84.0, // Max 70%
    undisclosed_debt_detected: 4200000.00,
    decision: "DECLINED",
    risk_score: 84.2,
    decision_date: "2026-10-24T14:30:00Z"
  },
  {
    id: "LN-2026-882",
    applicant_id: "APP-CORP-402",
    applicant_name: "Kalyani Precision Engineering Ltd",
    business_type: "Automotive Components",
    requested_amount: 45000000.00, // 4.5 Cr
    annual_income: 92000000.00,
    cibil_score: 792,
    dscr: 1.88,
    dti: 28.2,
    operating_cash_flow: 18400000.00,
    bounce_count_12m: 0,
    ltv_ratio: 52.0,
    undisclosed_debt_detected: 0.0,
    decision: "APPROVED",
    risk_score: 16.5,
    decision_date: "2026-10-25T09:15:00Z"
  },
  {
    id: "LN-2026-883",
    applicant_id: "APP-RETAIL-554",
    applicant_name: "Sunita Roy (Proprietor)",
    business_type: "Retail Pharmacy Chain",
    requested_amount: 6000000.00, // 60 Lakhs
    annual_income: 9800000.00,
    cibil_score: 668,
    dscr: 1.28,
    dti: 48.0,
    operating_cash_flow: 1250000.00,
    bounce_count_12m: 2,
    ltv_ratio: 76.5, // Requires 10% more collateral margin
    undisclosed_debt_detected: 0.0,
    decision: "CONDITIONAL",
    risk_score: 54.0,
    decision_date: "2026-10-25T11:40:00Z"
  },
  {
    id: "LN-2026-884",
    applicant_id: "APP-COMM-771",
    applicant_name: "Apex Logistics India Pvt Ltd",
    business_type: "Freight & Fleet Services",
    requested_amount: 32000000.00, // 3.2 Cr
    annual_income: 44000000.00,
    cibil_score: 642,
    dscr: 0.94, // Breach!
    dti: 62.0,
    operating_cash_flow: 380000.00,
    bounce_count_12m: 5,
    ltv_ratio: 79.0,
    undisclosed_debt_detected: 18500000.00, // Cross-system treasury conflict!
    decision: "DECLINED",
    risk_score: 88.0,
    decision_date: "2026-10-26T08:00:00Z"
  }
];

// Month-End Financial Close Tasks
export const seedMonthEndTasks = [
  {
    id: "CLOSE-001",
    task_name: "Cash & Core Bank Statement Reconciliation",
    category: "CASH_RECON",
    entity_code: "ENTITY-IN-01",
    period: "2026-M10",
    assigned_to: "Priya Sharma (Senior Accountant)",
    status: "BLOCKED",
    materiality_threshold: 1000000.00, // 10 Lakhs threshold
    variance_amount: 1840000.00, // Breached threshold (18.4 Lakhs open)
    blocker_severity: "CRITICAL",
    completed_at: null
  },
  {
    id: "CLOSE-002",
    task_name: "Treasury Mark-to-Market (MTM) FX Derivatives Valuation",
    category: "EXPOSURE_VALIDATION",
    entity_code: "ENTITY-TREASURY",
    period: "2026-M10",
    assigned_to: "Rahul Verma (Treasury Desk)",
    status: "COMPLETED",
    materiality_threshold: 5000000.00,
    variance_amount: 0.0,
    blocker_severity: "NONE",
    completed_at: "2026-10-25T17:00:00Z"
  },
  {
    id: "CLOSE-003",
    task_name: "Intercompany Loan Elimination & Interest Offset",
    category: "INTERCOMPANY",
    entity_code: "HOLDING-CORP",
    period: "2026-M10",
    assigned_to: "Sarah Jenkins (Consolidation Lead)",
    status: "IN_PROGRESS",
    materiality_threshold: 2000000.00,
    variance_amount: 450000.00,
    blocker_severity: "WARNING",
    completed_at: null
  },
  {
    id: "CLOSE-004",
    task_name: "Regulatory Single Borrower Exposure Limit Sign-Off",
    category: "REGULATORY",
    entity_code: "RISK-GOV",
    period: "2026-M10",
    assigned_to: "Dr. Vikramaditya Sen (CRO)",
    status: "BLOCKED",
    materiality_threshold: 10000000.00,
    variance_amount: 37000000.00, // Vanguard Steel limit breach
    blocker_severity: "CRITICAL",
    completed_at: null
  },
  {
    id: "CLOSE-005",
    task_name: "Fraud Risk Reserve & Bad Debt Provisioning Review",
    category: "FRAUD_PROVISIONING",
    entity_code: "ENTITY-IN-01",
    period: "2026-M10",
    assigned_to: "Amit Patel (Fraud Risk Officer)",
    status: "IN_PROGRESS",
    materiality_threshold: 1500000.00,
    variance_amount: 1200000.00,
    blocker_severity: "WARNING",
    completed_at: null
  },
  {
    id: "CLOSE-006",
    task_name: "Payment Gateway Merchant Fee Clearing & Tax Cut-Off",
    category: "CASH_RECON",
    entity_code: "ENTITY-DIGITAL",
    period: "2026-M10",
    assigned_to: "Neha Gupta (Billing Lead)",
    status: "COMPLETED",
    materiality_threshold: 500000.00,
    variance_amount: 0.0,
    blocker_severity: "NONE",
    completed_at: "2026-10-26T09:30:00Z"
  }
];

// Initial Case Management Queue
export const seedCases = [
  {
    caseId: "CASE-2026-101",
    title: "Smurfing Syndicate: Mehra Traders Sub-50k Structuring",
    category: "FRAUD",
    severity: "CRITICAL",
    status: "IN_INVESTIGATION",
    assignedTo: "Amit Patel (Fraud Investigator)",
    entityId: "ACC-IN-4901",
    financialImpact: 292100.00,
    currency: "INR",
    source: "Exasol Structuring Window Function",
    evidence: [
      "6 outbound UPI/IMPS transactions between ₹47,800 and ₹49,500 within 10 hours",
      "Consistent single IP: 103.21.58.12 and Device ID DEV-AND-9921",
      "Recipients appear to be retail mule accounts opened within last 14 days"
    ],
    notes: [
      {
        id: "NOTE-1",
        author: "Amit Patel",
        text: "Requested immediate PAN verification from IT department. Outbound beneficiary velocity has ceased.",
        timestamp: "2026-10-25T19:00:00Z",
        actionTaken: "FLAGGED_FOR_REVIEW"
      }
    ],
    sarReportGenerated: true,
    createdAt: "2026-10-25T18:45:00Z",
    updatedAt: "2026-10-25T19:00:00Z"
  },
  {
    caseId: "CASE-2026-102",
    caseTitle: "Layering Loop: Horizon Shell to Apex Logistics FZE",
    title: "Layering Loop: Horizon Shell to Apex Logistics FZE",
    category: "FRAUD",
    severity: "CRITICAL",
    status: "NEW",
    assignedTo: "Sarah Jenkins (Financial Crimes)",
    entityId: "ACC-MID-551",
    financialImpact: 14500000.00,
    currency: "INR",
    source: "Exasol Rapid Relay Analyzer",
    evidence: [
      "Funds transferred across 4 international jurisdictions in under 26 minutes",
      "Less than 2.8% retention at intermediary nodes",
      "Correlates with high-risk shipping invoices without bill of lading"
    ],
    notes: [],
    sarReportGenerated: false,
    createdAt: "2026-10-26T04:30:00Z",
    updatedAt: "2026-10-26T04:30:00Z"
  },
  {
    caseId: "CASE-2026-103",
    title: "3-Way Reconciliation Unposted Direct Tax Debit",
    category: "RECONCILIATION",
    severity: "HIGH",
    status: "IN_INVESTIGATION",
    assignedTo: "Priya Sharma (Senior Accountant)",
    entityId: "REF-2026-9003",
    financialImpact: 420000.00,
    currency: "INR",
    source: "Exasol 3-Way Recon Join View",
    evidence: [
      "Core bank statement debited ₹4,20,000 on 2026-10-24",
      "No matching General Ledger journal voucher found in ERP GL-110020",
      "Raw narrative points to CBDT Advance Corporate Tax challan"
    ],
    notes: [
      {
        id: "NOTE-2",
        author: "Priya Sharma",
        text: "Confirmed with tax team that challan was debited directly. Drafting manual adjusting journal entry.",
        timestamp: "2026-10-25T14:15:00Z",
        actionTaken: "JOURNAL_DRAFTED"
      }
    ],
    sarReportGenerated: false,
    createdAt: "2026-10-25T10:00:00Z",
    updatedAt: "2026-10-25T14:15:00Z"
  },
  {
    caseId: "CASE-2026-104",
    title: "Vanguard Steel Regulatory Single Borrower Limit Breach",
    category: "EXPOSURE",
    severity: "CRITICAL",
    status: "ESCALATED",
    assignedTo: "Dr. Vikramaditya Sen (CRO)",
    entityId: "ENT-VANGUARD-02",
    financialImpact: 370000000.00, // 37 Cr breach above 200 Cr limit
    currency: "INR",
    source: "Exasol Multi-System Exposure Rollup",
    evidence: [
      "Total Net Exposure: ₹237 Crores against RBI Limit of ₹200 Crores",
      "Derivatives system recorded ₹65 Cr commodity swap unknown to Core Banking credit committee",
      "Collateral coverage ratio dropped to 30.8%"
    ],
    notes: [
      {
        id: "NOTE-3",
        author: "Dr. Vikramaditya Sen",
        text: "Notified treasury desk to freeze new derivative tranches and request additional margin call.",
        timestamp: "2026-10-26T08:30:00Z",
        actionTaken: "MARGIN_CALL_ISSUED"
      }
    ],
    sarReportGenerated: false,
    createdAt: "2026-10-26T07:10:00Z",
    updatedAt: "2026-10-26T08:30:00Z"
  }
];

// Audit Trail Events
export const seedAuditEvents = [
  {
    eventId: "AUD-9901",
    timestamp: "2026-10-25T18:45:00Z",
    actor: "SYSTEM_EXASOL_WATCHER",
    role: "Automated Analytical Rule Engine",
    action: "ALERT_GENERATED",
    targetType: "CASE",
    targetId: "CASE-2026-101",
    details: {
      rule: "STRUCTURING_SUB_50K",
      confidence: 0.96,
      message: "Exasol Analytical Window Function triggered smurfing threshold breach"
    },
    ipAddress: "127.0.0.1"
  },
  {
    eventId: "AUD-9902",
    timestamp: "2026-10-25T19:00:00Z",
    actor: "Amit Patel",
    role: "Fraud Risk Investigator",
    action: "STATUS_UPDATE",
    targetType: "CASE",
    targetId: "CASE-2026-101",
    details: {
      previousStatus: "NEW",
      newStatus: "IN_INVESTIGATION",
      reason: "PAN verification and beneficiary KYC checks initiated"
    },
    ipAddress: "192.168.1.104"
  },
  {
    eventId: "AUD-9903",
    timestamp: "2026-10-25T19:30:00Z",
    actor: "Amit Patel",
    role: "Fraud Risk Investigator",
    action: "SAR_REPORT_EXPORTED",
    targetType: "CASE",
    targetId: "CASE-2026-101",
    details: {
      reportType: "FIU-IND Suspicious Transaction Report",
      format: "XML/PDF",
      destination: "Regulatory Compliance Queue"
    },
    ipAddress: "192.168.1.104"
  },
  {
    eventId: "AUD-9904",
    timestamp: "2026-10-26T04:30:00Z",
    actor: "SYSTEM_EXASOL_WATCHER",
    role: "Automated Analytical Rule Engine",
    action: "ALERT_GENERATED",
    targetType: "CASE",
    targetId: "CASE-2026-102",
    details: {
      rule: "RAPID_FUNDS_LAYERING",
      confidence: 0.94,
      message: "Cross-border rapid relay detected under 26 minutes"
    },
    ipAddress: "127.0.0.1"
  },
  {
    eventId: "AUD-9905",
    timestamp: "2026-10-26T08:30:00Z",
    actor: "Dr. Vikramaditya Sen",
    role: "Chief Risk Officer",
    action: "ESCALATION_TRIGGERED",
    targetType: "CASE",
    targetId: "CASE-2026-104",
    details: {
      previousStatus: "NEW",
      newStatus: "ESCALATED",
      actionDetail: "Issued ₹37 Cr collateral top-up margin call to Vanguard Steel"
    },
    ipAddress: "192.168.1.12"
  }
];
