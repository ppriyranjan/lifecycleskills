# Customer.io MCP Quick Reference

## Available Tools (11 Total)

### 1. list_workspaces
**Purpose:** Get all accessible workspaces
**Returns:** Array of {id, name}
**Use:** First call to get workspace_id for all other operations

### 2. list
**Actions:** list_campaigns, list_newsletters, list_segments, list_attributes, list_events, list_transactional_messages, list_template_components
**Parameters:** action, workspace_id, {action}_params (limit, offset, search, tags)
**Returns:** Array of resources with pagination metadata
**Use:** Discover workspace resources

### 3. get
**Actions:** get_campaign, get_newsletter, get_segment, get_template, get_profile, get_campaign_action, get_newsletter_recommended_send_time, get_campaign_recommended_send_time, get_guidance_resource
**Parameters:** action, workspace_id, resource_id
**Returns:** Detailed resource information
**Use:** Deep dive into specific resources

### 4. search
**Actions:** search_docs, search_workspace
**Parameters:** action, workspace_id, query (for docs), form_terms/message_searches (for workspace)
**Returns:** Natural language response (docs) or discovered data (workspace)
**Use:** Find information or discover workspace structure

### 5. create
**Actions:** create_segment
**Parameters:** action, workspace_id, discovered_data, original_user_request, business_context, current_timezone
**Returns:** Created segment details
**Use:** Create new segments based on natural language requests

### 6. create_template
**Parameters:** name, subject, body, workspace_id, from, preheader_text, sample_customer_id
**Returns:** Created template details
**Use:** Create new email templates

### 7. edit_template
**Parameters:** node_id, workspace_id, body_replacements/body, subject, name, from, preheader_text, replace_all, sample_customer_id, description
**Returns:** Updated template details
**Use:** Edit existing email templates

### 8. create_component
**Parameters:** name, component_name, content, workspace_id, settings
**Returns:** Created component details
**Use:** Create reusable email components

### 9. edit_component
**Parameters:** node_id, workspace_id, content_replacements/content, component_name, name, settings, replace_all, description
**Returns:** Updated component details
**Use:** Edit existing components

### 10. metrics
**Actions:** fetch, workspace
**Fetch Parameters:**
- Required: ONE of campaign_id, newsletter_id, transactional_message_id, action_id, template_id
- Optional: channel_types, metric_types, human_only, include_time_series, resolution, time_range
**Workspace Parameters:**
- Optional: data_types, include_time_series, limit, offset, name, resolution, sort_by, sort_order, statuses, summary_only, tag_ids, time_range
**Returns:** Comprehensive metrics data
**Use:** Primary analytics tool

### 11. integration
**Actions:** sources_list, sources_search, source_get, source_add, test_inapp, test_push, troubleshoot
**Parameters:** Varies by action
**Returns:** SDK integration information or test results
**Use:** SDK setup and troubleshooting

---

## Metrics Tool Deep Dive

### Available Metrics (21 types)
**Deliverability:**
- attempted, created, drafted, sent, delivered
- bounced, deferred, failed, suppressed, undeliverable, spammed

**Engagement:**
- opened, human_opened, prefetch_opened
- clicked, human_clicked, machine_clicked
- replied, converted, unsubscribed, topic_unsubscribed

### Calculated Rates
- open_rate = opens / delivered
- click_rate = clicks / delivered
- click_to_open_rate = clicks / opens
- conversion_rate = conversions / delivered
- delivery_rate = delivered / sent

### Supported Channels (10 types)
email, sms, push, in_app, inbox, line, slack, urban_airship, webhook, whatsapp

### Resolution Options
- hourly (for <7 days)
- daily (for <90 days)
- weekly (for weeks/months)
- monthly (for longer periods)
- auto (adapts to date range)

