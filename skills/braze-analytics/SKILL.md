---
name: braze-analytics
description: Generate Braze analytics report with deliverability, engagement, and campaign performance metrics. Use when the user asks about email performance, campaign results, open/click rates, deliverability issues, or wants to analyze Braze metrics.
---

You are generating a comprehensive Braze analytics report for the user.

## Step 1: Check MCP Connection

Call `mcp__braze__list_functions` tool.

If it succeeds:
- Verify connection is active
- Continue to Step 2

If it fails:
- Read `.claude/skills/braze-analytics/templates/setup-instructions.md`
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

## Step 4: Fetch Campaign List

Call `mcp__braze__call_function`:

```javascript
{
  function_name: "get_campaign_list",
  parameters: {
    // Braze campaigns API may not support date filtering in list
    // We'll fetch all and filter locally
  }
}
```

**Extract campaign IDs** for use in data series queries.

## Step 5: Fetch Current Period Metrics

For each major campaign (up to 10), call `mcp__braze__call_function`:

```javascript
{
  function_name: "get_campaign_dataseries",
  parameters: {
    campaign_id: campaign.id,
    length: 7 or 30,  // Number of days
    ending_at: current_end,  // YYYY-MM-DD format
    include_variant_breakdown: false
  }
}
```

**Aggregate metrics across all campaigns:**
```javascript
current_data = {
  // From campaign data series:
  sends: sum(all campaign sends),
  direct_sends: sum(all campaign direct sends),
  total_opens: sum(all campaign total opens),
  unique_opens: sum(all campaign unique opens),
  unique_clicks: sum(all campaign unique clicks),
  total_clicks: sum(all campaign total clicks),
  unsubscribes: sum(all campaign unsubscribes),
  bounces: sum(all campaign bounces),
  delivered: sum(all campaign delivered),
  reported_spam: sum(all campaign reported spam),

  // Campaign data:
  campaigns: [] // Array of campaign details with metrics
}
```

## Step 6: Fetch Previous Period Metrics

Call `mcp__braze__call_function` again with previous period dates:

```javascript
{
  function_name: "get_campaign_dataseries",
  parameters: {
    campaign_id: campaign.id,
    length: 7 or 30,
    ending_at: previous_end,
    include_variant_breakdown: false
  }
}
```

Aggregate same metrics into `previous_data`.

## Step 7: Calculate All Metrics & Comparisons

For **current period**, calculate derived metrics:
```javascript
current_metrics = {
  // Raw counts
  ...current_data,

  // Deliverability rates
  delivery_rate: (current_data.delivered / current_data.sends) * 100,
  bounce_rate: (current_data.bounces / current_data.sends) * 100,
  spam_rate: (current_data.reported_spam / current_data.sends) * 100,

  // Engagement rates
  unique_open_rate: (current_data.unique_opens / current_data.delivered) * 100,
  unique_click_rate: (current_data.unique_clicks / current_data.delivered) * 100,
  click_to_open: (current_data.unique_clicks / current_data.unique_opens) * 100,
  unsubscribe_rate: (current_data.unsubscribes / current_data.delivered) * 100,

  // Total engagement (including machine opens)
  total_open_rate: (current_data.total_opens / current_data.delivered) * 100,
  total_click_rate: (current_data.total_clicks / current_data.delivered) * 100
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

For each campaign in `current_data.campaigns` (top 10 by sends):

Calculate campaign metrics:
```javascript
campaign = {
  name: campaign.name,
  sends: campaign.sends,
  delivery_rate: (campaign.delivered / campaign.sends) * 100,
  unique_open_rate: (campaign.unique_opens / campaign.delivered) * 100,
  unique_click_rate: (campaign.unique_clicks / campaign.delivered) * 100,
  unsubscribe_rate: (campaign.unsubscribes / campaign.delivered) * 100
}
```

Find matching campaign in previous period (if exists) and calculate trend.

## Step 9: Fetch Canvas Analytics (Optional)

If user mentions Canvases or you want complete insights, call:

```javascript
{
  function_name: "get_canvas_list",
  parameters: {}
}
```

Then for each Canvas:
```javascript
{
  function_name: "get_canvas_data_series",
  parameters: {
    canvas_id: canvas.id,
    length: 7 or 30,
    ending_at: current_end,
    include_variant_breakdown: false
  }
}
```

Include Canvas metrics in the report alongside campaigns.

## Step 10: Generate AI Insights

Use Claude (the LLM) to analyze all metrics and generate insights.

**Build the analysis prompt:**
```
You are analyzing Braze email campaign performance data.

**Period Analyzed:**
- Current: [current_start] to [current_end] ([X] days)
- Previous: [previous_start] to [previous_end] ([X] days)

**Deliverability Metrics:**
- Sends: [current_sends] (previous: [previous_sends], change: [+X%])
- Delivered: [current_delivered] ([delivery_rate]%) (previous: [previous_delivered] ([previous_delivery_rate]%), change: [+X pp])
- Bounced: [current_bounces] ([bounce_rate]%) (previous: [previous_bounces] ([previous_bounce_rate]%), change: [+X pp])
- Spam Reports: [current_spam] ([spam_rate]%) (previous: [previous_spam] ([previous_spam_rate]%), change: [+X pp])

