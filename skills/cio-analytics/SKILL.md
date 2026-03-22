---
name: cio-analytics
description: Generate Customer.io analytics report with deliverability, engagement, and campaign performance metrics. Use when the user asks about email performance, campaign results, open/click rates, deliverability issues, or wants to analyze Customer.io metrics.
---

You are generating a comprehensive Customer.io analytics report for the user.

## Step 1: Check MCP Connection

Call `mcp__customerio__list_workspaces` tool.

If it succeeds:
- Extract the first workspace: `workspace = response[0]`
- Store `workspace.id` and `workspace.name`
- Continue to Step 2

If it fails:
- Read `.claude/skills/cio-analytics/templates/setup-instructions.md`
- Display setup instructions
- Stop execution

## Step 2: Parse Arguments & Determine Period

From the user's request or `$ARGUMENTS`, determine the period:

**Default: "7d"** (last 7 days vs previous 7 days)

Look for indicators:
- "7d", "7 days", "week", "last week", "this week" → **7d**
- "30d", "30 days", "month", "last month", "this month" → **30d**
- Date ranges like "March 1 to 15" → **custom** (extract dates)

Store: `period = "7d"` (or "30d", or "custom")

## Step 3: Calculate Date Ranges

Use today's date to calculate periods:

**For 7d period:**
```
today = new Date()
yesterday = new Date(today - 1 day)

current_end = yesterday
current_start = yesterday - 6 days
previous_end = current_start - 1 day
previous_start = previous_end - 6 days
```

**For 30d period:**
```
current_end = yesterday
current_start = yesterday - 29 days
previous_end = current_start - 1 day
previous_start = previous_end - 29 days
```

Format all dates as **YYYY-MM-DD**.

Example (if today is 2026-03-21):
- 7d current: 2026-03-14 to 2026-03-20
- 7d previous: 2026-03-07 to 2026-03-13

## Step 4: Fetch Current Period Metrics

Call `mcp__customerio__metrics`:

```javascript
{
  action: "workspace",
  workspace_id: workspace.id,
  workspace_params: {
    time_range: {
      start_date: current_start,  // e.g., "2026-03-14"
      end_date: current_end        // e.g., "2026-03-20"
    },
    summary_only: false,  // Get campaign data too
    data_types: ["campaign", "newsletter"],
    limit: 10,           // Top 10 campaigns
    sort_by: "sent",
    sort_order: "desc"
  }
}
```

**Extract from response:**
```javascript
current_data = {
  // From workspace_summary:
  sent: response.workspace_summary.sent || 0,
  delivered: response.workspace_summary.delivered || 0,
  bounced: response.workspace_summary.bounced || 0,
  failed: response.workspace_summary.failed || 0,
  human_opened: response.workspace_summary.human_opened || 0,
  human_clicked: response.workspace_summary.human_clicked || 0,
  converted: response.workspace_summary.converted || 0,
  unsubscribed: response.workspace_summary.unsubscribed || 0,
  machine_opened: response.workspace_summary.machine_opened || response.workspace_summary.prefetch_opened || 0,
  machine_clicked: response.workspace_summary.machine_clicked || 0,

  // Campaign data:
  campaigns: response.campaigns || []
}
```

## Step 5: Fetch Previous Period Metrics

Call `mcp__customerio__metrics` again with previous period dates:

```javascript
{
  action: "workspace",
  workspace_id: workspace.id,
  workspace_params: {
    time_range: {
      start_date: previous_start,
      end_date: previous_end
    },
    summary_only: true,  // Don't need campaigns twice
    data_types: ["campaign", "newsletter"]
  }
}
```

Extract same workspace_summary metrics into `previous_data`.

## Step 6: Calculate All Metrics & Comparisons

For **current period**, calculate derived metrics:
```javascript
current_metrics = {
  // Raw counts
  ...current_data,

  // Deliverability rates
  delivery_rate: (current_data.delivered / current_data.sent) * 100,
  bounce_rate: (current_data.bounced / current_data.sent) * 100,
  failure_rate: (current_data.failed / current_data.sent) * 100,

  // Engagement rates (human only)
  open_rate: (current_data.human_opened / current_data.delivered) * 100,
  click_rate: (current_data.human_clicked / current_data.delivered) * 100,
  click_to_open: (current_data.human_clicked / current_data.human_opened) * 100,
  conversion_rate: (current_data.converted / current_data.delivered) * 100,

  // Bot percentages
  bot_open_pct: (current_data.machine_opened / (current_data.human_opened + current_data.machine_opened)) * 100,
  bot_click_pct: (current_data.machine_clicked / (current_data.human_clicked + current_data.machine_clicked)) * 100
}
```