### Key Parameters
- **human_only** (Boolean): Filter out bot/machine activity for accurate engagement
- **include_time_series** (Boolean): Get temporal breakdown (larger response)
- **time_range** (Object): {start_date: "YYYY-MM-DD", end_date: "YYYY-MM-DD"}
- **channel_types** (Array): Filter by specific channels
- **metric_types** (Array): Filter by specific metrics
- **sort_by** (String): sent, delivered, opened, clicked, converted, delivery_rate, open_rate, click_rate, conversion_rate

---

## Common Usage Patterns

### Pattern 1: Workspace Overview
```
1. list_workspaces → get workspace_id
2. list (action: list_campaigns) → get all campaigns
3. list (action: list_newsletters) → get all newsletters
4. metrics (action: workspace) → get aggregate metrics
```

### Pattern 2: Campaign Analysis
```
1. list (action: list_campaigns, search: "campaign name") → find campaign
2. get (action: get_campaign, campaign_id: X) → get campaign structure
3. metrics (action: fetch, campaign_id: X, include_time_series: true) → get metrics
```

### Pattern 3: Deliverability Audit
```
1. metrics (action: workspace, sort_by: delivery_rate, sort_order: asc) → lowest delivery rates
2. metrics (action: fetch, campaign_id: X, metric_types: [bounced, failed, spammed]) → problem details
```

### Pattern 4: Engagement Analysis
```
1. metrics (action: workspace, human_only: true, sort_by: open_rate) → human engagement only
2. metrics (action: fetch, campaign_id: X, human_only: true, include_time_series: true) → trend analysis
```

### Pattern 5: Segment Discovery
```
1. list (action: list_segments) → all segments
2. get (action: get_segment, segment_id: X) → segment rules
3. search (action: search_workspace, ...) → discover workspace data for segment creation
4. create (action: create_segment, discovered_data: {...}, original_user_request: "...") → create segment
```

---

## Response Structure Patterns

### Pagination
```json
{
  "data_array": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "size": 50,
      "total": 100
    }
  }
}
```

### Metrics Fetch
```json
{
  "summary": {
    "total_sent": 1000,
    "total_opened": 250,
    "open_rate": 25.0,
    ...
  },
  "channel_breakdown": [...],
  "time_series": {
    "bins": ["2026-03-01", "2026-03-02", ...],
    "resolution": "days",
    "metrics": {
      "sent": [100, 150, ...],
      "opened": [25, 40, ...]
    }
  },
  "period": "2026-03-01 to 2026-03-31",
  "object_type": "campaign",
  "object_id": 123
}
```

### Metrics Workspace
```json
{
  "campaigns": [
    {
      "campaign_id": 1,
      "name": "Campaign Name",
      "type": "seg_attr",
      "has_conversion": true,
      "has_tracked_links": true,
      "delivery_metrics": {
        "sent": 1000,
        "delivered": 950,
        "opened": 250,
        "delivery_rate": 95.0,
        "open_rate": 26.3,
        ...
      }
    }
  ],
  "transactional_messages": [...],
  "newsletters": [...],
  "period": "...",
  "total_count": 10,
  "has_more": false
}
```

---

## Data Types Reference

### Timestamps
All Unix timestamps (seconds since epoch): created_at, updated_at, last_updated

### Enums
**Campaign States:** draft, running, stopped, archived
**Campaign Types:** none, seg_attr
**Segment Types:** dynamic, static
**Segment States:** finished, processing
**Action Types:** exit, email, push, sms, random_cohort_branch, delay_seconds, webhook, etc.

### URLs
Pattern: `https://fly.customer.io/workspaces/{workspace_id}/journeys/{type}/{id}/overview`

---

## Best Practices

1. **Always get workspace_id first**: Call list_workspaces before any other operation
2. **Use human_only for engagement**: Set human_only=true to filter bot activity
3. **Request time_series only when needed**: Larger response, use selectively
4. **Choose appropriate resolution**: Auto is safe, but manual selection optimizes response size
5. **Filter metrics and channels**: Use metric_types and channel_types to reduce data
6. **Cache workspace structure**: Campaigns/segments change infrequently, metrics change often
7. **Handle empty metrics gracefully**: No activity = empty delivery_metrics object
8. **Use summary_only for quick checks**: Workspace overview without full details
9. **Leverage search_docs**: Get contextual help and explanations
10. **Validate date ranges**: Don't request future dates, ensure start < end

