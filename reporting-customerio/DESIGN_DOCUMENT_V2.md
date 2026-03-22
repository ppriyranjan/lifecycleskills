# Customer.io Analytics Reporting Skill - Simplified Design

**Version:** 2.0 (Simplified)
**Date:** 2026-03-21
**Status:** Design Phase (Phase B - Revised)

---

## Executive Summary

### Goal
Build a simple, AI-powered Customer.io analytics reporting skill that Claude can invoke automatically when the user asks about email performance, campaign metrics, or deliverability issues.

### Key Principles
- **Simple**: One report type, minimal configuration
- **AI-Powered**: Let Claude analyze trends and generate insights, don't hard-code logic
- **Period Comparison**: Only compare time-over-time, no external benchmarks
- **Automatic**: Claude invokes when relevant, no manual scheduling needed

### What Changed from V1
- ❌ Removed scheduling functionality
- ❌ Removed CLI arguments (--schedule, --type, --format)
- ❌ Removed hard-coded insights and trend detection
- ❌ Removed benchmark comparisons
- ❌ Removed multiple report types
- ✅ Single unified report template
- ✅ LLM-powered insights and trend analysis
- ✅ Automatic invocation by Claude
- ✅ Much simpler architecture

---

## Table of Contents

1. [Architecture](#architecture)
2. [Skill Invocation](#skill-invocation)
3. [Time Period Handling](#time-period-handling)
4. [Metrics Specification](#metrics-specification)
5. [Report Structure](#report-structure)
6. [Implementation Plan](#implementation-plan)

---

## Architecture

### Directory Structure

```
.claude/skills/cio-analytics/
├── SKILL.md                      # Main skill entry point
├── lib/
│   ├── mcp-checker.js           # MCP connection verification
│   ├── metrics-fetcher.js       # Data fetching from Customer.io
│   └── calculator.js            # Period calculations & pro-rating
├── templates/
│   ├── setup-instructions.md    # MCP setup guide
│   └── report-template.md       # Single unified report template
└── README.md                     # Skill documentation
```

### Components

#### SKILL.md (Main Entry Point)
- Check MCP connection
- Parse optional arguments (period, campaign)
- Fetch metrics data
- Calculate period comparisons
- **Pass data to Claude for analysis and insights**
- Format final report

#### lib/mcp-checker.js
- Verify Customer.io MCP is connected
- Return workspace context or setup instructions

#### lib/metrics-fetcher.js
- Fetch workspace metrics for date ranges
- Fetch campaign-level metrics
- Use `human_only: true` for engagement metrics

#### lib/calculator.js
- Calculate date ranges (7d, 30d, custom)
- Calculate period-over-period changes
- Pro-rate partial periods
- Calculate derived metrics (rates)

---

## Skill Invocation

### By Claude (Automatic)

The skill description will indicate when Claude should invoke it:

```yaml
---
name: cio-analytics
description: Generate Customer.io analytics report with deliverability, engagement, and campaign performance metrics. Use when the user asks about email performance, campaign results, open/click rates, deliverability issues, or wants to analyze Customer.io metrics.
---
```

Claude will automatically invoke this skill when users ask questions like:
- "How are our emails performing?"
- "Show me campaign metrics for the last week"
- "Any deliverability issues?"
- "What's our open rate trend?"
- "Analyze Customer.io performance"

### Optional Arguments

```
$ARGUMENTS can contain:
- 7d / 30d                  → Time period (default: 7d)
- campaign-name             → Filter to specific campaign
- YYYY-MM-DD to YYYY-MM-DD  → Custom date range
```

**Examples:**
```
User: "Show me email performance last week"
→ Skill invoked with: 7d

User: "How is the Welcome Email doing?"
→ Skill invoked with: campaign Welcome Email

User: "Compare March 1-15 to the previous period"
→ Skill invoked with: 2026-03-01 to 2026-03-15
```

---

## Time Period Handling

### Standard Periods

**Last 7 Days (default)**
```
Current:  [Today - 7 days] to [Yesterday]
Previous: [Yesterday - 7 days] to [Yesterday - 14 days]
```

**Last 30 Days**
```
Current:  [Today - 30 days] to [Yesterday]
Previous: [Yesterday - 30 days] to [Yesterday - 60 days]
```

**Custom Range**
```
User provides: 2026-03-01 to 2026-03-15 (15 days)
Current:  2026-03-01 to 2026-03-15
Previous: 2026-02-14 to 2026-02-28 (same duration)
```

### Pro-Rating for Partial Periods

When comparing incomplete periods:

```javascript
Pro-rated Value = (Actual Value / Days Elapsed) × Target Days

Example:
Current week (3 days): 300 opens
Pro-rated (7 days): (300 / 3) × 7 = 700 opens (projected)
Previous week (7 days): 650 opens
Comparison: 700 vs 650 = +7.7% (on current pace)
```

---

## Metrics Specification

### Primary Metrics

**Deliverability**
- Sent
- Delivered
- Bounced
- Failed
- Delivery Rate = (delivered / sent) × 100
- Bounce Rate = (bounced / sent) × 100

**Engagement (Human Only)**
- Opens (human_only)
- Clicks (human_only)
- Conversions
- Unsubscribes
- Open Rate = (human_opened / delivered) × 100
- Click Rate = (human_clicked / delivered) × 100
- Click-to-Open Rate = (human_clicked / human_opened) × 100
- Conversion Rate = (converted / delivered) × 100

**Bot Activity (for context)**
- Machine opens
- Machine clicks
- Bot percentage of total activity

### Period Comparison Format

```javascript
{
  metric: "open_rate",
  current: {
    value: 24.5,
    period: "2026-03-14 to 2026-03-20",
    days: 7
  },
  previous: {
    value: 22.2,
    period: "2026-03-07 to 2026-03-13",
    days: 7
  },
  change: {
    absolute: +2.3,
    percentage: +10.4,
    trend: "up"
  },
  proRated: false
}
```

---

## Report Structure

### Single Unified Report

```markdown
# Customer.io Analytics Report

**Period**: Last 7 days vs Previous 7 days
**Workspace**: [Workspace Name]
**Generated**: [Date/Time]

---

## 📊 Executive Summary

[Claude analyzes the data and provides 3-5 key insights here]

### Key Findings
- [Insight 1: e.g., "Delivery rate improved 2.3%, email health is trending positive"]
- [Insight 2: e.g., "Welcome Email outperforming with 42% open rate, up 8%"]
- [Insight 3: e.g., "Overall engagement down 5%, driven by Newsletter decline"]

### Recommended Actions
1. [Action 1 with reasoning]
2. [Action 2 with reasoning]
3. [Action 3 with reasoning]

---

## 📈 Deliverability Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Sent** | 50,000 | 48,000 | ↗ +4.2% |
| **Delivered** | 48,250 (96.5%) | 46,080 (96.0%) | ↗ +0.5% |
| **Bounced** | 1,600 (3.2%) | 1,440 (3.0%) | ↗ +0.2% |
| **Failed** | 150 (0.3%) | 480 (1.0%) | ↘ -0.7% |

**Period-over-Period**: Delivery rate improved from 96.0% to 96.5%

---

## 💌 Engagement Metrics (Human Activity)

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Opens** | 11,290 | 10,252 | ↗ +10.1% |
| **Open Rate** | 23.4% | 22.2% | ↗ +1.2pp |
| **Clicks** | 2,799 | 2,650 | ↗ +5.6% |
| **Click Rate** | 5.8% | 5.7% | ↗ +0.1pp |
| **Click-to-Open** | 24.8% | 25.9% | ↘ -1.1pp |
| **Conversions** | 870 | 768 | ↗ +13.3% |
| **Conversion Rate** | 1.8% | 1.7% | ↗ +0.1pp |

**Bot Activity**: 3,240 machine opens (22.3% of total), 287 machine clicks (9.3% of total)

---

## 🎯 Campaign Performance

Top 10 campaigns by volume:

| Campaign | Sent | Open Rate | Click Rate | Conv Rate | Trend |
|----------|------|-----------|------------|-----------|-------|
| Welcome Email | 5,200 | 42.3% | 15.2% | 3.8% | ↗ +8.2% |
| Cart Abandonment | 8,100 | 28.4% | 12.4% | 2.1% | ↗ +3.1% |
| Weekly Newsletter | 15,800 | 19.3% | 4.2% | 0.8% | ↘ -5.2% |
| Product Update | 12,500 | 22.8% | 6.2% | 1.4% | → +0.3% |
| Re-engagement | 3,400 | 31.2% | 8.5% | 1.9% | ↗ +12.4% |
| ... | ... | ... | ... | ... | ... |

---

## 🔍 Detailed Analysis

[Claude provides deeper analysis here, including:]
- Trend patterns observed across campaigns
- Anomalies or unexpected changes
- Correlations between metrics
- Segment-specific insights (if available)

---

## 📝 Notes

- All engagement metrics use human-only activity (bot opens/clicks excluded)
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat
[If pro-rated: "Current period is incomplete; values are pro-rated projections"]

---

Generated by Customer.io Analytics Skill
```

---

## LLM-Powered Insights

### What Claude Analyzes

After the skill provides the raw data and period comparisons, Claude analyzes:

**Trends & Patterns:**
- Are metrics improving or declining?
- Which campaigns are trending up/down?
- Are there consistent patterns across time periods?
- Any anomalies or outliers?

**Performance:**
- Which campaigns are performing best/worst?
- What's driving overall workspace performance?
- Are there campaigns that need attention?

**Correlations:**
- Is deliverability affecting engagement?
- Do certain campaign types perform better?
- Are there seasonal patterns?

**Recommendations:**
- What should be investigated further?
- What actions would likely improve metrics?
- What's working well that should be replicated?

### How It Works

The skill passes data to Claude with a prompt like:

```
Analyze the following Customer.io metrics and provide insights:

[Structured data with all metrics and period comparisons]

Please:
1. Identify the 3-5 most important insights from this data
2. Explain any significant trends or patterns you observe
3. Recommend 3 specific actions to improve performance
4. Note any anomalies or areas requiring investigation
5. Highlight what's working well

Focus on actionable insights, not just data summary.
```

---

## Implementation Plan

### Phase 1: Core Functionality (Week 1)

**Tasks:**
1. Create skill directory structure
2. Implement `lib/mcp-checker.js`
   - Check MCP connection
   - Return workspace info or setup instructions
3. Implement `lib/metrics-fetcher.js`
   - Fetch workspace metrics for date range
   - Fetch campaign list and metrics
   - Use `human_only: true`
4. Create `templates/setup-instructions.md`
5. Basic `SKILL.md` that:
   - Checks MCP
   - Fetches one period of data
   - Displays raw metrics

**Deliverable:** Skill can connect to MCP and fetch data

### Phase 2: Period Comparison (Week 2)

**Tasks:**
1. Implement `lib/calculator.js`
   - Calculate date ranges (7d, 30d, custom)
   - Calculate period-over-period changes
   - Pro-rate partial periods
   - Calculate derived metrics (rates)
2. Update `metrics-fetcher.js` to fetch two periods
3. Update `SKILL.md` to:
   - Parse period arguments
   - Fetch current + previous periods
   - Calculate all changes
   - Display comparison data

**Deliverable:** Accurate period-over-period comparisons with pro-rating

### Phase 3: Report Template & Campaign Data (Week 3)

**Tasks:**
1. Create `templates/report-template.md`
2. Implement report formatting logic in `SKILL.md`
3. Add campaign breakdown (top 10)
4. Add campaign filtering support
5. Format all metrics in tables
6. Add trend indicators (↗↘→)

**Deliverable:** Professional-looking unified report

### Phase 4: LLM-Powered Insights (Week 4)

**Tasks:**
1. Design prompt for Claude to analyze metrics
2. Structure data for LLM analysis
3. Implement insights section at top of report
4. Test with various data scenarios
5. Refine prompts based on quality of insights
6. Add detailed analysis section

**Deliverable:** Report with AI-generated insights and recommendations

### Phase 5: Polish & Testing (Week 5)

**Tasks:**
1. Comprehensive error handling
2. Edge case testing (zero data, single campaign, etc.)
3. Documentation (README, usage examples)
4. Test with real Customer.io workspaces
5. Refine skill description for auto-invocation
6. Performance optimization
7. Final testing and validation

**Deliverable:** Production-ready skill

---

## File Structure Details

### SKILL.md

```yaml
---
name: cio-analytics
description: Generate Customer.io analytics report with deliverability, engagement, and campaign performance metrics. Use when the user asks about email performance, campaign results, open/click rates, deliverability issues, or wants to analyze Customer.io metrics.
---

[Main skill logic:]
1. Parse $ARGUMENTS (period, campaign filter)
2. Check MCP connection
3. If not connected → show setup instructions and exit
4. Calculate date ranges
5. Fetch current period metrics
6. Fetch previous period metrics
7. Fetch campaign data
8. Calculate all comparisons and derived metrics
9. Structure data for analysis
10. Ask Claude to analyze and generate insights
11. Format final report using template
12. Display report to user
```

### lib/mcp-checker.js

```javascript
/**
 * Check if Customer.io MCP is connected
 * @returns {Object|null} Workspace context or null if not connected
 */
async function checkMCPConnection() {
  try {
    // Attempt to list workspaces
    const workspaces = await mcp.customerio.list_workspaces();

    if (workspaces && workspaces.length > 0) {
      return {
        connected: true,
        workspace: workspaces[0] // Use first workspace
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Get MCP setup instructions
 * @returns {string} Formatted setup instructions
 */
function getSetupInstructions() {
  // Load from templates/setup-instructions.md
  // Return formatted markdown
}

module.exports = { checkMCPConnection, getSetupInstructions };
```

### lib/metrics-fetcher.js

```javascript
/**
 * Fetch workspace metrics for a date range
 * @param {number} workspaceId
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {Object} Metrics data
 */
async function fetchWorkspaceMetrics(workspaceId, startDate, endDate) {
  const result = await mcp.customerio.metrics({
    action: "workspace",
    workspace_id: workspaceId,
    workspace_params: {
      time_range: {
        start_date: startDate,
        end_date: endDate
      },
      summary_only: false, // Get campaign breakdowns
      data_types: ["campaign", "newsletter"],
      limit: 10 // Top 10 campaigns
    }
  });

  return {
    workspace: result.workspace_summary,
    campaigns: result.campaigns || [],
    metrics: result.summary.metrics
  };
}

/**
 * Fetch period comparison data
 * @param {number} workspaceId
 * @param {Object} dateRanges - Current and previous date ranges
 * @returns {Object} Current and previous period data
 */
async function fetchPeriodComparison(workspaceId, dateRanges) {
  const current = await fetchWorkspaceMetrics(
    workspaceId,
    dateRanges.current.start,
    dateRanges.current.end
  );

  const previous = await fetchWorkspaceMetrics(
    workspaceId,
    dateRanges.previous.start,
    dateRanges.previous.end
  );

  return { current, previous };
}

module.exports = { fetchWorkspaceMetrics, fetchPeriodComparison };
```

### lib/calculator.js

```javascript
/**
 * Calculate date ranges for period comparison
 * @param {string} period - "7d", "30d", or "custom"
 * @param {string} customFrom - For custom ranges
 * @param {string} customTo - For custom ranges
 * @returns {Object} Current and previous date ranges
 */
function calculateDateRanges(period, customFrom = null, customTo = null) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (customFrom && customTo) {
    const days = daysBetween(customFrom, customTo);
    const previousEnd = subtractDays(customFrom, 1);
    const previousStart = subtractDays(customFrom, days);

    return {
      current: { start: customFrom, end: customTo, days },
      previous: { start: previousStart, end: previousEnd, days }
    };
  }

  const days = period === "30d" ? 30 : 7;
  const currentEnd = formatDate(yesterday);
  const currentStart = formatDate(subtractDays(yesterday, days));
  const previousEnd = formatDate(subtractDays(yesterday, days));
  const previousStart = formatDate(subtractDays(yesterday, days * 2));

  return {
    current: { start: currentStart, end: currentEnd, days },
    previous: { start: previousStart, end: previousEnd, days }
  };
}

/**
 * Calculate change between two values
 * @param {number} current
 * @param {number} previous
 * @returns {Object} Change details
 */
function calculateChange(current, previous) {
  if (previous === 0) {
    return {
      absolute: current,
      percentage: current > 0 ? Infinity : 0,
      trend: current > 0 ? 'up' : current < 0 ? 'down' : 'flat'
    };
  }

  const absolute = current - previous;
  const percentage = (absolute / previous) * 100;

  return {
    absolute,
    percentage: Math.round(percentage * 10) / 10,
    trend: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'flat'
  };
}

/**
 * Pro-rate a metric for partial periods
 * @param {number} value - Actual value
 * @param {number} actualDays - Days elapsed
 * @param {number} targetDays - Target period length
 * @returns {Object} Pro-rated details
 */
function proRateMetric(value, actualDays, targetDays) {
  if (actualDays === targetDays) {
    return { value, proRated: false };
  }

  const dailyAverage = value / actualDays;
  const proRatedValue = Math.round(dailyAverage * targetDays);

  return {
    value: proRatedValue,
    proRated: true,
    actualValue: value,
    actualDays,
    targetDays,
    dailyAverage: Math.round(dailyAverage)
  };
}

/**
 * Calculate derived metrics (rates)
 * @param {Object} rawMetrics - Raw count metrics
 * @returns {Object} All metrics including rates
 */
function calculateDerivedMetrics(rawMetrics) {
  const { sent, delivered, bounced, human_opened, human_clicked, converted } = rawMetrics;

  return {
    ...rawMetrics,
    delivery_rate: safePercentage(delivered, sent),
    bounce_rate: safePercentage(bounced, sent),
    open_rate: safePercentage(human_opened, delivered),
    click_rate: safePercentage(human_clicked, delivered),
    click_to_open: safePercentage(human_clicked, human_opened),
    conversion_rate: safePercentage(converted, delivered)
  };
}

function safePercentage(numerator, denominator) {
  return denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0;
}

module.exports = {
  calculateDateRanges,
  calculateChange,
  proRateMetric,
  calculateDerivedMetrics
};
```

---

## Testing Strategy

### Unit Tests

```javascript
// Test calculator.js
describe('Calculator', () => {
  test('calculates 7-day date ranges correctly', () => {
    const ranges = calculateDateRanges('7d');
    expect(ranges.current.days).toBe(7);
    expect(ranges.previous.days).toBe(7);
  });

  test('pro-rates partial periods correctly', () => {
    const result = proRateMetric(300, 3, 7);
    expect(result.value).toBe(700);
    expect(result.proRated).toBe(true);
  });

  test('handles zero division in change calculation', () => {
    const change = calculateChange(100, 0);
    expect(change.percentage).toBe(Infinity);
  });
});
```

### Integration Tests

```javascript
describe('End-to-End Report Generation', () => {
  test('generates report successfully with MCP connected', async () => {
    const report = await generateReport({ period: '7d' });
    expect(report).toContain('Customer.io Analytics Report');
    expect(report).toContain('Executive Summary');
    expect(report).toContain('Deliverability Metrics');
  });

  test('shows setup instructions when MCP not connected', async () => {
    mockMCPDisconnect();
    const result = await runSkill(['cio-analytics']);
    expect(result).toContain('Customer.io MCP Setup Required');
  });
});
```

### Edge Cases

- Empty workspace (no campaigns)
- Single campaign only
- Zero sends in period
- Division by zero scenarios
- Invalid date formats
- Very large numbers
- Pro-rating with 1 day of data

---

## Success Criteria

### Functional
- ✓ Generates report in <10 seconds
- ✓ Accurate period comparisons (±0.1%)
- ✓ Pro-rating works correctly
- ✓ Claude generates relevant insights
- ✓ MCP setup instructions are clear

### Quality
- ✓ Report is easy to read and understand
- ✓ Insights are actionable
- ✓ Handles edge cases gracefully
- ✓ <5% error rate in testing

### User Experience
- ✓ Claude invokes automatically when relevant
- ✓ Report provides immediate value
- ✓ User can understand key findings in <30 seconds

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Core Functionality | 1 week | MCP connection + data fetching |
| Phase 2: Period Comparison | 1 week | Accurate comparisons with pro-rating |
| Phase 3: Report Template | 1 week | Professional unified report |
| Phase 4: LLM Insights | 1 week | AI-generated insights |
| Phase 5: Polish & Testing | 1 week | Production-ready skill |

**Total: 5 weeks** (simplified from 6 weeks in V1)

---

## What We Removed from V1

### Removed Features
- ❌ Scheduling functionality (lib/scheduler.js)
- ❌ Multiple report types (quick, deliverability, engagement)
- ❌ Hard-coded insights generation (lib/insights-generator.js)
- ❌ Benchmark comparisons (config/benchmarks.json)
- ❌ CSV/JSON export
- ❌ CLI arguments: --schedule, --type, --format, --output
- ❌ Cron job generation
- ❌ Email delivery integration

### What Stayed
- ✅ MCP connection checking
- ✅ Period-over-period comparison
- ✅ Pro-rating for partial periods
- ✅ Campaign breakdown
- ✅ Human-only engagement metrics
- ✅ Setup instructions

### What Got Better
- ✅ Simpler architecture (3 lib files instead of 6)
- ✅ LLM-powered insights (better than hard-coded)
- ✅ Single unified report (easier to understand)
- ✅ Automatic invocation by Claude (no manual commands)
- ✅ Faster to implement (5 weeks instead of 6)

---

## Appendix: Sample Report Output

```markdown
# Customer.io Analytics Report

**Period**: Last 7 days vs Previous 7 days (Mar 14-20 vs Mar 7-13)
**Workspace**: Shopflo
**Generated**: 2026-03-21 10:30:15

---

## 📊 Executive Summary

### Key Findings
- **Deliverability improved**: Delivery rate up 0.5 percentage points to 96.5%, indicating better email list health and sender reputation
- **Engagement mixed**: Open rate increased 1.2pp to 23.4%, but click-to-open rate declined 1.1pp, suggesting emails are being opened but content isn't driving clicks
- **Welcome Email excels**: 42.3% open rate (+8.2% vs previous period) - this campaign's subject line and timing strategy should be replicated
- **Newsletter declining**: Weekly Newsletter down 5.2% in open rate, now at 19.3% - requires content refresh or subject line testing

### Recommended Actions
1. **Analyze Welcome Email success factors**: Review subject line, send time, and content structure. Apply learnings to underperforming campaigns, especially Newsletter
2. **Improve click-through rates**: Click-to-open dropped to 24.8%. Test more prominent CTAs, reduce competing links, and ensure mobile-friendly button design
3. **Address Newsletter decline**: 5.2% drop in engagement suggests content fatigue or poor subject lines. Implement A/B testing and consider segmentation by engagement level

---

## 📈 Deliverability Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Sent** | 50,000 | 48,000 | ↗ +4.2% |
| **Delivered** | 48,250 (96.5%) | 46,080 (96.0%) | ↗ +0.5pp |
| **Bounced** | 1,600 (3.2%) | 1,440 (3.0%) | ↗ +0.2pp |
| **Failed** | 150 (0.3%) | 480 (1.0%) | ↘ -0.7pp |

**Period-over-Period**: Delivery rate improved from 96.0% to 96.5%, failure rate decreased significantly from 1.0% to 0.3%

---

## 💌 Engagement Metrics (Human Activity)

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Opens** | 11,290 | 10,252 | ↗ +10.1% |
| **Open Rate** | 23.4% | 22.2% | ↗ +1.2pp |
| **Clicks** | 2,799 | 2,650 | ↗ +5.6% |
| **Click Rate** | 5.8% | 5.7% | ↗ +0.1pp |
| **Click-to-Open** | 24.8% | 25.9% | ↘ -1.1pp |
| **Conversions** | 870 | 768 | ↗ +13.3% |
| **Conversion Rate** | 1.8% | 1.7% | ↗ +0.1pp |

**Bot Activity**: 3,240 machine opens (22.3% of total), 287 machine clicks (9.3% of total)

---

## 🎯 Campaign Performance

Top 10 campaigns by volume:

| Campaign | Sent | Open Rate | Click Rate | Conv Rate | Trend |
|----------|------|-----------|------------|-----------|-------|
| Welcome Email | 5,200 | 42.3% | 15.2% | 3.8% | ↗ +8.2% |
| Cart Abandonment | 8,100 | 28.4% | 12.4% | 2.1% | ↗ +3.1% |
| Re-engagement | 3,400 | 31.2% | 8.5% | 1.9% | ↗ +12.4% |
| Product Update | 12,500 | 22.8% | 6.2% | 1.4% | → +0.3% |
| Weekly Newsletter | 15,800 | 19.3% | 4.2% | 0.8% | ↘ -5.2% |
| Flash Sale | 2,100 | 26.7% | 11.3% | 3.2% | ↗ +4.8% |
| Tips & Tricks | 1,900 | 18.2% | 3.8% | 0.6% | ↘ -2.1% |

---

## 🔍 Detailed Analysis

**Performance Patterns:**
The data reveals a clear performance tier structure. Behavioral triggers (Welcome, Cart Abandonment, Re-engagement) significantly outperform broadcast content (Newsletter, Product Update). Welcome Email's 42.3% open rate is 1.8x the workspace average, suggesting high relevance and optimal timing.

**Engagement Paradox:**
While open rates increased 1.2pp, click-to-open rates declined 1.1pp. This suggests emails are successfully reaching inboxes and compelling opens, but content or CTAs aren't driving action. This pattern is most pronounced in Newsletter (-5.2% opens) and Product Update (flat engagement).

**Conversion Efficiency:**
Despite the click-to-open decline, conversions increased 13.3%. This indicates that clicks are more qualified, or the post-click experience improved. Cart Abandonment and Flash Sale campaigns show the strongest conversion efficiency at 2.1% and 3.2% respectively.

**Volume vs. Performance Trade-off:**
Newsletter represents 31.6% of total volume but delivers below-average engagement. Meanwhile, smaller campaigns like Welcome Email and Re-engagement achieve 2-3x better engagement rates. Consider reallocating send frequency or improving Newsletter segmentation.

---

## 📝 Notes

- All engagement metrics use human-only activity (bot opens/clicks excluded)
- Bot activity represents 22.3% of opens and 9.3% of clicks
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat (±0.5% threshold)

---

Generated by Customer.io Analytics Skill
```

---

**Document Version**: 2.0 (Simplified)
**Last Updated**: 2026-03-21
**Status**: Ready for Review and Implementation
