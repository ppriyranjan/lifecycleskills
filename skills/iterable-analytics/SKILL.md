---
name: iterable-analytics
description: Generate Iterable analytics report with deliverability, engagement, and campaign performance metrics. Use when the user asks about email performance, campaign results, open/click rates, deliverability issues, or wants to analyze Iterable metrics.
---

You are generating a comprehensive Iterable analytics report for the user.

## Step 1: Check MCP Connection

Call the Iterable MCP tool to verify connection. Try to call `iterable_get_campaigns` with a small limit (e.g., 1 campaign).

If it succeeds:
- MCP is connected
- Continue to Step 2

If it fails:
- Read `.claude/skills/iterable-analytics/templates/setup-instructions.md`
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

Example (if today is 2026-03-22):
- 7d current: 2026-03-15 to 2026-03-21
- 7d previous: 2026-03-08 to 2026-03-14

## Step 4: Fetch Campaign List

Call `iterable_get_campaigns` to get all campaigns that were active during the current and previous periods.

Parameters may include:
- Filtering by date range if supported
- Pagination (fetch all pages if needed)

Extract campaign IDs and names for further analysis.

## Step 5: Fetch Current Period Metrics

For each campaign retrieved, call `iterable_get_campaign_metrics` with the current period date range.

**Note**: The exact parameters depend on the Iterable API. Based on standard analytics APIs, expect parameters like:
- `campaign_id` or similar identifier
- `start_date`: current_start (YYYY-MM-DD)
- `end_date`: current_end (YYYY-MM-DD)

**Aggregate metrics across all campaigns:**
```javascript
current_data = {
  // Deliverability metrics
  sent: 0,
  delivered: 0,
  bounced: 0,

  // Engagement metrics
  opened: 0,        // Total opens (may include bot activity)
  unique_opens: 0,  // Unique opens
  clicked: 0,       // Total clicks
  unique_clicks: 0, // Unique clicks
  conversions: 0,   // Conversions (if available)
  unsubscribed: 0,  // Unsubscribes

  // Campaign data for top performers
  campaigns: []
}
```

For each campaign, store:
```javascript
campaign = {
  id: campaign.id,
  name: campaign.name,
  sent: metrics.sent || 0,
  delivered: metrics.delivered || 0,
  bounced: metrics.bounced || 0,
  opened: metrics.opened || metrics.unique_opens || 0,
  clicked: metrics.clicked || metrics.unique_clicks || 0,
  conversions: metrics.conversions || 0
}
```

## Step 6: Fetch Previous Period Metrics

Repeat Step 5 for the previous period date range (previous_start to previous_end).

Store results in `previous_data` with the same structure.

## Step 7: Calculate All Metrics & Comparisons

For **current period**, calculate derived metrics:
```javascript
current_metrics = {
  // Raw counts
  ...current_data,

  // Deliverability rates
  delivery_rate: (current_data.delivered / current_data.sent) * 100,
  bounce_rate: (current_data.bounced / current_data.sent) * 100,

  // Engagement rates
  open_rate: (current_data.unique_opens / current_data.delivered) * 100,
  click_rate: (current_data.unique_clicks / current_data.delivered) * 100,
  click_to_open: (current_data.unique_clicks / current_data.unique_opens) * 100,
  conversion_rate: (current_data.conversions / current_data.delivered) * 100
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

## Step 8: Process Campaign Data

For each campaign in `current_data.campaigns`, calculate:

```javascript
campaign = {
  name: campaign.name,
  sent: campaign.sent,
  delivery_rate: (campaign.delivered / campaign.sent) * 100,
  open_rate: (campaign.opened / campaign.delivered) * 100,
  click_rate: (campaign.clicked / campaign.delivered) * 100,
  conversion_rate: (campaign.conversions / campaign.delivered) * 100
}
```

Sort campaigns by `sent` (descending) and take top 10.

Find matching campaign in previous period (if exists) and calculate trend.

## Step 9: Generate AI Insights

Use Claude (the LLM) to analyze all metrics and generate insights.

**Build the analysis prompt:**
```
You are analyzing Iterable email campaign performance data.

