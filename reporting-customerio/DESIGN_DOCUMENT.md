# Customer.io Analytics Reporting Skill - Design Document

**Version:** 1.0
**Date:** 2026-03-21
**Status:** Design Phase (Phase B)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Skill Architecture](#skill-architecture)
3. [Command-Line Interface](#command-line-interface)
4. [MCP Connection Management](#mcp-connection-management)
5. [Time Period Handling](#time-period-handling)
6. [Metrics Specification](#metrics-specification)
7. [Report Types](#report-types)
8. [Insights Generation](#insights-generation)
9. [Scheduling Implementation](#scheduling-implementation)
10. [Implementation Phases](#implementation-phases)
11. [Testing Strategy](#testing-strategy)

---

## Executive Summary

### Goal
Build a comprehensive, production-ready Customer.io analytics reporting skill that provides actionable insights from deliverability and engagement metrics.

### Key Features
- ✅ Automatic MCP connection check with setup guidance
- ✅ Flexible time period analysis (7/30 day comparisons)
- ✅ Pro-rated metrics for partial period comparisons
- ✅ Campaign-level breakdowns with insights
- ✅ Bot-filtered engagement metrics
- ✅ Multiple report types (quick, detailed, deliverability, engagement)
- ✅ Scheduled recurring reports
- ✅ Custom campaign and date range support

### Success Criteria
1. Generate actionable report in <10 seconds
2. Accurate period-over-period comparisons with pro-rating
3. Clear setup instructions when MCP not connected
4. Human-readable insights, not just data dumps
5. Extensible architecture for new report types

---

## Skill Architecture

### Directory Structure

```
.claude/skills/cio-analytics/
├── SKILL.md                      # Main skill entry point
├── lib/
│   ├── mcp-checker.js           # MCP connection verification
│   ├── metrics-fetcher.js       # Data fetching from Customer.io
│   ├── calculator.js            # Metric calculations & pro-rating
│   ├── insights-generator.js    # Generate insights from data
│   ├── report-formatter.js      # Format reports (markdown/CSV)
│   └── scheduler.js             # Scheduling utilities
├── templates/
│   ├── setup-instructions.md    # MCP setup guide
│   ├── quick-report.md          # Quick report template
│   ├── detailed-report.md       # Detailed report template
│   ├── deliverability-report.md # Deliverability-focused template
│   └── engagement-report.md     # Engagement-focused template
├── config/
│   │   └── metrics.json             # Metric definitions & thresholds
│   └── benchmarks.json          # Industry benchmarks
└── README.md                     # Skill documentation
```

### Component Responsibilities

#### SKILL.md (Main Entry Point)
- Parse user arguments
- Check MCP connection
- Route to appropriate report type
- Handle errors gracefully

#### lib/mcp-checker.js
- Verify Customer.io MCP is connected
- Test workspace access
- Generate setup instructions if not connected
- Return workspace context

#### lib/metrics-fetcher.js
- Fetch workspace metrics for date ranges
- Fetch campaign-level metrics
- Handle pagination
- Cache workspace metadata (campaigns list)
- Error handling and retries

#### lib/calculator.js
- Calculate period-over-period changes
- Pro-rate metrics for partial periods
- Calculate derived metrics (rates, ratios)
- Compute trends and forecasts

#### lib/insights-generator.js
- Analyze metrics against benchmarks
- Identify top performers and underperformers
- Generate actionable recommendations
- Prioritize insights (critical, high, medium, low)

#### lib/report-formatter.js
- Format data into markdown tables
- Generate charts (ASCII or markdown)
- Export to CSV/JSON if requested
- Apply templates

#### lib/scheduler.js
- Create cron job for recurring reports
- Generate executable script
- Handle report delivery (file, stdout, email if configured)

---

## Command-Line Interface

### Invocation Methods

```bash
# Default: Standard report (last 7 days vs previous 7 days)
/cio-analytics

# Quick report (overview only)
/cio-analytics --quick

# Specific time periods
/cio-analytics --period 7d      # Last 7 days vs previous 7 days
/cio-analytics --period 30d     # Last 30 days vs previous 30 days

# Custom date range
/cio-analytics --from 2026-03-01 --to 2026-03-15

# Specific campaign
/cio-analytics --campaign 12345
/cio-analytics --campaign "Welcome Series"

# Report type
/cio-analytics --type deliverability
/cio-analytics --type engagement
/cio-analytics --type detailed

# Output format
/cio-analytics --format markdown  # Default
/cio-analytics --format csv
/cio-analytics --format json

# Schedule recurring report
/cio-analytics --schedule daily
/cio-analytics --schedule weekly
/cio-analytics --schedule monthly

# Combine options
/cio-analytics --period 30d --type engagement --format csv
```

### Argument Specification

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `--quick` | flag | false | Quick overview report (summary only) |
| `--period` | string | "7d" | Time period: "7d", "30d" |
| `--from` | date | - | Start date (YYYY-MM-DD) for custom range |
| `--to` | date | - | End date (YYYY-MM-DD) for custom range |
| `--campaign` | string/int | - | Campaign ID or name (partial match) |
| `--type` | string | "standard" | Report type: standard, deliverability, engagement, detailed |
| `--format` | string | "markdown" | Output format: markdown, csv, json |
| `--schedule` | string | - | Schedule frequency: daily, weekly, monthly |
| `--output` | path | - | Save report to file |
| `--workspace` | int | - | Workspace ID (auto-detected if not provided) |

### Argument Parsing Logic

```javascript
// Pseudo-code for SKILL.md
const args = parseArguments($ARGUMENTS);

// Validation
if (args.from && !args.to) {
  error("--from requires --to");
}

if (args.schedule && args.campaign) {
  error("Scheduled reports don't support campaign-specific filtering");
}

// Defaults
args.period = args.period || "7d";
args.type = args.type || "standard";
args.format = args.format || "markdown";
```

---

## MCP Connection Management

### Connection Check Flow

```
┌─────────────────────────────────┐
│ Skill Invoked                   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Check MCP Connection            │
│ (call list_workspaces)          │
└────────┬────────────────────────┘
         │
    ┌────▼─────┐
    │Connected?│
    └────┬─────┘
         │
    No ──┼── Yes
         │      │
         │      ▼
         │  ┌─────────────────────────┐
         │  │ Get Workspace Context    │
         │  │ - Workspace ID           │
         │  │ - Workspace name         │
         │  │ - Region (US/EU)         │
         │  └────────┬────────────────┘
         │           │
         │           ▼
         │      [Continue to Report Generation]
         │
         ▼
┌─────────────────────────────────┐
│ Show Setup Instructions          │
│ - Check if admin                 │
│ - Enable AI/MCP in settings      │
│ - Regional URL selection         │
│ - Authentication steps           │
│ - Verification command           │
└─────────────────────────────────┘
         │
         ▼
    [Exit with instructions]
```

### Setup Instructions Template

```markdown
# Customer.io MCP Setup Required

The Customer.io MCP server is not connected. Follow these steps to set it up:

## Prerequisites
✓ You must be an **account admin** in Customer.io
✓ Access to Customer.io settings

## Step 1: Enable MCP in Customer.io
1. Log in to Customer.io
2. Navigate to **Settings > Privacy, Data, & AI**
3. Enable these two settings:
   - ☑ "Customer.io AI"
   - ☑ "Customer.io MCP"
4. Save changes

## Step 2: Identify Your Region
Check your Customer.io URL to determine your region:
- `app.customer.io` → **US Region**
- `app-eu.customer.io` → **EU Region**

## Step 3: Configure MCP Server
Add the Customer.io MCP server to your Claude configuration:

**US Region:**
```
https://mcp.customer.io/mcp
```

**EU Region:**
```
https://mcp-eu.customer.io/mcp
```

## Step 4: Authenticate
Follow the OAuth authentication flow when prompted.

## Step 5: Verify
Restart Claude Desktop and run:
```
/cio-analytics
```

If successful, you'll see your analytics report!

---
Need help? Visit: https://docs.customer.io/ai/mcp-server/
```

---

## Time Period Handling

### Standard Periods

#### Last 7 Days (--period 7d)
```
Current Period: [Today - 7 days] to [Yesterday]
Previous Period: [Yesterday - 7 days] to [Yesterday - 14 days]

Example (if today is 2026-03-21):
Current:  2026-03-14 to 2026-03-20 (7 days)
Previous: 2026-03-07 to 2026-03-13 (7 days)
```

#### Last 30 Days (--period 30d)
```
Current Period: [Today - 30 days] to [Yesterday]
Previous Period: [Yesterday - 30 days] to [Yesterday - 60 days]

Example (if today is 2026-03-21):
Current:  2026-02-19 to 2026-03-20 (30 days)
Previous: 2026-01-20 to 2026-02-18 (30 days)
```

### Pro-Rating for Partial Periods

When comparing incomplete periods (e.g., "this week vs last week" on Wednesday):

#### Formula
```
Pro-rated Value = (Actual Value / Days Elapsed) × Target Days

Example:
If today is Wednesday (3 days into the week):
- Current week actual: 300 opens (3 days)
- Current week pro-rated: (300 / 3) × 7 = 700 opens (projected full week)
- Last week actual: 650 opens (7 days)
- Comparison: 700 vs 650 = +7.7% (projected)
```

#### Implementation
```javascript
function proRateMetric(value, actualDays, targetDays) {
  if (actualDays === targetDays) {
    return { value, proRated: false };
  }

  const proRatedValue = Math.round((value / actualDays) * targetDays);
  return {
    value: proRatedValue,
    proRated: true,
    actualValue: value,
    actualDays,
    targetDays,
    dailyAverage: Math.round(value / actualDays)
  };
}
```

#### Display Format
```markdown
### This Week vs Last Week (Pro-rated)

**Current Week** (3 days elapsed)
- Actual: 300 opens
- Projected (7 days): **700 opens** ↗ +7.7% vs last week
- Daily average: 100 opens/day

**Last Week** (complete)
- Actual: 650 opens
- Daily average: 93 opens/day

💡 **Insight**: Tracking +7.7% ahead of last week based on current pace.
```

### Custom Date Ranges

```javascript
// When user provides --from and --to
function customRange(from, to) {
  const days = calculateDays(from, to);
  const previousFrom = subtractDays(from, days);
  const previousTo = subtractDays(to, days);

  return {
    current: { from, to, days },
    previous: { from: previousFrom, to: previousTo, days }
  };
}

// Example:
// --from 2026-03-01 --to 2026-03-15
// Current: 2026-03-01 to 2026-03-15 (15 days)
// Previous: 2026-02-14 to 2026-02-28 (15 days)
```

---

## Metrics Specification

### Primary Metrics

#### Deliverability Metrics

| Metric | Formula | Benchmark | Source Field |
|--------|---------|-----------|--------------|
| **Sent** | Raw count | - | `sent` |
| **Delivered** | Raw count | - | `delivered` |
| **Bounced** | Raw count | - | `bounced` |
| **Failed** | Raw count | - | `failed` |
| **Spam Reports** | Raw count | - | `spammed` |
| **Delivery Rate** | `(delivered / sent) × 100` | >95% | Calculated |
| **Bounce Rate** | `(bounced / sent) × 100` | <5% | Calculated |
| **Failure Rate** | `(failed / sent) × 100` | <2% | Calculated |

#### Engagement Metrics (Human Only)

| Metric | Formula | Benchmark | Source Field |
|--------|---------|-----------|--------------|
| **Opens** | Raw count | - | `human_opened` |
| **Clicks** | Raw count | - | `human_clicked` |
| **Conversions** | Raw count | - | `converted` |
| **Unsubscribes** | Raw count | - | `unsubscribed` |
| **Open Rate** | `(human_opened / delivered) × 100` | >20% | Calculated |
| **Click Rate** | `(human_clicked / delivered) × 100` | >5% | Calculated |
| **Click-to-Open** | `(human_clicked / human_opened) × 100` | >15% | Calculated |
| **Conversion Rate** | `(converted / delivered) × 100` | Varies | Calculated |
| **Unsubscribe Rate** | `(unsubscribed / delivered) × 100` | <0.5% | Calculated |

### Period-over-Period Comparison

#### Change Calculation
```javascript
function calculateChange(current, previous) {
  if (previous === 0) {
    return current > 0 ? Infinity : 0;
  }

  const change = ((current - previous) / previous) * 100;
  return {
    absolute: current - previous,
    percentage: Math.round(change * 10) / 10,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
  };
}
```

#### Display Format
```markdown
**Open Rate**: 24.5% ↗ +2.3% (+15.2% relative)
  vs Previous: 22.2%
```

### Benchmark Comparison

```javascript
const BENCHMARKS = {
  deliverability: {
    delivery_rate: { excellent: 98, good: 95, average: 90, poor: 0 },
    bounce_rate: { excellent: 0, good: 2, average: 5, poor: 10 }
  },
  engagement: {
    open_rate: { excellent: 30, good: 20, average: 10, poor: 0 },
    click_rate: { excellent: 10, good: 5, average: 2, poor: 0 },
    click_to_open: { excellent: 20, good: 15, average: 10, poor: 0 }
  }
};

function getBenchmarkRating(metric, value) {
  const bench = BENCHMARKS[category][metric];
  if (value >= bench.excellent) return 'excellent';
  if (value >= bench.good) return 'good';
  if (value >= bench.average) return 'average';
  return 'poor';
}
```

### Display with Benchmarks
```markdown
**Delivery Rate**: 96.8% 🟢 Good
**Open Rate**: 31.2% 🟢 Excellent
**Click Rate**: 4.2% 🟡 Average
**Bounce Rate**: 8.5% 🔴 Poor ⚠️ Action needed
```

---

## Report Types

### 1. Quick Report (--quick)

**Purpose**: Fast overview for daily check-ins
**Execution Time**: <5 seconds
**Content**:
- Top 3 metrics with trends
- Top 3 performing campaigns
- Critical issues only

**Template**:
```markdown
# Customer.io Quick Report
**Period**: Last 7 days vs Previous 7 days
**Generated**: 2026-03-21 10:30 AM

## Overview
📊 **Delivery Rate**: 96.2% ↗ +1.2%
📧 **Open Rate**: 23.4% ↘ -2.1%
🖱️ **Click Rate**: 5.8% ↗ +0.8%

## Top Performers
1. Welcome Email - 42.3% open rate
2. Cart Abandonment - 12.4% click rate
3. Re-engagement - 8.2% conversion rate

## ⚠️ Attention Required
- Bounce rate increased to 6.8% (+2.3%)

---
Run `/cio-analytics --type detailed` for full report
```

### 2. Standard Report (default)

**Purpose**: Comprehensive weekly review
**Execution Time**: <10 seconds
**Content**:
- All key metrics with period comparisons
- Top 10 campaigns breakdown
- Insights and recommendations
- Trend indicators

**Template**: See `templates/detailed-report.md` (below)

### 3. Deliverability Report (--type deliverability)

**Purpose**: Email health monitoring
**Execution Time**: <10 seconds
**Content**:
- Delivery metrics deep dive
- Bounce analysis (hard vs soft)
- Spam report tracking
- ISP-specific issues (if available)
- Deliverability recommendations

**Focus Metrics**:
- Delivery rate
- Bounce rate (by type)
- Spam complaint rate
- Block rate
- Failure reasons

### 4. Engagement Report (--type engagement)

**Purpose**: Optimize email content and targeting
**Execution Time**: <10 seconds
**Content**:
- Engagement funnel (delivered → opened → clicked → converted)
- Human vs bot activity comparison
- Click-to-open rate analysis
- Engagement by campaign type
- Content optimization tips

**Focus Metrics**:
- Open rate (human only)
- Click rate (human only)
- Click-to-open rate
- Conversion rate
- Engagement trend

### 5. Campaign-Specific Report (--campaign)

**Purpose**: Deep dive into single campaign
**Execution Time**: <8 seconds
**Content**:
- Campaign details (name, type, status)
- All metrics for this campaign
- Historical trend (if available)
- A/B test results (if applicable)
- Specific recommendations

---

## Insights Generation

### Insight Categories

#### 1. Top Performers
```javascript
function identifyTopPerformers(campaigns, metric = 'open_rate') {
  return campaigns
    .filter(c => c.metrics.delivered > 100) // Min threshold
    .sort((a, b) => b.metrics[metric] - a.metrics[metric])
    .slice(0, 5)
    .map(campaign => ({
      name: campaign.name,
      value: campaign.metrics[metric],
      insight: generateInsight(campaign, metric)
    }));
}
```

**Example Output**:
```markdown
## 🏆 Top Performers

1. **Welcome Email Series** - 42.3% open rate
   💡 28% above average - consider using similar subject lines in other campaigns

2. **Cart Abandonment** - 12.4% click rate
   💡 2.5x workspace average - strong CTA performing well
```

#### 2. Underperformers / Issues
```javascript
function identifyIssues(campaigns, benchmarks) {
  const issues = [];

  campaigns.forEach(campaign => {
    // Deliverability issues
    if (campaign.metrics.bounce_rate > benchmarks.bounce_rate.poor) {
      issues.push({
        severity: 'critical',
        campaign: campaign.name,
        issue: `High bounce rate: ${campaign.metrics.bounce_rate}%`,
        recommendation: 'Clean email list, check for invalid addresses'
      });
    }

    // Engagement issues
    if (campaign.metrics.open_rate < benchmarks.open_rate.poor) {
      issues.push({
        severity: 'high',
        campaign: campaign.name,
        issue: `Low open rate: ${campaign.metrics.open_rate}%`,
        recommendation: 'Test different subject lines, improve sender reputation'
      });
    }

    // Declining trends
    if (campaign.change.open_rate < -20) {
      issues.push({
        severity: 'medium',
        campaign: campaign.name,
        issue: `Open rate dropped ${campaign.change.open_rate}%`,
        recommendation: 'Review recent content changes, check send frequency'
      });
    }
  });

  return issues.sort((a, b) =>
    severityWeight[a.severity] - severityWeight[b.severity]
  );
}
```

**Example Output**:
```markdown
## ⚠️ Issues Requiring Attention

### 🔴 Critical
1. **Newsletter March 2026** - Bounce rate: 11.2%
   → Clean email list, check for invalid addresses
   → Consider re-engagement campaign before next send

### 🟡 Medium
2. **Product Update** - Open rate dropped 24.3%
   → Review recent content changes
   → Test new subject line variations
```

#### 3. Trends & Patterns
```javascript
function analyzeTrends(current, previous, historical = []) {
  const trends = [];

  // Week-over-week trends
  if (current.metrics.open_rate > previous.metrics.open_rate * 1.1) {
    trends.push({
      type: 'positive',
      metric: 'open_rate',
      message: `Open rate trending up (+${change}%) - maintain current strategy`
    });
  }

  // Multi-period trends (if historical data available)
  if (historical.length >= 4) {
    const openRates = historical.map(h => h.metrics.open_rate);
    const trend = calculateTrendLine(openRates);

    if (trend.slope > 0.5) {
      trends.push({
        type: 'insight',
        message: `Consistent upward trend in engagement over ${historical.length} weeks`
      });
    }
  }

  return trends;
}
```

#### 4. Actionable Recommendations
```javascript
function generateRecommendations(workspace, campaigns) {
  const recommendations = [];

  // Priority 1: Critical deliverability issues
  if (workspace.metrics.bounce_rate > 5) {
    recommendations.push({
      priority: 'critical',
      action: 'Email List Hygiene',
      description: 'High bounce rate detected workspace-wide',
      steps: [
        'Remove hard bounces immediately',
        'Re-verify email addresses',
        'Implement double opt-in for new subscribers',
        'Consider email validation service'
      ],
      impact: 'High - Affects sender reputation'
    });
  }

  // Priority 2: Low engagement opportunities
  const lowEngagement = campaigns.filter(c => c.metrics.open_rate < 15);
  if (lowEngagement.length > 0) {
    recommendations.push({
      priority: 'high',
      action: 'Subject Line Optimization',
      description: `${lowEngagement.length} campaigns with <15% open rate`,
      steps: [
        'A/B test subject lines',
        'Personalize subject lines with recipient name',
        'Test send time optimization',
        'Review preview text'
      ],
      impact: 'Medium - Can increase opens by 20-30%'
    });
  }

  // Priority 3: Best practice optimizations
  if (workspace.metrics.click_to_open < 15) {
    recommendations.push({
      priority: 'medium',
      action: 'Email Content Optimization',
      description: 'Low click-to-open rate indicates weak CTAs',
      steps: [
        'Make CTAs more prominent and action-oriented',
        'Reduce number of links (focus on primary CTA)',
        'Test button vs text links',
        'Ensure mobile-friendly design'
      ],
      impact: 'Medium - Can improve conversions by 15-25%'
    });
  }

  return recommendations;
}
```

**Example Output**:
```markdown
## 🎯 Recommended Actions

### 🔴 Critical Priority
**Email List Hygiene**
Bounce rate (6.8%) exceeds healthy threshold

Steps to take:
1. Remove hard bounces immediately
2. Re-verify email addresses
3. Implement double opt-in for new subscribers
4. Consider email validation service

Expected impact: High - Protects sender reputation

### 🟡 High Priority
**Subject Line Optimization**
8 campaigns with <15% open rate

Steps to take:
1. A/B test subject lines
2. Personalize with recipient name
3. Test send time optimization
4. Review preview text

Expected impact: Medium - Can increase opens by 20-30%
```

### Insight Prioritization

```javascript
const SEVERITY_WEIGHTS = {
  critical: 1,  // Deliverability issues, major drops
  high: 2,      // Significant underperformance
  medium: 3,    // Optimization opportunities
  low: 4        // Nice-to-have improvements
};
```

---

## Scheduling Implementation

### Approach: Generate Executable Script

Rather than building a complex scheduling daemon, generate a simple executable script that users can schedule with their preferred tool (cron, Task Scheduler, etc.).

### Generated Script Structure

```bash
#!/bin/bash
# Customer.io Analytics Report - Auto-generated
# Frequency: daily
# Generated: 2026-03-21 10:30:00

# Configuration
REPORT_TYPE="standard"
PERIOD="7d"
OUTPUT_DIR="$HOME/cio-reports"
OUTPUT_FILE="$OUTPUT_DIR/cio-report-$(date +%Y-%m-%d).md"

# Create output directory if needed
mkdir -p "$OUTPUT_DIR"

# Run report
claude skill cio-analytics \
  --type "$REPORT_TYPE" \
  --period "$PERIOD" \
  --format markdown \
  --output "$OUTPUT_FILE"

# Optional: Email report (if configured)
if [ -n "$EMAIL_TO" ]; then
  mail -s "Customer.io Analytics Report - $(date +%Y-%m-%d)" \
    "$EMAIL_TO" < "$OUTPUT_FILE"
fi

# Optional: Clean up old reports (keep last 30 days)
find "$OUTPUT_DIR" -name "cio-report-*.md" -mtime +30 -delete
```

### Scheduling Options

#### macOS/Linux (cron)
```bash
# Daily at 9 AM
0 9 * * * /Users/username/.claude/skills/cio-analytics/scheduled-report.sh

# Weekly on Monday at 9 AM
0 9 * * 1 /Users/username/.claude/skills/cio-analytics/scheduled-report.sh

# Monthly on 1st at 9 AM
0 9 1 * * /Users/username/.claude/skills/cio-analytics/scheduled-report.sh
```

#### Windows (Task Scheduler)
Generate a `.bat` file and instructions for Task Scheduler.

### Implementation in Skill

```javascript
// lib/scheduler.js
function generateScheduledScript(options) {
  const {
    frequency, // 'daily', 'weekly', 'monthly'
    reportType = 'standard',
    period = '7d',
    outputDir = '$HOME/cio-reports',
    emailTo = null
  } = options;

  const script = `#!/bin/bash
# Customer.io Analytics Report - Auto-generated
# Frequency: ${frequency}
# Generated: ${new Date().toISOString()}

REPORT_TYPE="${reportType}"
PERIOD="${period}"
OUTPUT_DIR="${outputDir}"
OUTPUT_FILE="$OUTPUT_DIR/cio-report-$(date +%Y-%m-%d).md"

mkdir -p "$OUTPUT_DIR"

claude skill cio-analytics \\
  --type "$REPORT_TYPE" \\
  --period "$PERIOD" \\
  --format markdown \\
  --output "$OUTPUT_FILE"

${emailTo ? `
if [ -n "$EMAIL_TO" ]; then
  mail -s "Customer.io Analytics Report - $(date +%Y-%m-%d)" \\
    "${emailTo}" < "$OUTPUT_FILE"
fi
` : ''}

find "$OUTPUT_DIR" -name "cio-report-*.md" -mtime +30 -delete
`;

  const cronSchedule = {
    daily: '0 9 * * *',
    weekly: '0 9 * * 1',
    monthly: '0 9 1 * *'
  }[frequency];

  return {
    script,
    cronSchedule,
    instructions: generateCronInstructions(cronSchedule, scriptPath)
  };
}
```

### User Instructions

```markdown
# Schedule Your Customer.io Analytics Report

## Script Created
✓ Scheduled report script created at:
  `~/.claude/skills/cio-analytics/scheduled-daily-report.sh`

## Next Steps

### macOS/Linux (cron)
1. Make the script executable:
   ```bash
   chmod +x ~/.claude/skills/cio-analytics/scheduled-daily-report.sh
   ```

2. Open your crontab:
   ```bash
   crontab -e
   ```

3. Add this line (runs daily at 9 AM):
   ```
   0 9 * * * ~/.claude/skills/cio-analytics/scheduled-daily-report.sh
   ```

4. Save and exit

### Windows (Task Scheduler)
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily at 9:00 AM
4. Action: Start a program
5. Program: `C:\path\to\scheduled-daily-report.bat`
6. Finish

## Report Location
Reports will be saved to: `~/cio-reports/cio-report-YYYY-MM-DD.md`

## Email Delivery (Optional)
To email reports, set the EMAIL_TO environment variable:
```bash
export EMAIL_TO="your-email@example.com"
```

## Verify
Test the script manually:
```bash
~/.claude/skills/cio-analytics/scheduled-daily-report.sh
```
```

---

## Implementation Phases

### Phase A.1: Core Infrastructure (Week 1)
**Goal**: Basic skill that can check MCP and fetch data

**Tasks**:
1. Create skill directory structure
2. Implement `lib/mcp-checker.js`
   - Test MCP connection
   - Return workspace context or setup instructions
3. Implement `lib/metrics-fetcher.js`
   - Fetch workspace metrics for single period
   - Handle errors gracefully
4. Create `templates/setup-instructions.md`
5. Basic SKILL.md that checks connection and fetches one metric

**Deliverable**: Skill that checks MCP and shows basic workspace metrics

**Acceptance Criteria**:
- ✓ Shows setup instructions when MCP not connected
- ✓ Fetches and displays raw metrics when connected
- ✓ Handles errors without crashing

### Phase A.2: Period Comparison & Calculations (Week 2)
**Goal**: Calculate period-over-period comparisons

**Tasks**:
1. Implement `lib/calculator.js`
   - Period-over-period change calculations
   - Pro-rating for partial periods
   - Derived metric calculations (rates)
2. Add date range handling
   - Last 7 days vs previous 7 days
   - Last 30 days vs previous 30 days
3. Update metrics-fetcher to get two periods
4. Display comparison in basic format

**Deliverable**: Skill shows "last 7 days vs previous 7 days" with % changes

**Acceptance Criteria**:
- ✓ Accurate period calculations
- ✓ Pro-rating works correctly
- ✓ Shows absolute and percentage changes

### Phase A.3: Report Formatting (Week 3)
**Goal**: Professional-looking reports

**Tasks**:
1. Implement `lib/report-formatter.js`
   - Markdown table formatting
   - Emoji indicators (↗↘)
   - Benchmark badges (🟢🟡🔴)
2. Create report templates
   - Quick report template
   - Standard report template
3. Add `--quick` and `--type` argument support
4. Implement benchmarks comparison

**Deliverable**: Beautiful, readable reports with benchmarks

**Acceptance Criteria**:
- ✓ Reports are visually clear and scannable
- ✓ Metrics show benchmark ratings
- ✓ Trends are visually obvious

### Phase A.4: Campaign Breakdown (Week 4)
**Goal**: Show per-campaign metrics

**Tasks**:
1. Extend metrics-fetcher to get campaign list
2. Fetch metrics for each campaign (or top N campaigns)
3. Sort campaigns by performance
4. Add campaign filtering (`--campaign` argument)
5. Generate campaign-specific insights

**Deliverable**: Reports show top 10 campaigns with individual metrics

**Acceptance Criteria**:
- ✓ Top performers clearly identified
- ✓ Can filter to specific campaign
- ✓ Campaign metrics accurate

### Phase A.5: Insights Generation (Week 5)
**Goal**: Actionable recommendations, not just data

**Tasks**:
1. Implement `lib/insights-generator.js`
   - Identify top performers
   - Detect issues (critical/high/medium)
   - Generate recommendations
2. Add insights to all report types
3. Prioritize recommendations by severity
4. Include actionable steps

**Deliverable**: Reports include insights and recommendations

**Acceptance Criteria**:
- ✓ At least 3 insights per report
- ✓ Recommendations are specific and actionable
- ✓ Issues are prioritized correctly

### Phase A.6: Scheduling & Polish (Week 6)
**Goal**: Production-ready skill with scheduling

**Tasks**:
1. Implement `lib/scheduler.js`
   - Generate executable scripts
   - Create cron/Task Scheduler instructions
2. Add `--schedule` argument support
3. Add `--output` argument for file saving
4. Add CSV/JSON export formats
5. Comprehensive error handling
6. Documentation and examples
7. Testing with edge cases

**Deliverable**: Production-ready skill with all features

**Acceptance Criteria**:
- ✓ Scheduling works on macOS and Linux
- ✓ All report types working
- ✓ Handles edge cases gracefully
- ✓ Complete documentation

---

## Testing Strategy

### Unit Tests

```javascript
// Test calculator.js
describe('Calculator', () => {
  test('calculates period-over-period change correctly', () => {
    const result = calculateChange(120, 100);
    expect(result.percentage).toBe(20);
    expect(result.absolute).toBe(20);
    expect(result.trend).toBe('up');
  });

  test('pro-rates partial periods correctly', () => {
    const result = proRateMetric(300, 3, 7);
    expect(result.value).toBe(700);
    expect(result.proRated).toBe(true);
    expect(result.dailyAverage).toBe(100);
  });

  test('handles zero division', () => {
    const result = calculateChange(100, 0);
    expect(result.percentage).toBe(Infinity);
  });
});

// Test insights-generator.js
describe('Insights Generator', () => {
  test('identifies top performers', () => {
    const campaigns = [
      { name: 'A', metrics: { open_rate: 30, delivered: 1000 } },
      { name: 'B', metrics: { open_rate: 25, delivered: 500 } },
      { name: 'C', metrics: { open_rate: 35, delivered: 2000 } }
    ];

    const top = identifyTopPerformers(campaigns, 'open_rate');
    expect(top[0].name).toBe('C');
    expect(top.length).toBeLessThanOrEqual(5);
  });

  test('detects critical issues', () => {
    const campaign = {
      name: 'Test',
      metrics: { bounce_rate: 12 }
    };

    const issues = identifyIssues([campaign], BENCHMARKS);
    expect(issues[0].severity).toBe('critical');
    expect(issues[0].issue).toContain('bounce rate');
  });
});
```

### Integration Tests

```javascript
describe('E2E Report Generation', () => {
  test('generates quick report successfully', async () => {
    const report = await generateReport({
      type: 'quick',
      period: '7d',
      workspace: TEST_WORKSPACE_ID
    });

    expect(report).toContain('# Customer.io Quick Report');
    expect(report).toContain('Delivery Rate');
    expect(report).toContain('Top Performers');
  });

  test('handles MCP connection failure gracefully', async () => {
    // Mock MCP disconnection
    mockMCPDisconnect();

    const result = await runSkill(['cio-analytics']);
    expect(result).toContain('Customer.io MCP Setup Required');
    expect(result).toContain('https://mcp.customer.io/mcp');
  });

  test('handles empty workspace data', async () => {
    // Mock workspace with no campaigns
    mockEmptyWorkspace();

    const report = await generateReport({ period: '7d' });
    expect(report).toContain('No campaigns found');
    expect(report).not.toThrow();
  });
});
```

### Test Data

Create mock responses for testing:

```javascript
// test/fixtures/workspace-metrics.json
{
  "current": {
    "start_date": "2026-03-14",
    "end_date": "2026-03-20",
    "metrics": {
      "sent": 50000,
      "delivered": 48250,
      "bounced": 1500,
      "human_opened": 11238,
      "human_clicked": 2892,
      "converted": 578
    }
  },
  "previous": {
    "start_date": "2026-03-07",
    "end_date": "2026-03-13",
    "metrics": {
      "sent": 48000,
      "delivered": 46560,
      "bounced": 1200,
      "human_opened": 10252,
      "human_clicked": 2650,
      "converted": 512
    }
  }
}
```

### Edge Cases to Test

1. **Empty Data**
   - No campaigns in workspace
   - Campaign with zero sends
   - All metrics are zero

2. **Division by Zero**
   - Previous period has zero (first campaign send)
   - Delivered count is zero (100% bounce)

3. **Invalid Dates**
   - Future dates
   - Start date after end date
   - Invalid date format

4. **Partial Periods**
   - Single day of data
   - Incomplete week/month

5. **Large Numbers**
   - Millions of sends
   - Very small percentages (<0.1%)

6. **Special Characters**
   - Campaign names with quotes, emojis
   - HTML in campaign names

---

## Configuration Files

### config/metrics.json

```json
{
  "deliverability": [
    {
      "key": "sent",
      "label": "Sent",
      "description": "Total emails sent",
      "source": "sent",
      "type": "count"
    },
    {
      "key": "delivered",
      "label": "Delivered",
      "description": "Successfully delivered emails",
      "source": "delivered",
      "type": "count"
    },
    {
      "key": "delivery_rate",
      "label": "Delivery Rate",
      "description": "Percentage of sent emails that were delivered",
      "formula": "(delivered / sent) * 100",
      "type": "percentage",
      "benchmark_category": "deliverability"
    }
  ],
  "engagement": [
    {
      "key": "human_opened",
      "label": "Opens (Human)",
      "description": "Email opens by humans (excluding bots)",
      "source": "human_opened",
      "type": "count",
      "critical": true
    },
    {
      "key": "open_rate",
      "label": "Open Rate",
      "description": "Percentage of delivered emails opened by humans",
      "formula": "(human_opened / delivered) * 100",
      "type": "percentage",
      "benchmark_category": "engagement"
    }
  ]
}
```

### config/benchmarks.json

```json
{
  "deliverability": {
    "delivery_rate": {
      "excellent": 98,
      "good": 95,
      "average": 90,
      "poor": 0,
      "unit": "%",
      "higher_is_better": true
    },
    "bounce_rate": {
      "excellent": 0,
      "good": 2,
      "average": 5,
      "poor": 10,
      "unit": "%",
      "higher_is_better": false
    }
  },
  "engagement": {
    "open_rate": {
      "excellent": 30,
      "good": 20,
      "average": 10,
      "poor": 0,
      "unit": "%",
      "higher_is_better": true
    },
    "click_rate": {
      "excellent": 10,
      "good": 5,
      "average": 2,
      "poor": 0,
      "unit": "%",
      "higher_is_better": true
    }
  }
}
```

---

## Error Handling

### Error Categories

1. **MCP Connection Errors**
   - MCP not configured → Show setup instructions
   - Authentication failed → Re-authenticate prompt
   - Network error → Retry with backoff

2. **Data Errors**
   - Workspace not found → List available workspaces
   - Campaign not found → Show available campaigns
   - No data for period → Explain why (e.g., draft campaign)

3. **Input Validation Errors**
   - Invalid date format → Show expected format
   - Invalid period → List valid options
   - Missing required args → Show usage help

4. **Calculation Errors**
   - Division by zero → Handle gracefully with "N/A" or "∞"
   - Negative values → Investigate and report

### Error Messages

```javascript
const ERROR_MESSAGES = {
  MCP_NOT_CONNECTED: {
    title: 'Customer.io MCP Not Connected',
    message: 'The Customer.io MCP server is not connected.',
    action: 'Show setup instructions',
    template: 'setup-instructions.md'
  },

  WORKSPACE_NOT_FOUND: {
    title: 'Workspace Not Found',
    message: 'Could not find workspace with ID: {workspaceId}',
    action: 'List available workspaces',
    recovery: 'Use --workspace flag to specify workspace ID'
  },

  INVALID_DATE: {
    title: 'Invalid Date Format',
    message: 'Date must be in YYYY-MM-DD format',
    example: '--from 2026-03-01 --to 2026-03-15'
  },

  NO_DATA: {
    title: 'No Data Available',
    message: 'No metrics found for the specified period',
    reasons: [
      'Campaign may be in draft status (never sent)',
      'Date range may be too far in the past',
      'Campaign may have been deleted'
    ]
  }
};
```

---

## Performance Considerations

### Caching Strategy

```javascript
// Cache workspace metadata (rarely changes)
const CACHE = {
  campaigns: {
    ttl: 3600, // 1 hour
    data: null,
    timestamp: null
  },
  segments: {
    ttl: 3600,
    data: null,
    timestamp: null
  }
};

function getCachedData(key) {
  const cache = CACHE[key];
  if (!cache.data || Date.now() - cache.timestamp > cache.ttl * 1000) {
    return null;
  }
  return cache.data;
}

function setCachedData(key, data) {
  CACHE[key].data = data;
  CACHE[key].timestamp = Date.now();
}
```

### Optimization Tips

1. **Minimize API Calls**
   - Batch campaign metrics if possible
   - Cache campaign list
   - Use `summary_only=true` when time series not needed

2. **Parallel Fetching**
   - Fetch current and previous periods in parallel
   - Fetch campaign list and workspace metrics in parallel

3. **Lazy Loading**
   - Only fetch campaign details when `--campaign` specified
   - Only generate insights when needed (not for `--quick`)

### Performance Targets

- Quick report: <5 seconds
- Standard report: <10 seconds
- Campaign-specific: <8 seconds
- Scheduled report (background): No limit

---

## Security Considerations

1. **API Keys**
   - Never log or expose MCP authentication tokens
   - Don't include sensitive data in error messages

2. **Data Privacy**
   - Don't write sensitive customer data to files without consent
   - Respect workspace permissions

3. **Input Validation**
   - Sanitize campaign names before display
   - Validate all date inputs
   - Prevent command injection in scheduler scripts

---

## Documentation Requirements

### User Documentation

1. **README.md** - Overview and quick start
2. **USAGE.md** - Detailed usage guide with examples
3. **TROUBLESHOOTING.md** - Common issues and solutions
4. **SCHEDULING.md** - Scheduling setup instructions

### Developer Documentation

1. **ARCHITECTURE.md** - System architecture
2. **API.md** - Internal API documentation
3. **CONTRIBUTING.md** - How to extend the skill

---

## Success Metrics

### Functional Metrics
- ✓ All report types generate successfully
- ✓ Period calculations are accurate
- ✓ Insights are relevant and actionable
- ✓ Scheduling works on target platforms

### Quality Metrics
- ✓ <5% error rate in production usage
- ✓ Performance targets met (see Performance Considerations)
- ✓ User can understand report without documentation
- ✓ Setup instructions work first time

### User Experience Metrics
- ✓ Time to first report: <2 minutes (if MCP already setup)
- ✓ Time to understand issues: <30 seconds (scanning quick report)
- ✓ Time to schedule: <5 minutes

---

## Future Enhancements (Post-v1)

### Phase B Features (v1.1)
- Data visualization (charts via ASCII or external tools)
- Export to Google Sheets
- Slack/email integration
- Multi-workspace comparison
- Historical trend analysis (>2 periods)

### Phase C Features (v2.0)
- Anomaly detection (ML-based)
- Predictive analytics
- Automated A/B test analysis
- Segment-level reporting
- Custom metric definitions

---

## Appendix A: Sample Report Output

### Quick Report
```markdown
# Customer.io Quick Report
**Period**: Last 7 days vs Previous 7 days
**Workspace**: Shopflo (ID: 200390)
**Generated**: 2026-03-21 10:30:15

## Overview
📊 **Delivery Rate**: 96.5% 🟢 ↗ +1.2%
📧 **Open Rate**: 23.4% 🟢 ↘ -2.1%
🖱️ **Click Rate**: 5.8% 🟡 ↗ +0.8%

## 🏆 Top Performers
1. **Welcome Email** - 42.3% open rate (🟢 Excellent)
2. **Cart Abandonment** - 12.4% click rate (🟢 Excellent)
3. **Re-engagement Series** - 8.2% conversion rate

## ⚠️ Attention Required
- **Newsletter March 2026**: Bounce rate 6.8% (🔴 Poor, +2.3%)

---
📊 Run `/cio-analytics --type detailed` for full report
```

### Standard Report (Excerpt)
```markdown
# Customer.io Analytics Report
**Period**: Last 7 days vs Previous 7 days
**Workspace**: Shopflo (ID: 200390)
**Generated**: 2026-03-21 10:30:15

## Executive Summary

### Key Metrics
| Metric | Current | Previous | Change | Rating |
|--------|---------|----------|--------|--------|
| **Delivery Rate** | 96.5% | 95.3% | ↗ +1.2% | 🟢 Good |
| **Open Rate** | 23.4% | 25.5% | ↘ -2.1% | 🟢 Good |
| **Click Rate** | 5.8% | 5.0% | ↗ +0.8% | 🟡 Average |
| **Bounce Rate** | 3.2% | 2.8% | ↗ +0.4% | 🟢 Good |
| **Conversion Rate** | 1.8% | 1.6% | ↗ +0.2% | - |

### Volume
- **Total Sent**: 50,000 emails (↗ +4.2% vs 48,000)
- **Delivered**: 48,250 emails
- **Bounced**: 1,600 emails
- **Opens (Human)**: 11,290 opens
- **Clicks (Human)**: 2,799 clicks
- **Conversions**: 870 conversions

---

## 🏆 Top Performing Campaigns

| Campaign | Sent | Open Rate | Click Rate | Rating |
|----------|------|-----------|------------|--------|
| Welcome Email | 5,200 | 42.3% 🟢 | 15.2% 🟢 | Excellent |
| Cart Abandonment | 8,100 | 28.4% 🟢 | 12.4% 🟢 | Excellent |
| Re-engagement Series | 3,400 | 31.2% 🟢 | 8.5% 🟡 | Good |
| Product Update | 12,500 | 22.8% 🟢 | 6.2% 🟡 | Good |
| Weekly Newsletter | 15,800 | 19.3% 🟡 | 4.2% 🟡 | Average |

---

## 💡 Insights & Recommendations

### 🔴 Critical Priority

**1. Email List Hygiene - Newsletter March 2026**
- **Issue**: Bounce rate 6.8% (🔴 Poor), increased +2.3%
- **Impact**: High - Threatens sender reputation
- **Action Steps**:
  1. Remove hard bounces immediately
  2. Re-verify email addresses
  3. Implement double opt-in
  4. Consider email validation service

### 🟡 High Priority

**2. Subject Line Optimization - 3 campaigns**
- **Issue**: Product Update, Flash Sale, Tips & Tricks all <15% open rate
- **Impact**: Medium - Missing engagement opportunities
- **Action Steps**:
  1. A/B test subject lines
  2. Add personalization
  3. Test send time optimization
  4. Review preview text

### 🟢 Positive Trends

**3. Welcome Email Performance**
- **Insight**: 42.3% open rate, 28% above workspace average
- **Recommendation**: Analyze subject line and apply learnings to other campaigns

---

## 📊 Detailed Metrics

### Deliverability
- **Sent**: 50,000
- **Delivered**: 48,250 (96.5% rate 🟢)
- **Bounced**: 1,600 (3.2% rate 🟢)
  - Hard bounces: 980
  - Soft bounces: 620
- **Failed**: 150 (0.3% rate 🟢)

### Engagement (Human Activity Only)
- **Opens**: 11,290 (23.4% rate 🟢)
- **Clicks**: 2,799 (5.8% rate 🟡)
- **Click-to-Open Rate**: 24.8% 🟢
- **Conversions**: 870 (1.8% rate)

### Bot Activity (Excluded from rates)
- **Machine Opens**: 3,240 (22.3% of total opens)
- **Machine Clicks**: 287 (9.3% of total clicks)
- **Prefetch Opens**: 1,856

💡 **Tip**: Bot activity represents 25.2% of total engagement. Always use human-only metrics for accurate analysis.

---

Generated by Customer.io Analytics Skill v1.0
```

---

## Appendix B: Complete File Structure

```
.claude/skills/cio-analytics/
├── SKILL.md                          # Main skill entry point
├── README.md                         # Skill documentation
├── USAGE.md                          # Detailed usage guide
├── TROUBLESHOOTING.md                # Common issues
├── ARCHITECTURE.md                   # Technical architecture
│
├── lib/
│   ├── mcp-checker.js               # MCP connection verification
│   ├── metrics-fetcher.js           # Data fetching from Customer.io
│   ├── calculator.js                # Metric calculations & pro-rating
│   ├── insights-generator.js        # Generate insights from data
│   ├── report-formatter.js          # Format reports (markdown/CSV)
│   ├── scheduler.js                 # Scheduling utilities
│   └── utils.js                     # Shared utilities
│
├── templates/
│   ├── setup-instructions.md        # MCP setup guide
│   ├── quick-report.md              # Quick report template
│   ├── standard-report.md           # Standard report template
│   ├── deliverability-report.md     # Deliverability-focused template
│   ├── engagement-report.md         # Engagement-focused template
│   └── campaign-report.md           # Single campaign template
│
├── config/
│   ├── metrics.json                 # Metric definitions
│   └── benchmarks.json              # Industry benchmarks
│
├── test/
│   ├── unit/
│   │   ├── calculator.test.js
│   │   ├── insights-generator.test.js
│   │   └── report-formatter.test.js
│   ├── integration/
│   │   └── e2e.test.js
│   └── fixtures/
│       ├── workspace-metrics.json
│       └── campaign-list.json
│
└── scripts/
    ├── scheduled-daily-report.sh    # Generated: daily report
    ├── scheduled-weekly-report.sh   # Generated: weekly report
    └── scheduled-monthly-report.sh  # Generated: monthly report
```

---

## Next Steps

1. **Review this design document**
2. **Approve or request changes**
3. **Proceed to Phase A: Implementation**

---

**Document Version**: 1.0
**Last Updated**: 2026-03-21
**Author**: Claude Code
**Status**: Ready for Review
