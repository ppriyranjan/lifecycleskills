---
name: cio-analytics
description: Generate Customer.io analytics report with deliverability, engagement, and campaign performance metrics. Use when the user asks about email performance, campaign results, open/click rates, deliverability issues, or wants to analyze Customer.io metrics.
---

You are generating a Customer.io analytics report for the user.

## Step 1: Check MCP Connection

First, verify that the Customer.io MCP is connected by attempting to list workspaces.

Use the `mcp__customerio__list_workspaces` tool with no parameters.

If it succeeds:
- You'll get a list of workspaces
- Continue to Step 2

If it fails:
- Read the file `.claude/skills/cio-analytics/templates/setup-instructions.md`
- Display the setup instructions to the user
- Stop here and wait for them to set up the MCP

## Step 2: Parse Arguments (Optional)

The user may have specified:
- **Period**: "7d" (default), "30d", or custom date range
- **Campaign filter**: Campaign name to analyze

From `$ARGUMENTS`, extract any period or campaign mentions.

Examples:
- "7d" or "last week" or "this week" → 7-day period
- "30d" or "last month" or "this month" → 30-day period
- "Welcome Email" → filter to that campaign
- No arguments → default to 7d

## Step 3: Determine Date Ranges

For now (Phase 1), we'll use simple date ranges:

**7-day period (default):**
- Current: Last 7 days (today - 7 days to yesterday)
- Previous: Previous 7 days (yesterday - 7 days to yesterday - 14 days)

**30-day period:**
- Current: Last 30 days (today - 30 days to yesterday)
- Previous: Previous 30 days (yesterday - 30 days to yesterday - 60 days)

Calculate the dates in YYYY-MM-DD format.

## Step 4: Fetch Workspace Metrics

For the workspace you identified in Step 1, fetch metrics for both periods.

Use the `mcp__customerio__metrics` tool:

```
Action: workspace
Parameters:
  workspace_id: [workspace ID from Step 1]
  workspace_params:
    time_range:
      start_date: [calculated start date]
      end_date: [calculated end date]
    summary_only: false
    data_types: ["campaign", "newsletter"]
    limit: 10
```

Call this twice:
1. Once for the current period
2. Once for the previous period

## Step 5: Display Raw Data (Phase 1)

For now, display the fetched data in a simple format:

```markdown
# Customer.io Analytics Report (Phase 1 - Raw Data)

**Workspace**: [Workspace Name]
**Period**: [Current period dates] vs [Previous period dates]
**Generated**: [Current date/time]

## Current Period ([dates])

### Workspace Summary
- Sent: [count]
- Delivered: [count]
- Bounced: [count]
- Opens (Human): [count]
- Clicks (Human): [count]
- Conversions: [count]

### Top Campaigns
1. [Campaign 1 name] - [sent] sent
2. [Campaign 2 name] - [sent] sent
...

## Previous Period ([dates])

### Workspace Summary
- Sent: [count]
- Delivered: [count]
- Bounced: [count]
- Opens (Human): [count]
- Clicks (Human): [count]
- Conversions: [count]

### Top Campaigns
1. [Campaign 1 name] - [sent] sent
2. [Campaign 2 name] - [sent] sent
...

---
Phase 1: Successfully fetched data. Period comparison and insights coming in later phases.
```

## Error Handling

If any step fails:
- Show a clear error message
- Explain what went wrong
- Suggest how to fix it
- Don't crash - handle gracefully

Common errors:
- MCP not connected → Show setup instructions
- Workspace not found → List available workspaces
- No data for period → Explain (e.g., no campaigns sent)
- Network error → Suggest retrying

## Notes for Phase 1

This is the basic version that:
✓ Checks MCP connection
✓ Fetches data for two periods
✓ Displays raw metrics

Later phases will add:
- Period-over-period calculations
- Professional report formatting
- Campaign breakdown with trends
- LLM-powered insights and recommendations

---

Execute the steps above to generate the analytics report.
