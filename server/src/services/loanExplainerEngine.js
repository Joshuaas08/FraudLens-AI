// ============================================================================
// FraudLens AI: Explainable Loan Decision Engine & Adverse Action Explainer
// ============================================================================

import { exasolClient } from '../database/exasolClient.js';

export class LoanExplainerEngine {
  /**
   * Evaluates loan application and produces deep factor waterfall and adverse notices
   */
  static explainLoanDecision(loan) {
    const factors = [];
    let baseScore = 60; // Starting baseline

    // 1. CIBIL Score Impact
    if (loan.cibil_score >= 750) {
      const delta = Math.round((loan.cibil_score - 750) / 2);
      factors.push({
        name: "Bureau Credit Score (CIBIL)",
        value: `${loan.cibil_score}`,
        benchmark: ">= 700",
        impact: "POSITIVE",
        scoreContribution: +18,
        explanation: `Applicant maintains strong credit bureau rating (${loan.cibil_score}) indicating prime credit history.`
      });
      baseScore += 18;
    } else if (loan.cibil_score < 650) {
      factors.push({
        name: "Bureau Credit Score (CIBIL)",
        value: `${loan.cibil_score}`,
        benchmark: ">= 700",
        impact: "NEGATIVE",
        scoreContribution: -25,
        explanation: `Credit score of ${loan.cibil_score} falls below standard underwriting threshold (700).`
      });
      baseScore -= 25;
    } else {
      factors.push({
        name: "Bureau Credit Score (CIBIL)",
        value: `${loan.cibil_score}`,
        benchmark: ">= 700",
        impact: "NEUTRAL",
        scoreContribution: 0,
        explanation: `Credit score of ${loan.cibil_score} meets borderline criteria.`
      });
    }

    // 2. DSCR (Debt Service Coverage Ratio)
    if (loan.dscr < 1.15) {
      factors.push({
        name: "Debt Service Coverage Ratio (DSCR)",
        value: `${loan.dscr}x`,
        benchmark: ">= 1.25x",
        impact: "CRITICAL_NEGATIVE",
        scoreContribution: -35,
        explanation: `Operating income is insufficient to cover debt service commitments (${loan.dscr}x vs min 1.25x).`
      });
      baseScore -= 35;
    } else if (loan.dscr >= 1.50) {
      factors.push({
        name: "Debt Service Coverage Ratio (DSCR)",
        value: `${loan.dscr}x`,
        benchmark: ">= 1.25x",
        impact: "POSITIVE",
        scoreContribution: +20,
        explanation: `Robust debt service coverage of ${loan.dscr}x demonstrates healthy buffer against revenue shocks.`
      });
      baseScore += 20;
    }

    // 3. Operating Cash Flow
    if (loan.operating_cash_flow < 0) {
      factors.push({
        name: "Operating Cash Flow (OCF)",
        value: `-₹${(Math.abs(loan.operating_cash_flow) / 100000).toFixed(1)}L`,
        benchmark: "> 0",
        impact: "CRITICAL_NEGATIVE",
        scoreContribution: -30,
        explanation: `Negative cash flow from operations over last 12 months signifies working capital distress.`
      });
      baseScore -= 30;
    } else {
      factors.push({
        name: "Operating Cash Flow (OCF)",
        value: `+₹${(loan.operating_cash_flow / 100000).toFixed(1)}L`,
        benchmark: "> 0",
        impact: "POSITIVE",
        scoreContribution: +15,
        explanation: `Positive operating cash flow indicates organic revenue generation capability.`
      });
      baseScore += 15;
    }

    // 4. Banking Bounces / NACH Dishonors
    if (loan.bounce_count_12m > 3) {
      factors.push({
        name: "Cheque / NACH Dishonors (12m)",
        value: `${loan.bounce_count_12m} instances`,
        benchmark: "<= 2 instances",
        impact: "NEGATIVE",
        scoreContribution: -20,
        explanation: `High frequency of debit return memos (${loan.bounce_count_12m}) signals chronic cash timing mismatches.`
      });
      baseScore -= 20;
    }

    // 5. Undisclosed Liabilities (Cross-System Exposure)
    if (loan.undisclosed_debt_detected > 0) {
      factors.push({
        name: "Undisclosed Liabilities Detected",
        value: `₹${(loan.undisclosed_debt_detected / 100000).toFixed(1)}L`,
        benchmark: "₹0",
        impact: "CRITICAL_NEGATIVE",
        scoreContribution: -25,
        explanation: `Cross-system Exasol reconciliation uncovered ₹${(loan.undisclosed_debt_detected / 100000).toFixed(1)}L in unlisted derivative / credit lines not declared on the application.`
      });
      baseScore -= 25;
    }

    // 6. LTV Ratio
    if (loan.ltv_ratio > 80) {
      factors.push({
        name: "Loan-To-Value (LTV) Ratio",
        value: `${loan.ltv_ratio}%`,
        benchmark: "<= 75%",
        impact: "NEGATIVE",
        scoreContribution: -12,
        explanation: `Collateral margin is stretched; requested loan is ${loan.ltv_ratio}% of pledged asset appraisal.`
      });
      baseScore -= 12;
    }

    const finalProbabilityScore = Math.min(98, Math.max(8, baseScore));

    // Customer Adverse Action Explanation
    const adverseReasons = factors
      .filter(f => f.impact.includes("NEGATIVE"))
      .map(f => f.explanation);

    const customerNotice = {
      noticeType: loan.decision === "DECLINED" ? "Statement of Adverse Action" : "Credit Assessment Notice",
      complianceCode: "RBI/2026/FPC-CREDIT-EXPLAINABILITY",
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      applicantName: loan.applicant_name,
      principalDeclineFactors: adverseReasons.length > 0 ? adverseReasons : ["Insufficient collateral coverage for facility size."],
      nextStepsRecommendation: loan.decision === "DECLINED" 
        ? "To improve eligibility in 90 days: (1) Settle existing overdue credit facilities to improve DSCR above 1.25x; (2) Maintain nil NACH return record for 6 continuous cycles; (3) Pledge additional liquid collateral to bring LTV below 70%."
        : "Standard approval documentation required prior to disbursement."
    };

    return {
      loanId: loan.id,
      applicantName: loan.applicant_name,
      requestedAmount: loan.requested_amount,
      decision: loan.decision,
      approvalProbabilityPct: finalProbabilityScore,
      factors,
      customerNotice,
      underwriterRecommendation: loan.decision === 'DECLINED' 
        ? "UPHOLD DECLINE: Unacceptable credit risk profile due to multi-factor covenant breaches."
        : (loan.decision === 'CONDITIONAL' ? "APPROVE SUBJECT TO 15% ADDITIONAL COLLATERAL MARGIN" : "APPROVE FULL FACILITY")
    };
  }