---

## Quick Metric Calculations

### Engagement Quality Score
```
click_to_open_rate = (human_clicks / human_opens) * 100
Higher = better engagement quality
```

### Deliverability Health
```
delivery_rate = (delivered / sent) * 100
Target: >95%
```

### Bounce Risk
```
bounce_rate = (bounced / sent) * 100
Alert if: >5%
```

### Spam Risk
```
spam_rate = (spammed / delivered) * 100
Alert if: >0.1%
```

### Human Engagement
```
true_open_rate = (human_opened / delivered) * 100
true_click_rate = (human_clicked / delivered) * 100
Use instead of total opens/clicks for accurate measurement
```

---

## Common Metric Combinations

### Full Funnel
```
metric_types: [
  "sent",
  "delivered",
  "opened",
  "clicked",
  "converted"
]
```

### Deliverability Focus
```
metric_types: [
  "attempted",
  "sent",
  "delivered",
  "bounced",
  "failed",
  "deferred",
  "suppressed"
]
```

### Engagement Focus
```
metric_types: [
  "human_opened",
  "human_clicked",
  "converted"
]
human_only: true
```

### Problem Diagnosis
```
metric_types: [
  "bounced",
  "failed",
  "spammed",
  "unsubscribed"
]
```

---

## Error Handling

### Empty Metrics
```json
{
  "delivery_metrics": {}
}
```
**Meaning:** No activity in the specified date range
**Action:** Expand date range or check if campaign is active

### Missing Fields
Some fields are optional and may not appear:
- description (campaigns, segments)
- last_updated (segments)
- conversion tracking (campaigns)

### Rate Limiting
Not observed in testing, but implement:
- Exponential backoff
- Request batching
- Caching

---

## Example Tool Calls

### Get Workspace Metrics (Last 30 Days)
```json
{
  "tool": "mcp__customerio__metrics",
  "parameters": {
    "action": "workspace",
    "workspace_id": 200390,
    "include_time_series": true,
    "sort_by": "open_rate",
    "sort_order": "desc",
    "human_only": true
  }
}
```

### Get Campaign Performance (Custom Date Range)
```json
{
  "tool": "mcp__customerio__metrics",
  "parameters": {
    "action": "fetch",
    "workspace_id": 200390,
    "campaign_id": 2,
    "include_time_series": true,
    "human_only": true,
    "time_range": {
      "start_date": "2026-03-01",
      "end_date": "2026-03-31"
    },
    "resolution": "daily"
  }
}
```

### List Top Campaigns
```json
{
  "tool": "mcp__customerio__list",
  "parameters": {
    "action": "list_campaigns",
    "workspace_id": 200390,
    "limit": 20,
    "offset": 0
  }
}
```

### Get Campaign Structure
```json
{
  "tool": "mcp__customerio__get",
  "parameters": {
    "action": "get_campaign",
    "workspace_id": 200390,
    "campaign_id": 2
  }
}
```

### Search Documentation
```json
{
  "tool": "mcp__customerio__search",
  "parameters": {
    "action": "search_docs",
    "workspace_id": 200390,
    "query": "How do I improve email deliverability?"
  }
}
```

---

## Testing Notes

**Test Workspace:** Shopflo (ID: 200390)
- 4 campaigns (all draft, no sends)
- 11 segments (131 users)
- 15 attributes
- 1 event

**Limitations:**
- No actual metric values (no campaign activity)
- Cannot verify time_series structure with real data
- Cannot test channel_breakdown format

**Verification Needed:**
- Time series array format when data exists
- Channel breakdown structure
- Non-empty delivery_metrics format
- Human vs bot metric differences
- Conversion tracking data structure
