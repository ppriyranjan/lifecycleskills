# Customer.io Analytics Skill

**Version**: 1.0 (Phase 4 - LLM Insights Complete)
**Status**: 80% Complete (4 of 5 phases)

---

## What This Skill Does

Generates comprehensive Customer.io analytics reports with:
- Deliverability metrics (sent, delivered, bounced)
- Engagement metrics (opens, clicks, conversions)
- Campaign performance breakdown
- Period-over-period comparisons
- AI-powered insights and recommendations (coming in Phase 4)

## How It Works

### Automatic Invocation

Claude automatically invokes this skill when you ask about:
- Email performance ("How are our emails doing?")
- Campaign results ("Show me campaign metrics")
- Deliverability ("Any deliverability issues?")
- Open/click rates ("What's our open rate?")

### Manual Invocation

You can also run it directly:
```
/cio-analytics
/cio-analytics 30d
/cio-analytics Welcome Email
```

## Prerequisites

- Customer.io MCP must be connected
- Account admin access to enable MCP in Customer.io
- At least one workspace with campaign data

## Installation

This skill is located at:
```
.claude/skills/cio-analytics/
```

No additional installation needed - Claude will detect it automatically.

## Usage

### Default (Last 7 Days)
```
/cio-analytics
```

### Last 30 Days
```
/cio-analytics 30d
```

### Specific Campaign
```
/cio-analytics Welcome Email
```

## File Structure

```
.claude/skills/cio-analytics/
├── SKILL.md                      # Main skill logic
├── README.md                     # This file
├── lib/
│   ├── mcp-checker.js           # MCP connection verification
│   ├── metrics-fetcher.js       # Data fetching utilities
│   └── calculator.js            # Coming in Phase 2
├── templates/
│   ├── setup-instructions.md    # MCP setup guide
│   └── report-template.md       # Coming in Phase 3
```

## Development Phases

### ✅ Phase 1: Core Functionality (Complete)
- MCP connection check
- Basic data fetching
- Foundation structure

### ✅ Phase 2: Period Comparison (Complete)
- Period-over-period calculations
- Pro-rating for partial periods
- Derived metrics (rates)
- All calculation functions

### ✅ Phase 3: Report Formatting (Complete)
- Professional report template
- Campaign breakdown tables
- Trend indicators

### ✅ Phase 4: LLM Insights (Complete)
- AI-generated insights
- Trend analysis
- Actionable recommendations
- Executive summary
- Campaign spotlight

### ⏳ Phase 5: Polish & Testing
- Error handling
- Edge case testing
- Documentation
- Production-ready

## Metrics Tracked

### Deliverability
- Sent, Delivered, Bounced, Failed
- Delivery Rate, Bounce Rate

### Engagement (Human Only)
- Opens, Clicks, Conversions, Unsubscribes
- Open Rate, Click Rate, Click-to-Open Rate, Conversion Rate
- Bot activity (shown for context)

### Campaign Performance
- Top 10 campaigns by volume
- All metrics per campaign
- Trend indicators (coming in Phase 3)

## Troubleshooting

### "MCP not connected"
Follow the setup instructions displayed, or see:
`templates/setup-instructions.md`

### "No data for period"
- Check that campaigns were sent during this period
- Verify workspace has active campaigns
- Try a different date range

### "Workspace not found"
- Verify you have access to the workspace
- Check that MCP is properly authenticated

## Support

- Customer.io MCP Docs: https://docs.customer.io/ai/mcp-server/
- Skill Documentation: See `/reporting-customerio/` folder
- Design Doc: `DESIGN_DOCUMENT_V2.md`

---

**Current Phase**: 4 of 5 (LLM Insights Complete)
**Last Updated**: 2026-03-21