  /**
   * What-If Simulator: dynamically simulates impact of financial tweaks
   */
  static simulateScenario(baseLoan, tweaks) {
    const modified = { ...baseLoan };

    // Apply tweaks
    if (tweaks.collateralIncrease) {
      const newCollateral = (baseLoan.requested_amount / (baseLoan.ltv_ratio / 100)) + Number(tweaks.collateralIncrease);
      modified.ltv_ratio = Number(((baseLoan.requested_amount / newCollateral) * 100).toFixed(1));
    }
    if (tweaks.debtReductionAmount) {
      // Reduces debt service, boosting DSCR and freeing cash flow
      const reduction = Number(tweaks.debtReductionAmount);
      modified.dscr = Number((baseLoan.dscr * (1 + (reduction / baseLoan.requested_amount) * 1.2)).toFixed(2));
      modified.dti = Math.max(20, Number((baseLoan.dti - (reduction / baseLoan.annual_income) * 35).toFixed(1)));
      // Reducing debt service increases available operating cash flow
      modified.operating_cash_flow = baseLoan.operating_cash_flow + (reduction * 0.35);
    }
    if (tweaks.resolvedBounces) {
      modified.bounce_count_12m = Math.max(0, baseLoan.bounce_count_12m - Number(tweaks.resolvedBounces));
    }
    if (tweaks.settledUndisclosedDebt || tweaks.debtReductionAmount > 0) {
      modified.undisclosed_debt_detected = Math.max(0, baseLoan.undisclosed_debt_detected - Number(tweaks.debtReductionAmount || 0));
    }

    const explained = this.explainLoanDecision(modified);

    let simulatedDecision = "DECLINED";
    if (explained.approvalProbabilityPct >= 65) simulatedDecision = "APPROVED";
    else if (explained.approvalProbabilityPct >= 45) simulatedDecision = "CONDITIONAL";

    return {
      originalDecision: baseLoan.decision,
      simulatedDecision,
      originalScore: baseLoan.risk_score,
      simulatedApprovalProbability: explained.approvalProbabilityPct,
      modifiedParameters: {
        dscr: modified.dscr,
        dti: modified.dti,
        ltv_ratio: modified.ltv_ratio,
        bounce_count: modified.bounce_count_12m,
        undisclosed_debt: modified.undisclosed_debt_detected,
        operating_cash_flow: modified.operating_cash_flow
      },
      simulationSummary: simulatedDecision === 'APPROVED' 
        ? "Simulated changes successfully elevate application above institutional credit hurdle criteria."
        : (simulatedDecision === 'CONDITIONAL' ? "Improvements qualify applicant for conditional approval with risk premium." : "Further balance sheet de-leveraging required.")
    };
  }
}
