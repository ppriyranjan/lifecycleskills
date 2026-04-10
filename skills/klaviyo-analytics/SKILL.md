---
name: klaviyo-analytics
description: Generate Klaviyo analytics report with deliverability, engagement, campaign and flow performance metrics. Use when the user asks about email performance, campaign results, open/click rates, deliverability issues, or wants to analyze Klaviyo metrics.
---

You are generating a comprehensive Klaviyo analytics report for the user.

## Step 1: Check MCP Connection

Call `mcp__klaviyo__get_account_details` tool.

If it succeeds:
- Extract the account name from the response
- Store `account.name` (and any ID returned)
- Continue to Step 2

If it fails:
- Read `.claude/skills/klaviyo-analytics/templates/setup-instructions.md`
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

Call `mcp__klaviyo__get_campaigns`:

```javascript
{
  // Fetch campaigns — the MCP tool returns a list of campaigns
  // Filter locally by date range if needed
}
```

**Extract campaign list** and filter to campaigns that were sent during the current period.
Store matching campaign IDs for reporting queries.

## Step 5: Fetch Current Period Campaign Metrics

For each campaign sent during the current period (up to 10 by volume), call `mcp__klaviyo__get_campaign_report`:

```javascript
{
  campaign_id: campaign.id
  // The report returns aggregated metrics for the campaign
}
```

**Aggregate metrics across all campaigns:**
```javascript
current_data = {
  // From campaign reports:
  recipients: sum(all campaign recipients),
  delivered: sum(all campaign delivered),
  bounced: sum(all campaign bounced),
  opened: sum(all campaign opened),        // unique opens
  clicked: sum(all campaign clicked),      // unique clicks
  converted: sum(all campaign converted),
  unsubscribed: sum(all campaign unsubscribed),
  spam_complaints: sum(all campaign spam_complaints),
  revenue: sum(all campaign revenue),

  // Campaign data:
  campaigns: [] // Array of campaign details with metrics
}
```

If `get_campaign_report` does not support date-range filtering, use the full campaign report and filter/sum metrics locally.

## Step 6: Fetch Previous Period Campaign Metrics

Repeat the same process for campaigns sent during the previous period:
- Filter campaign list to those sent in the previous period
- Call `mcp__klaviyo__get_campaign_report` for each
- Aggregate into `previous_data`

## Step 7: Fetch Flow Analytics (Optional but Recommended)

Call `mcp__klaviyo__get_flows` to list all active flows.

For each active flow, call `mcp__klaviyo__get_flow_report`:

```javascript
{
  flow_id: flow.id
  // Returns aggregated flow metrics
}
```

**Aggregate flow metrics:**
```javascript
flow_data = {
  total_flows: count,
  recipients: sum(all flow recipients),
  delivered: sum(all flow delivered),
  opened: sum(all flow opened),
  clicked: sum(all flow clicked),
  converted: sum(all flow converted),
  unsubscribed: sum(all flow unsubscribed),
  revenue: sum(all flow revenue),

  // Per-flow data:
  flows: [] // Array of flow details with metrics
}
```

Include flow metrics in the report alongside campaigns.

## Step 8: Calculate All Metrics & Comparisons

For **current period**, calculate derived metrics:
```javascript
current_metrics = {
  // Raw counts
  ...current_data,

  // Deliverability rates
  delivery_rate: (current_data.delivered / current_data.recipients) * 100,
  bounce_rate: (current_data.bounced / current_data.recipients) * 100,
  spam_rate: (current_data.spam_complaints / current_data.recipients) * 100,

  // Engagement rates (unique)
  open_rate: (current_data.opened / current_data.delivered) * 100,
  click_rate: (current_data.clicked / current_data.delivered) * 100,
  click_to_open: (current_data.clicked / current_data.opened) * 100,
  conversion_rate: (current_data.converted / current_data.delivered) * 100,
  unsubscribe_rate: (current_data.unsubscribed / current_data.delivered) * 100,

  // Revenue (if available)
  revenue_per_recipient: current_data.revenue / current_data.recipients
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

## Step 9: Process Campaign Data

For each campaign in `current_data.campaigns` (top 10 by recipients):

Calculate campaign metrics:
```javascript
campaign = {
  name: campaign.name,
  recipients: campaign.recipients,
  delivery_rate: (campaign.delivered / campaign.recipients) * 100,
  open_rate: (campaign.opened / campaign.delivered) * 100,
  click_rate: (campaign.clicked / campaign.delivered) * 100,
  conversion_rate: (campaign.converted / campaign.delivered) * 100,
  revenue: campaign.revenue
}
```

Find matching campaign in previous period (if exists) and calculate trend.

## Step 10: Generate AI Insights

Use Claude (the LLM) to analyze all metrics and generate insights.

**Build the analysis prompt:**
```
You are analyzing Klaviyo email campaign and flow performance data for [account.name].

