# Customer.io MCP - Quick Start Guide

## TL;DR

✓ **All 11 tools tested and documented**
✓ **21 metric types available** (deliverability + engagement)
✓ **Bot detection built-in** (human_only filter)
✓ **Time series support** (hourly/daily/weekly/monthly)
✓ **10 channel types** (email, sms, push, in_app, etc.)
✓ **5 complete report templates** ready to implement

---

## Files Created

| File | Size | Purpose |
|------|------|---------|
| customerio_mcp_test_results.md | 49KB | Complete test results, API docs, design recommendations |
| customerio_mcp_quick_reference.md | 18KB | Developer quick reference, usage patterns |
| customerio_report_templates.md | 32KB | 5 report templates with sample output |
| TEST_SUMMARY.md | 12KB | High-level summary of testing |
| QUICK_START.md | This file | Quick start guide |

---

## Most Important Tools for Analytics

### 1. metrics (workspace action)
**Get overall workspace metrics**
```json
{
  "action": "workspace",
  "workspace_id": 200390,
  "include_time_series": true,
  "human_only": true,
  "sort_by": "open_rate"
}
```
**Returns:** All campaigns with delivery_metrics, sorted by chosen metric

### 2. metrics (fetch action)
**Get metrics for specific campaign**
```json
{
  "action": "fetch",
  "workspace_id": 200390,
  "campaign_id": 2,
  "include_time_series": true,
  "human_only": true,
  "time_range": {
    "start_date": "2026-03-01",
    "end_date": "2026-03-31"
  }
}
```
**Returns:** Detailed metrics with time series for one campaign

### 3. list (list_campaigns action)
**Get all campaigns**
```json
{
  "action": "list_campaigns",
  "workspace_id": 200390,
  "limit": 50
}
```
**Returns:** Campaign list with id, name, type, state, urls

### 4. get (get_campaign action)
**Get campaign structure/flow**
```json
{
  "action": "get_campaign",
  "workspace_id": 200390,
  "campaign_id": 2
}
```
**Returns:** Complete campaign with all actions, A/B tests, delays

---

## Key Metrics

### Must-Track Metrics
- **sent** - Total sends
- **delivered** - Successfully delivered
- **human_opened** - Real human opens (not bots!)
- **human_clicked** - Real human clicks (not bots!)
- **bounced** - Failed deliveries
- **spammed** - Spam complaints
- **converted** - Conversions

### Calculated Rates
- **delivery_rate** = delivered / sent (target: >95%)
- **open_rate** = human_opened / delivered (target: >20%)
- **click_rate** = human_clicked / delivered (target: >5%)
- **click_to_open_rate** = human_clicked / human_opened (quality metric, target: >15%)

---

## Critical: Bot Detection

**Problem:** Email clients prefetch links, bots scan emails
**Result:** Inflated open/click rates (25-30% higher than actual)
**Solution:** Always use `human_only: true`

```json
// ❌ DON'T USE (includes bots)
{
  "metric_types": ["opened", "clicked"],
  "human_only": false
}

// ✅ USE THIS (real humans only)
{
  "metric_types": ["human_opened", "human_clicked"],
  "human_only": true
}
```

---

## Report Templates Available

### 1. Executive Summary
**Use Case:** Monthly business review, stakeholder updates
**Tools:** list_workspaces, list_campaigns, metrics (workspace)
**Output:** Top performers, trends, key insights, recommendations

### 2. Campaign Performance
**Use Case:** Analyze all campaigns, identify winners/losers
**Tools:** list_campaigns, metrics (workspace + fetch), get_campaign
**Output:** Campaign table, top 5, bottom 5, A/B tests, multi-step analysis

### 3. Deliverability Health
**Use Case:** Monitor email health, identify delivery issues
**Tools:** metrics (workspace + fetch) with deliverability metrics
**Output:** Health score, bounce analysis, spam tracking, remediation plan

### 4. Engagement Analysis
**Use Case:** Understand user engagement, human vs bot
**Tools:** metrics with human_only=true and false for comparison
**Output:** Funnel analysis, CTOR, segment performance, content insights

### 5. Segment Performance
**Use Case:** Analyze segment sizes and engagement
**Tools:** list_segments, get_segment, list_campaigns, metrics
**Output:** Segment table, growth trends, campaign fit, recommendations

---

## 30-Second Test

```bash
# Assuming MCP is already connected
echo "Get workspace metrics for the last 30 days with human-only engagement" | \
  claude --print --permission-mode bypassPermissions
```

---

## Recommended First Implementation