**Engagement Metrics:**
- Unique Opens: [current_unique_opens] (previous: [previous_unique_opens], change: [+X%])
- Unique Open Rate: [unique_open_rate]% (previous: [previous_unique_open_rate]%, change: [+X pp])
- Unique Clicks: [current_unique_clicks] (previous: [previous_unique_clicks], change: [+X%])
- Unique Click Rate: [unique_click_rate]% (previous: [previous_unique_click_rate]%, change: [+X pp])
- Click-to-Open: [cto]% (previous: [previous_cto]%, change: [+X pp])
- Unsubscribes: [unsubscribes] (previous: [previous_unsubscribes], change: [+X%])
- Unsubscribe Rate: [unsub_rate]% (previous: [previous_unsub_rate]%, change: [+X pp])

**Total Engagement (Including Machine Activity):**
- Total opens: [total_opens] ([total_open_rate]%)
- Total clicks: [total_clicks] ([total_click_rate]%)

**Top Campaigns by Volume:**
[For each of top 10 campaigns:]
- [Campaign Name]: [sends] sends, [unique_open_rate]% unique open rate ([trend] [change] vs previous), [unique_click_rate]% unique click rate, [unsub_rate]% unsubscribe rate

Please analyze this data and provide:

1. **Executive Summary** (3-5 sentences): What are the most important takeaways from this period? Focus on significant changes and overall health.

2. **Key Insights** (3-5 bullet points): What specific trends, patterns, or notable changes do you observe? Consider:
   - Which metrics improved or declined significantly?
   - Are there any concerning patterns in deliverability?
   - How is engagement trending?
   - Which campaigns are performing exceptionally well or poorly?
   - Are spam reports or unsubscribes at acceptable levels?

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

## Step 11: Format Report

Build the final report using the template structure:

```markdown
# Braze Analytics Report

**Period**: Last [7 or 30] days vs Previous [7 or 30] days ([dates] vs [dates])
**Generated**: [current date/time]

---

## 📊 Executive Summary

[executive_summary from Step 10]

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
| **Sends** | [current_sends] | [previous_sends] | [↗/↘/→] [+X%] |
| **Delivered** | [current_delivered] ([delivery_rate]%) | [previous_delivered] ([previous_delivery_rate]%) | [↗/↘/→] [+X pp] |
| **Bounced** | [current_bounces] ([bounce_rate]%) | [previous_bounces] ([previous_bounce_rate]%) | [↗/↘/→] [+X pp] |
| **Spam Reports** | [current_spam] ([spam_rate]%) | [previous_spam] ([previous_spam_rate]%) | [↗/↘/→] [+X pp] |

**Period-over-Period**: Delivery rate [increased/decreased/remained] from [X]% to [X]%

---

## 💌 Engagement Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Unique Opens** | [current_unique_opens] | [previous_unique_opens] | [↗/↘/→] [+X%] |
| **Unique Open Rate** | [unique_open_rate]% | [previous_unique_open_rate]% | [↗/↘/→] [+X pp] |
| **Unique Clicks** | [current_unique_clicks] | [previous_unique_clicks] | [↗/↘/→] [+X%] |
| **Unique Click Rate** | [unique_click_rate]% | [previous_unique_click_rate]% | [↗/↘/→] [+X pp] |
| **Click-to-Open** | [cto]% | [previous_cto]% | [↗/↘/→] [+X pp] |
| **Unsubscribes** | [unsubscribes] | [previous_unsubscribes] | [↗/↘/→] [+X%] |
| **Unsubscribe Rate** | [unsub_rate]% | [previous_unsub_rate]% | [↗/↘/→] [+X pp] |

**Total Engagement**: [total_opens] total opens ([total_open_rate]%), [total_clicks] total clicks ([total_click_rate]%)

---

## 🎯 Campaign Performance

Top [N] campaigns by volume:

| Campaign | Sends | Unique Open Rate | Unique Click Rate | Unsub Rate | Trend |
|----------|-------|------------------|-------------------|------------|-------|
| [Campaign 1] | [sends] | [unique_open_rate]% | [unique_click_rate]% | [unsub_rate]% | [↗/↘/→] [+X%] |
| [Campaign 2] | [sends] | [unique_open_rate]% | [unique_click_rate]% | [unsub_rate]% | [↗/↘/→] [+X%] |
...

### Campaign Spotlight
[campaign_spotlight from Step 10]

---

## 📝 Notes

- Unique metrics represent individual user interactions (machine activity filtered when possible)
- Total metrics include all activity (human + machine)
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat (±0.5% threshold)

---

**Analytics powered by Braze MCP**
**Report generated via Claude Code**
```

## Step 12: Display Report

Output the formatted markdown report to the user.

## Error Handling

**No data for period:**
```
If current_sends === 0 and previous_sends === 0:
  Show: "No campaigns were sent during these periods.
         Try a different date range or verify campaigns exist."
  Stop execution
```

**MCP errors:**
- Network timeout → "Unable to fetch data. Please try again."
- Invalid API key → "Braze MCP not properly configured. Check API key permissions."
- Rate limit → "Too many requests. Please wait a moment."

**Division by zero:**
- All rate calculations must check for zero denominator
- If denominator = 0, set rate = 0 (not error)

**Campaign matching:**
- If campaign exists in current but not previous → Show as "New"
- If campaign in both → Calculate trend
- Sort campaigns by sends (descending)

---

Execute steps 1-12 to generate the complete analytics report.