**Period Analyzed:**
- Current: [current_start] to [current_end] ([X] days)
- Previous: [previous_start] to [previous_end] ([X] days)

**Deliverability Metrics:**
- Recipients: [current_recipients] (previous: [previous_recipients], change: [+X%])
- Delivered: [current_delivered] ([delivery_rate]%) (previous: [previous_delivered] ([previous_delivery_rate]%), change: [+X pp])
- Bounced: [current_bounced] ([bounce_rate]%) (previous: [previous_bounced] ([previous_bounce_rate]%), change: [+X pp])
- Spam Complaints: [current_spam] ([spam_rate]%) (previous: [previous_spam] ([previous_spam_rate]%), change: [+X pp])

**Engagement Metrics (Unique):**
- Opens: [current_opens] (previous: [previous_opens], change: [+X%])
- Open Rate: [open_rate]% (previous: [previous_open_rate]%, change: [+X pp])
- Clicks: [current_clicks] (previous: [previous_clicks], change: [+X%])
- Click Rate: [click_rate]% (previous: [previous_click_rate]%, change: [+X pp])
- Click-to-Open: [cto]% (previous: [previous_cto]%, change: [+X pp])
- Conversions: [conversions] (previous: [previous_conversions], change: [+X%])
- Conversion Rate: [conv_rate]% (previous: [previous_conv_rate]%, change: [+X pp])
- Unsubscribes: [unsubscribes] (previous: [previous_unsubscribes], change: [+X%])
- Unsubscribe Rate: [unsub_rate]% (previous: [previous_unsub_rate]%, change: [+X pp])

**Revenue (if available):**
- Total Revenue: $[revenue] (previous: $[previous_revenue], change: [+X%])
- Revenue per Recipient: $[rpr] (previous: $[previous_rpr], change: [+X%])

**Flow Performance:**
- Active Flows: [count]
- Flow Recipients: [flow_recipients]
- Flow Opens: [flow_opens] ([flow_open_rate]%)
- Flow Clicks: [flow_clicks] ([flow_click_rate]%)
- Flow Revenue: $[flow_revenue]

**Top Campaigns by Volume:**
[For each of top 10 campaigns:]
- [Campaign Name]: [recipients] recipients, [open_rate]% open rate ([trend] [change] vs previous), [click_rate]% click rate, [conv_rate]% conversion rate, $[revenue] revenue

Please analyze this data and provide:

1. **Executive Summary** (3-5 sentences): What are the most important takeaways from this period? Focus on significant changes and overall health.

2. **Key Insights** (3-5 bullet points): What specific trends, patterns, or notable changes do you observe? Consider:
   - Which metrics improved or declined significantly?
   - Are there any concerning patterns in deliverability?
   - How is engagement trending?
   - Which campaigns are performing exceptionally well or poorly?
   - Are spam complaints at acceptable levels (< 0.1%)?
   - How are flows contributing relative to campaigns?

3. **Actionable Recommendations** (3 specific actions): Based on this data, what should be done? Provide concrete, prioritized recommendations. Examples:
   - "Investigate bounce rate increase - review list hygiene"
   - "Replicate [Campaign X]'s strategy in other campaigns"
   - "Optimize underperforming flows to improve conversion"

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
# Klaviyo Analytics Report

**Period**: Last [7 or 30] days vs Previous [7 or 30] days ([dates] vs [dates])
**Account**: [account.name]
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
| **Recipients** | [current_recipients] | [previous_recipients] | [↗/↘/→] [+X%] |
| **Delivered** | [current_delivered] ([delivery_rate]%) | [previous_delivered] ([previous_delivery_rate]%) | [↗/↘/→] [+X pp] |
| **Bounced** | [current_bounced] ([bounce_rate]%) | [previous_bounced] ([previous_bounce_rate]%) | [↗/↘/→] [+X pp] |
| **Spam Complaints** | [current_spam] ([spam_rate]%) | [previous_spam] ([previous_spam_rate]%) | [↗/↘/→] [+X pp] |