**Start Here:** Executive Summary Report

**Why:**
- Simplest to implement (2-3 tool calls)
- Highest business value
- Quick win

**Tool Sequence:**
1. list_workspaces → Get workspace_id
2. metrics (action: workspace, human_only: true, include_time_series: true)
3. Generate markdown summary

**Output:**
- Overall metrics (sends, open rate, click rate)
- Top 5 campaigns by engagement
- Trends (up/down vs previous period)
- 3-5 actionable recommendations

**Estimated Effort:** 2-4 hours

---

## Common Patterns

### Pattern 1: Quick Health Check
```
1. metrics (workspace, summary_only: true, human_only: true)
2. Check delivery_rate >95%, bounce_rate <5%, spam_rate <0.1%
3. Alert if any thresholds exceeded
```

### Pattern 2: Top Performers
```
1. metrics (workspace, sort_by: open_rate, sort_order: desc, limit: 10, human_only: true)
2. Show top 10 campaigns by open rate
```

### Pattern 3: Campaign Deep Dive
```
1. list_campaigns (search: "campaign name")
2. get_campaign (campaign_id: X) → structure
3. metrics (fetch, campaign_id: X, include_time_series: true) → performance
4. Analyze flow, A/B tests, drop-offs
```

### Pattern 4: Deliverability Audit
```
1. metrics (workspace, metric_types: [delivered, bounced, failed, spammed])
2. Sort by delivery_rate ascending
3. Identify campaigns with delivery_rate <95%
4. Get details with metrics (fetch) for each problem campaign
```

---

## Data You Can Access

### Workspace Level
- All campaigns (id, name, type, state, dates, urls)
- All newsletters/broadcasts
- All transactional messages
- All segments (with sizes)
- All attributes (names)
- All events (names)

### Campaign Level
- Complete flow/workflow (actions, branches, delays)
- A/B test configurations
- Message templates (ids, names)
- Triggers and entry conditions

### Metrics Level (21 types)
- Deliverability: attempted, sent, delivered, bounced, failed, deferred, suppressed, spammed
- Engagement: opened, clicked, converted, replied, unsubscribed
- Bot Detection: human_opened, human_clicked, prefetch_opened, machine_clicked
- Time Series: Daily/hourly breakdown of any metric
- Channel Breakdown: Performance by email/sms/push/etc.

---

## Best Practices

1. **Cache workspace structure** (campaigns change rarely, metrics change often)
2. **Use human_only=true** for all engagement metrics
3. **Default to last 30 days** (good balance of data and performance)
4. **Request time_series only when needed** (larger response)
5. **Handle empty metrics gracefully** (draft campaigns have no data)
6. **Include comparisons** (vs previous period, vs workspace average)
7. **Provide context** (explain metrics, show benchmarks)
8. **Generate insights** (don't just show data, interpret it)
9. **Prioritize actions** (critical > high > medium > low)
10. **Link to UI** (include Customer.io URLs for drill-down)

---

## Example: Build Executive Summary in 5 Minutes

```javascript
// Step 1: Get workspace
const workspaces = await mcp.call('list_workspaces');
const workspace_id = workspaces.workspaces[0].id;

// Step 2: Get campaigns
const campaigns = await mcp.call('list', {
  action: 'list_campaigns',
  workspace_id
});

// Step 3: Get metrics
const metrics = await mcp.call('metrics', {
  action: 'workspace',
  workspace_id,
  human_only: true,
  sort_by: 'open_rate',
  sort_order: 'desc'
});

// Step 4: Generate report
const report = `
# Executive Summary

**Period:** ${metrics.period}
**Total Campaigns:** ${campaigns.meta.pagination.total}

## Top Performers
${metrics.campaigns.slice(0, 5).map((c, i) => 
  `${i+1}. ${c.name} - ${c.delivery_metrics.open_rate}% open rate`
).join('\n')}

## Overall Metrics
- Sends: ${sum(metrics.campaigns, 'delivery_metrics.sent')}
- Open Rate: ${average(metrics.campaigns, 'delivery_metrics.open_rate')}%
- Click Rate: ${average(metrics.campaigns, 'delivery_metrics.click_rate')}%

## Recommendations
${generateRecommendations(metrics)}
`;

console.log(report);
```

---

## Questions?

See detailed documentation in:
- `customerio_mcp_test_results.md` - Complete API reference
- `customerio_mcp_quick_reference.md` - Developer guide
- `customerio_report_templates.md` - 5 report templates

You have everything you need to build a comprehensive analytics skill!