**Period Analyzed:**
- Current: [current_start] to [current_end] ([X] days)
- Previous: [previous_start] to [previous_end] ([X] days)

**Deliverability Metrics:**
- Sent: [current_sent] (previous: [previous_sent], change: [+X%])
- Delivered: [current_delivered] ([delivery_rate]%) (previous: [previous_delivered] ([previous_delivery_rate]%), change: [+X pp])
- Bounced: [current_bounced] ([bounce_rate]%) (previous: [previous_bounced] ([previous_bounce_rate]%), change: [+X pp])

**Engagement Metrics:**
- Opens: [current_opens] (previous: [previous_opens], change: [+X%])
- Open Rate: [open_rate]% (previous: [previous_open_rate]%, change: [+X pp])
- Clicks: [current_clicks] (previous: [previous_clicks], change: [+X%])
- Click Rate: [click_rate]% (previous: [previous_click_rate]%, change: [+X pp])
- Click-to-Open: [cto]% (previous: [previous_cto]%, change: [+X pp])
- Conversions: [conversions] (previous: [previous_conversions], change: [+X%])
- Conversion Rate: [conv_rate]% (previous: [previous_conv_rate]%, change: [+X pp])

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

## Step 10: Format Report

Build the final report using the template structure:

```markdown
# Iterable Analytics Report

**Period**: Last [7 or 30] days vs Previous [7 or 30] days ([dates] vs [dates])
**Generated**: [current date/time]

---

## 📊 Executive Summary

[executive_summary from Step 9]

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

**Period-over-Period**: Delivery rate [increased/decreased/remained] from [X]% to [X]%

---

## 💌 Engagement Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Opens** | [current_opens] | [previous_opens] | [↗/↘/→] [+X%] |
| **Open Rate** | [open_rate]% | [previous_open_rate]% | [↗/↘/→] [+X pp] |
| **Clicks** | [current_clicks] | [previous_clicks] | [↗/↘/→] [+X%] |
| **Click Rate** | [click_rate]% | [previous_click_rate]% | [↗/↘/→] [+X pp] |
| **Click-to-Open** | [cto]% | [previous_cto]% | [↗/↘/→] [+X pp] |
| **Conversions** | [conversions] | [previous_conversions] | [↗/↘/→] [+X%] |
| **Conversion Rate** | [conv_rate]% | [previous_conv_rate]% | [↗/↘/→] [+X pp] |

---

## 🎯 Campaign Performance

Top [N] campaigns by volume:

| Campaign | Sent | Open Rate | Click Rate | Conv Rate | Trend |
|----------|------|-----------|------------|-----------|-------|
| [Campaign 1] | [sent] | [open_rate]% | [click_rate]% | [conv_rate]% | [↗/↘/→] [+X%] |
| [Campaign 2] | [sent] | [open_rate]% | [click_rate]% | [conv_rate]% | [↗/↘/→] [+X%] |
...

### Campaign Spotlight
[campaign_spotlight from Step 9]

---

## 📝 Notes

- Engagement metrics may include both human and bot activity (Iterable's API behavior)
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat (±0.5% threshold)

---

**Based on Iterable MCP Server** (Beta)
**Data Source**: Iterable API via MCP
```

## Step 11: Display Report

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
- Connection failure → Display setup instructions from templates/setup-instructions.md
- Network timeout → "Unable to fetch data. Please try again."
- API rate limit (429) → "API rate limit reached. Please wait a moment and try again."

**Division by zero:**
- All rate calculations must check for zero denominator
- If denominator = 0, set rate = 0 (not error)

**Campaign matching:**
- If campaign exists in current but not previous → Show as "New"
- If campaign in both → Calculate trend
- Sort campaigns by sent (descending)

---

Execute steps 1-11 to generate the complete analytics report.