**Period-over-Period**: Delivery rate [increased/decreased/remained] from [X]% to [X]%

---

## 💌 Engagement Metrics (Unique Activity)

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Opens** | [current_opens] | [previous_opens] | [↗/↘/→] [+X%] |
| **Open Rate** | [open_rate]% | [previous_open_rate]% | [↗/↘/→] [+X pp] |
| **Clicks** | [current_clicks] | [previous_clicks] | [↗/↘/→] [+X%] |
| **Click Rate** | [click_rate]% | [previous_click_rate]% | [↗/↘/→] [+X pp] |
| **Click-to-Open** | [cto]% | [previous_cto]% | [↗/↘/→] [+X pp] |
| **Conversions** | [conversions] | [previous_conversions] | [↗/↘/→] [+X%] |
| **Conversion Rate** | [conv_rate]% | [previous_conv_rate]% | [↗/↘/→] [+X pp] |
| **Unsubscribes** | [unsubscribes] | [previous_unsubscribes] | [↗/↘/→] [+X%] |
| **Unsubscribe Rate** | [unsub_rate]% | [previous_unsub_rate]% | [↗/↘/→] [+X pp] |

---

## 💰 Revenue Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Total Revenue** | $[revenue] | $[previous_revenue] | [↗/↘/→] [+X%] |
| **Revenue per Recipient** | $[rpr] | $[previous_rpr] | [↗/↘/→] [+X%] |

---

## 🎯 Campaign Performance

Top [N] campaigns by volume:

| Campaign | Recipients | Open Rate | Click Rate | Conv Rate | Revenue | Trend |
|----------|-----------|-----------|------------|-----------|---------|-------|
| [Campaign 1] | [recipients] | [open_rate]% | [click_rate]% | [conv_rate]% | $[revenue] | [↗/↘/→] [+X%] |
| [Campaign 2] | [recipients] | [open_rate]% | [click_rate]% | [conv_rate]% | $[revenue] | [↗/↘/→] [+X%] |
...

### Campaign Spotlight
[campaign_spotlight from Step 10]

---

## 🔄 Flow Performance

| Flow | Recipients | Open Rate | Click Rate | Conv Rate | Revenue |
|------|-----------|-----------|------------|-----------|---------|
| [Flow 1] | [recipients] | [open_rate]% | [click_rate]% | [conv_rate]% | $[revenue] |
| [Flow 2] | [recipients] | [open_rate]% | [click_rate]% | [conv_rate]% | $[revenue] |
...

**Flow Summary**: [total_flows] active flows, [flow_recipients] total recipients, $[flow_revenue] total revenue

---

## 📝 Notes

- Engagement metrics use unique activity counts
- Spam complaint rate should stay below 0.1% to maintain deliverability
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat (±0.5% threshold)
- Revenue data depends on Klaviyo conversion tracking configuration

---

**Analytics powered by Klaviyo MCP**
**Report generated via Claude Code**
```

## Step 12: Display Report

Output the formatted markdown report to the user.

## Error Handling

**No data for period:**
```
If current_recipients === 0 and previous_recipients === 0:
  Show: "No campaigns were sent during these periods.
         Try a different date range or verify campaigns exist in Klaviyo."
  Stop execution
```

**MCP errors:**
- Network timeout → "Unable to fetch data. Please try again."
- Invalid API key → "Klaviyo MCP not properly configured. Check your API key and permissions."
- Rate limit → "Too many requests. Please wait a moment."
- Tool not found → "Klaviyo MCP server not connected. Run setup instructions."

**Division by zero:**
- All rate calculations must check for zero denominator
- If denominator = 0, set rate = 0 (not error)

**Campaign matching:**
- If campaign exists in current but not previous → Show as "New"
- If campaign in both → Calculate trend
- Sort campaigns by recipients (descending)

**Flow report errors:**
- If flow reporting fails or returns empty, skip the Flow Performance section
- Note in report: "Flow data unavailable for this period"

---

Execute steps 1-12 to generate the complete analytics report.