**Handle division by zero**: If denominator is 0, set rate to 0.

Do the same for `previous_metrics`.

For each metric, calculate **changes**:
```javascript
change = {
  absolute: current - previous,
  percentage: ((current - previous) / previous) * 100,
  trend: percentage > 0.5 ? "up" : percentage < -0.5 ? "down" : "flat",
  indicator: trend === "up" ? "↗" : trend === "down" ? "↘" : "→"
}
```

**Special case**: If previous = 0 and current > 0, mark as "New" instead of Infinity.

## Step 7: Process Campaign Data

For each campaign in `current_data.campaigns` (top 10):

Calculate campaign metrics:
```javascript
campaign = {
  name: campaign.name,
  sent: campaign.sent,
  delivery_rate: (campaign.delivered / campaign.sent) * 100,
  open_rate: (campaign.human_opened / campaign.delivered) * 100,
  click_rate: (campaign.human_clicked / campaign.delivered) * 100,
  conversion_rate: (campaign.converted / campaign.delivered) * 100
}
```

Find matching campaign in previous period (if exists) and calculate trend.

## Step 8: Generate AI Insights

Use Claude (the LLM) to analyze all metrics and generate insights.

**Build the analysis prompt:**
```
You are analyzing Customer.io email campaign performance data for [workspace.name].

**Period Analyzed:**
- Current: [current_start] to [current_end] ([X] days)
- Previous: [previous_start] to [previous_end] ([X] days)

**Deliverability Metrics:**
- Sent: [current_sent] (previous: [previous_sent], change: [+X%])
- Delivered: [current_delivered] ([delivery_rate]%) (previous: [previous_delivered] ([previous_delivery_rate]%), change: [+X pp])
- Bounced: [current_bounced] ([bounce_rate]%) (previous: [previous_bounced] ([previous_bounce_rate]%), change: [+X pp])
- Failed: [current_failed] ([failure_rate]%) (previous: [previous_failed] ([previous_failure_rate]%), change: [+X pp])

**Engagement Metrics (Human Only):**
- Opens: [current_opens] (previous: [previous_opens], change: [+X%])
- Open Rate: [open_rate]% (previous: [previous_open_rate]%, change: [+X pp])
- Clicks: [current_clicks] (previous: [previous_clicks], change: [+X%])
- Click Rate: [click_rate]% (previous: [previous_click_rate]%, change: [+X pp])
- Click-to-Open: [cto]% (previous: [previous_cto]%, change: [+X pp])
- Conversions: [conversions] (previous: [previous_conversions], change: [+X%])
- Conversion Rate: [conv_rate]% (previous: [previous_conv_rate]%, change: [+X pp])

**Bot Activity:**
- Machine opens: [machine_opens] ([bot_pct]% of total opens)
- Machine clicks: [machine_clicks] ([bot_click_pct]% of total clicks)

**Top Campaigns by Volume:**
[For each of top 10 campaigns:]
- [Campaign Name]: [sent] sent, [open_rate]% open rate ([trend] [change] vs previous), [click_rate]% click rate, [conv_rate]% conversion rate

Please analyze this data and provide:

1. **Executive Summary** (3-5 sentences): What are the most important takeaways from this period? Focus on significant changes and overall health.

2. **Key Insights** (3-5 bullet points): What specific trends, patterns, or notable changes do you observe? Consider:
   - Which metrics improved or declined significantly?
   - Are there any concerning patterns in deliverability?
   - How is engagement trending?
   - Which campaigns are performing exceptionally well or poorly?
   - Is bot activity at expected levels (20-30% opens, ~10% clicks)?

3. **Actionable Recommendations** (3 specific actions): Based on this data, what should be done? Provide concrete, prioritized recommendations. Examples:
   - "Investigate bounce rate increase - review list hygiene"
   - "Replicate [Campaign X]'s strategy in other campaigns"
   - "Test different send times to improve open rates"

4. **Campaign Spotlight**: Highlight 1-2 campaigns that deserve attention (either excellent performance to replicate, or poor performance to fix).

Keep the analysis concise, data-driven, and actionable. Focus on insights that can drive decisions, not just restating the numbers.
```

**Execute the prompt:**
- Pass the filled prompt to Claude
- Extract the 4 sections from Claude's response:
  - `executive_summary` (text)
  - `key_insights` (array of bullet points)
  - `recommendations` (array of 3 actions)
  - `campaign_spotlight` (text)

Store these for inclusion in the report.

## Step 9: Format Report

Build the final report using the template structure:

```markdown
# Customer.io Analytics Report

**Period**: Last [7 or 30] days vs Previous [7 or 30] days ([dates] vs [dates])
**Workspace**: [workspace.name] (ID: [workspace.id])
**Generated**: [current date/time]

---

## 📊 Executive Summary

[executive_summary from Step 8]

### Key Insights
[For each insight in key_insights:]
- [insight text]

### Recommended Actions
[For each recommendation in recommendations:]
1. [recommendation text]

---

## 📈 Deliverability Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Sent** | [current_sent] | [previous_sent] | [↗/↘/→] [+X%] |
| **Delivered** | [current_delivered] ([delivery_rate]%) | [previous_delivered] ([previous_delivery_rate]%) | [↗/↘/→] [+X pp] |
| **Bounced** | [current_bounced] ([bounce_rate]%) | [previous_bounced] ([previous_bounce_rate]%) | [↗/↘/→] [+X pp] |
| **Failed** | [current_failed] ([failure_rate]%) | [previous_failed] ([previous_failure_rate]%) | [↗/↘/→] [+X pp] |

**Period-over-Period**: Delivery rate [increased/decreased/remained] from [X]% to [X]%

---

## 💌 Engagement Metrics (Human Activity)

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Opens** | [current_opens] | [previous_opens] | [↗/↘/→] [+X%] |
| **Open Rate** | [open_rate]% | [previous_open_rate]% | [↗/↘/→] [+X pp] |
| **Clicks** | [current_clicks] | [previous_clicks] | [↗/↘/→] [+X%] |
| **Click Rate** | [click_rate]% | [previous_click_rate]% | [↗/↘/→] [+X pp] |
| **Click-to-Open** | [cto]% | [previous_cto]% | [↗/↘/→] [+X pp] |
| **Conversions** | [conversions] | [previous_conversions] | [↗/↘/→] [+X%] |
| **Conversion Rate** | [conv_rate]% | [previous_conv_rate]% | [↗/↘/→] [+X pp] |

**Bot Activity**: [machine_opens] machine opens ([bot_pct]% of total), [machine_clicks] machine clicks ([bot_click_pct]% of total)

---

## 🎯 Campaign Performance

Top [N] campaigns by volume:

| Campaign | Sent | Open Rate | Click Rate | Conv Rate | Trend |
|----------|------|-----------|------------|-----------|-------|
| [Campaign 1] | [sent] | [open_rate]% | [click_rate]% | [conv_rate]% | [↗/↘/→] [+X%] |
| [Campaign 2] | [sent] | [open_rate]% | [click_rate]% | [conv_rate]% | [↗/↘/→] [+X%] |
...

### Campaign Spotlight
[campaign_spotlight from Step 8]

---

## 📝 Notes

- All engagement metrics use human-only activity (bot opens/clicks excluded)
- Bot activity represents [X]% of opens and [X]% of clicks
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat (±0.5% threshold)

---

**Phase 4 Complete**: Full report with AI-powered insights and recommendations
**Next**: Phase 5 will add final testing and production polish
```

## Step 10: Display Report

Output the formatted markdown report to the user.

## Error Handling

**No data for period:**
```
If current_sent === 0 and previous_sent === 0:
  Show: "No campaigns were sent during these periods.
         Try a different date range or verify campaigns exist."
  Stop execution
```

**MCP errors:**
- Network timeout → "Unable to fetch data. Please try again."
- Invalid workspace → "Workspace not accessible. Check permissions."
- Rate limit → "Too many requests. Please wait a moment."

**Division by zero:**
- All rate calculations must check for zero denominator
- If denominator = 0, set rate = 0 (not error)

**Campaign matching:**
- If campaign exists in current but not previous → Show as "New"
- If campaign in both → Calculate trend
- Sort campaigns by sent (descending)

---

Execute steps 1-10 to generate the complete analytics report.
