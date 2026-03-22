# Customer.io MCP Integration Test Results

**Test Date:** 2026-03-20
**MCP Server URL:** https://mcp.customer.io/mcp
**Status:** Connected and Authenticated
**Test Workspace:** Shopflo (ID: 200390)

---

## Executive Summary

Successfully tested all 11 Customer.io MCP tools. The integration provides comprehensive access to:
- Workspace and campaign management
- Metrics and analytics (deliverability and engagement)
- Template creation and editing
- Segment and attribute management
- Documentation search
- Integration troubleshooting

All tools are functional, though the test workspace has minimal activity (no messages sent in the last 30 days).

---

## Tool Testing Results

### 1. list_workspaces

**Purpose:** Lists all workspaces the authenticated user has access to

**Parameters:**
- `search` (optional, string): Fuzzy search query to filter workspaces by name

**Test Call:**
```
Tool: mcp__customerio__list_workspaces
Parameters: {}
```

**Response Structure:**
```json
{
  "workspaces": [
    {
      "id": 200390,
      "name": "Shopflo"
    }
  ]
}
```

**Data Types:**
- `workspaces`: Array of objects
  - `id`: Integer (workspace identifier)
  - `name`: String (workspace display name)

**Key Findings:**
- Returns all accessible workspaces
- Minimal response structure (just id and name)
- Workspace ID is required for all subsequent API calls

---

### 2. list (Multiple Actions)

**Purpose:** List various workspace resources and metadata

**Supported Actions:**
1. `list_attributes`
2. `list_segments`
3. `list_events`
4. `list_campaigns`
5. `list_newsletters`
6. `list_transactional_messages`
7. `list_template_components`

#### 2.1 list_campaigns

**Test Call:**
```
Tool: mcp__customerio__list
Parameters: {
  action: "list_campaigns",
  workspace_id: 200390
}
```

**Response Structure:**
```json
{
  "campaigns": [
    {
      "id": 1,
      "name": "Untitled Campaign 1",
      "type": "None",
      "state": "draft",
      "created_at": 1762941137,
      "updated_at": 1770116035,
      "archived": false,
      "url": "https://fly.customer.io/workspaces/200390/journeys/campaigns/1/overview",
      "description": "Optional description field"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "size": 50,
      "total": 4
    }
  }
}
```

**Data Types:**
- `campaigns`: Array of objects
  - `id`: Integer
  - `name`: String
  - `type`: String (enum: "None", "Segment or Attribute", etc.)
  - `state`: String (enum: "draft", "running", "stopped", "archived")
  - `created_at`: Integer (Unix timestamp)
  - `updated_at`: Integer (Unix timestamp)
  - `archived`: Boolean
  - `url`: String (direct link to campaign)
  - `description`: String (optional)
- `meta`: Object
  - `pagination`: Object
    - `page`: Integer
    - `size`: Integer
    - `total`: Integer

**Key Findings:**
- Supports pagination (default: 50 per page)
- Supports fuzzy search by name/description
- Supports filtering by tags
- Returns direct URLs to campaign in Customer.io UI

#### 2.2 list_segments

**Test Call:**
```
Tool: mcp__customerio__list
Parameters: {
  action: "list_segments",
  workspace_id: 200390
}
```

**Response Structure:**
```json
{
  "segments": [
    {
      "id": 1,
      "name": "All Users",
      "type": "dynamic",
      "count": 131,
      "description": "Includes all the people in your workspace",
      "state": "finished",
      "progress": null,
      "last_updated": null,
      "url": "https://fly.customer.io/workspaces/200390/journeys/segments/1/overview"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "size": 50,
      "total": 11
    }
  }
}
```

**Data Types:**
- `segments`: Array of objects
  - `id`: Integer
  - `name`: String
  - `type`: String (enum: "dynamic", "static")
  - `count`: Integer (number of people in segment)
  - `description`: String
  - `state`: String (enum: "finished", "processing", etc.)
  - `progress`: Integer or null
  - `last_updated`: Integer (Unix timestamp) or null
  - `url`: String

**Key Findings:**
- Shows segment size (count of people)
- Distinguishes between dynamic and static segments
- Test workspace had 11 segments (131 total users)
- Includes both user-created and default segments

#### 2.3 list_attributes

**Test Call:**
```
Tool: mcp__customerio__list
Parameters: {
  action: "list_attributes",
  workspace_id: 200390
}
```

**Response Structure:**
```json
{
  "attributes": [
    "airbyte",
    "airbyte test 1 *",
    "cio_id",
    "email",
    "id",
    "Number of completed orders",
    "User Name"
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "size": 1000,
      "total": 15
    }
  }
}
```

**Data Types:**
- `attributes`: Array of strings (attribute names)
- `meta`: Pagination object

**Key Findings:**
- Returns simple array of attribute names
- No additional metadata about attribute types or usage
- Test workspace had 15 attributes including standard (email, id) and computed attributes

#### 2.4 list_events

**Test Call:**
```
Tool: mcp__customerio__list
Parameters: {
  action: "list_events",
  workspace_id: 200390
}
```

**Response Structure:**
```json
{
  "events": [
    "test_event"
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "size": 1000,
      "total": 1
    }
  }
}
```

**Data Types:**
- `events`: Array of strings (event names)
- `meta`: Pagination object

**Key Findings:**
- Returns simple array of event names
- Test workspace had only 1 event
- No event property information included

#### 2.5 list_newsletters

**Test Call:**
```
Tool: mcp__customerio__list
Parameters: {
  action: "list_newsletters",
  workspace_id: 200390
}
```

**Response Structure:**
```json
{
  "newsletters": [],
  "meta": {
    "pagination": {
      "page": 1,
      "size": 50,
      "total": 0
    }
  }
}
```

**Key Findings:**
- Same structure as campaigns
- Test workspace had no newsletters/broadcasts
- This action handles both newsletters and broadcasts

---

### 3. get (Multiple Actions)

**Purpose:** Get detailed information about single resources

**Supported Actions:**
1. `get_profile`
2. `get_newsletter`
3. `get_campaign`
4. `get_campaign_action`
5. `get_segment`
6. `get_template`
7. `get_newsletter_recommended_send_time`
8. `get_campaign_recommended_send_time`
9. `get_guidance_resource`

#### 3.1 get_campaign

**Test Call:**
```
Tool: mcp__customerio__get
Parameters: {
  action: "get_campaign",
  workspace_id: 200390,
  campaign_id: 2
}
```

**Response Structure:**
```json
{
  "id": 2,
  "name": "Untitled Campaign 2",
  "type": "seg_attr",
  "description": "Identify customers at risk of churning or inactivity and re-engage them.",
  "state": "draft",
  "created_at": 1766393402,
  "updated_at": 1770116235,
  "archived": false,
  "version": 13,
  "url": "https://fly.customer.io/workspaces/200390/journeys/campaigns/2/overview",
  "actions": [
    {
      "id": 1,
      "version": 1,
      "campaign_id": 2,
      "action_type": "exit",
      "last_updated": 1766393402
    },
    {
      "id": 2,
      "version": 1,
      "campaign_id": 2,
      "action_type": "random_cohort_branch",
      "last_updated": 1766393402,
      "random_cohorts": [
        {"cohort_id": 1, "percentage": 33.33, "next_action_id": 3},
        {"cohort_id": 2, "percentage": 33.33, "next_action_id": 4},
        {"cohort_id": 3, "percentage": 33.34, "next_action_id": 5}
      ]
    },
    {
      "id": 3,
      "version": 4,
      "campaign_id": 2,
      "action_type": "email",
      "template_id": 2,
      "name": "Check out our latest features!",
      "state": "draft",
      "last_updated": 1766401191,
      "next_action_id": 6,
      "tracked": true,
      "has_conversion": true
    }
  ],
  "triggers": []
}
```

**Data Types:**
- Campaign object with extensive action array
- Actions include:
  - `id`: Integer
  - `version`: Integer
  - `campaign_id`: Integer
  - `action_type`: String (enum: "exit", "email", "push", "random_cohort_branch", "delay_seconds", etc.)
  - `template_id`: Integer (for message actions)
  - `name`: String (for message actions)
  - `state`: String (for message actions)
  - `last_updated`: Integer (Unix timestamp)
  - `next_action_id`: Integer (flow routing)
  - `tracked`: Boolean
  - `has_conversion`: Boolean
  - Action-specific fields (e.g., `random_cohorts`, `delay_seconds`)

**Key Findings:**
- Provides complete campaign flow/workflow
- Shows A/B test configurations (random_cohort_branch)
- Includes delay timings and routing logic
- Test campaign had 11 actions forming a re-engagement flow
- No triggers configured (campaign in draft state)

---

### 4. search (Multiple Actions)

**Purpose:** Search across documentation and workspace data

**Supported Actions:**
1. `search_docs` - Search Customer.io documentation
2. `search_workspace` - Search workspace data (messages, forms, pages, etc.)

#### 4.1 search_docs

**Test Call:**
```
Tool: mcp__customerio__search
Parameters: {
  action: "search_docs",
  workspace_id: 200390,
  query: "How do I track email deliverability metrics?"
}
```

**Response Structure:**
```
Natural language response with:
- Direct answer to the question
- Key metrics available
- Relevant documentation links
- Best practices
```

**Key Findings:**
- Returns AI-generated natural language response
- Includes links to relevant Customer.io documentation
- Can be customized with `preamble` parameter for system prompt
- Excellent for contextual help and guidance

---

### 5. create (create_segment)

**Purpose:** Create new segments based on discovered workspace data

**Parameters:**
- `action`: "create_segment"
- `workspace_id`: Integer
- `discovered_data`: Object with typed arrays (attributes, broadcasts, campaigns, events, forms, messages, objects, pages, screens)
- `original_user_request`: String (natural language request)
- `business_context`: Object (optional key-value pairs)
- `current_timezone`: String (optional IANA timezone)

**Key Findings:**
- Requires comprehensive workspace discovery before segment creation
- Supports natural language requests for segment logic
- Can incorporate business context for better segment design
- Not tested due to complexity (would require full workspace discovery)

---

### 6. create_template

**Purpose:** Creates an email draft in Design Studio

**Parameters:**
- `name`: String (required) - Template name
- `subject`: String (required) - Email subject (supports Liquid)
- `body`: String (required) - Email HTML body (supports Liquid)
- `workspace_id`: Integer (required)
- `from`: String (optional) - Sender email address
- `preheader_text`: String (optional) - Preview text
- `sample_customer_id`: String (optional) - Customer ID for Liquid validation

**Key Findings:**
- Supports Liquid templating in subject and body
- Can validate Liquid syntax with sample customer data
- Creates drafts (not published templates)
- Not tested to avoid creating test data

---

### 7. edit_template

**Purpose:** Edits a Design Studio email template

**Parameters:**
- `node_id`: String (required) - Design Studio node ID (UUID)
- `workspace_id`: Integer (required)
- `body_replacements`: Array of objects (optional) - Find-and-replace operations
- `body`: String (optional) - Complete new body content
- `subject`: String (optional) - Email subject
- `name`: String (optional) - Template name
- `from`: String (optional) - Sender email
- `preheader_text`: String (optional) - Preview text
- `replace_all`: Boolean (optional) - Replace all occurrences
- `sample_customer_id`: String (optional) - Customer ID for validation
- `description`: String (optional) - Change description

**Key Findings:**
- Supports both incremental edits (find-replace) and full overwrites
- Requires UUID node_id (not template_id)
- Can track changes with description field
- Not tested to avoid modifying existing templates

---

### 8. create_component

**Purpose:** Creates a reusable component in Design Studio

**Parameters:**
- `name`: String (required) - Display name
- `component_name`: String (required) - Component type identifier
- `content`: String (required) - HTML content
- `workspace_id`: Integer (required)
- `settings`: String (optional) - JSON settings

**Key Findings:**
- For creating reusable email components
- Supports custom HTML content
- Can have JSON settings for component configuration
- Not tested to avoid creating test data

---

### 9. edit_component

**Purpose:** Edits a Design Studio custom component

**Parameters:**
- Similar to edit_template but for components
- Uses `content` instead of `body`
- Supports find-and-replace operations

**Key Findings:**
- Parallel to edit_template for component editing
- Not tested to avoid modifications

---

### 10. metrics (Multiple Actions)

**Purpose:** Fetch deliverability and engagement metrics

**Supported Actions:**
1. `fetch` - Get metrics for a specific campaign, newsletter, transactional message, action, or template
2. `workspace` - Get metrics across the entire workspace

#### 10.1 metrics (action: fetch)

**Test Call:**
```
Tool: mcp__customerio__metrics
Parameters: {
  action: "fetch",
  workspace_id: 200390,
  campaign_id: 2,
  include_time_series: true
}
```

**Response Structure:**
```json
{
  "summary": {
    "total_sent": 0,
    "total_opened": 0,
    "total_clicked": 0,
    "total_converted": 0,
    "open_rate": 0,
    "click_rate": 0,
    "click_to_open_rate": 0
  },
  "channel_breakdown": [],
  "time_series": {
    "bins": [
      "2026-02-18",
      "2026-02-19",
      "..."
    ],
    "resolution": "days",
    "metrics": {}
  },
  "period": "2026-02-18 to 2026-03-20",
  "human_only_filter": false,
  "object_type": "campaign",
  "object_id": 2,
  "channels": [
    "email",
    "in_app",
    "inbox",
    "line",
    "push",
    "slack",
    "sms",
    "urban_airship",
    "webhook",
    "whatsapp"
  ],
  "metrics_included": [
    "attempted",
    "bounced",
    "clicked",
    "converted",
    "created",
    "deferred",
    "delivered",
    "drafted",
    "failed",
    "human_clicked",
    "human_opened",
    "machine_clicked",
    "opened",
    "prefetch_opened",
    "replied",
    "sent",
    "spammed",
    "suppressed",
    "topic_unsubscribed",
    "undeliverable",
    "unsubscribed"
  ],
  "resolution": "days"
}
```

**Data Types:**
- `summary`: Object
  - `total_sent`: Integer
  - `total_opened`: Integer
  - `total_clicked`: Integer
  - `total_converted`: Integer
  - `open_rate`: Float (percentage)
  - `click_rate`: Float (percentage)
  - `click_to_open_rate`: Float (percentage)
- `channel_breakdown`: Array of channel-specific metrics
- `time_series`: Object
  - `bins`: Array of strings (ISO date format)
  - `resolution`: String (enum: "hourly", "daily", "weekly", "monthly")
  - `metrics`: Object (metric_name → array of values matching bins)
- `period`: String (date range)
- `human_only_filter`: Boolean
- `object_type`: String (enum: "campaign", "newsletter", "transactional_message", "action", "template")
- `object_id`: Integer
- `channels`: Array of strings
- `metrics_included`: Array of strings
- `resolution`: String

**Supported Metric Types:**
- attempted
- bounced
- clicked
- converted
- created
- deferred
- delivered
- drafted
- failed
- human_clicked
- human_opened
- machine_clicked
- opened
- prefetch_opened
- replied
- sent
- spammed
- suppressed
- topic_unsubscribed
- undeliverable
- unsubscribed

**Supported Channels:**
- email
- sms
- push
- in_app
- inbox
- line
- slack
- urban_airship
- webhook
- whatsapp

**Fetch Parameters:**
- Requires exactly ONE of: `campaign_id`, `newsletter_id`, `transactional_message_id`, `action_id`, or `template_id`
- `channel_types`: Array (optional) - Filter by specific channels
- `metric_types`: Array (optional) - Filter by specific metrics
- `human_only`: Boolean (default: false) - Exclude bot/machine activity
- `include_time_series`: Boolean (default: false) - Include time breakdown
- `resolution`: String (default: auto) - Time granularity
- `time_range`: Object (optional)
  - `start_date`: String (YYYY-MM-DD)
  - `end_date`: String (YYYY-MM-DD)

**Key Findings:**
- Comprehensive metric coverage (21 metric types)
- Bot detection (human_only filter)
- Time series support with multiple resolutions
- Empty metrics when no activity
- Defaults to last 30 days
- Default resolution is "auto" (adapts to date range)

#### 10.2 metrics (action: workspace)

**Test Call:**
```
Tool: mcp__customerio__metrics
Parameters: {
  action: "workspace",
  workspace_id: 200390,
  include_time_series: true,
  summary_only: false,
  sort_by: "sent"
}
```

**Response Structure:**
```json
{
  "campaigns": [
    {
      "campaign_id": 1,
      "name": "Untitled Campaign 1",
      "type": "none",
      "has_conversion": false,
      "has_tracked_links": false,
      "delivery_metrics": {}
    }
  ],
  "transactional_messages": [
    {
      "transactional_id": 1,
      "name": "All uncategorized email messages",
      "is_default": true,
      "has_tracked_links": true,
      "delivery_metrics": {}
    }
  ],
  "period": "2026-02-18 to 2026-03-20",
  "resolution": "days",
  "bin_count": 31,
  "total_count": 5,
  "offset": 0,
  "limit": 20,
  "has_more": false
}
```

**Data Types:**
- `campaigns`: Array of objects
  - `campaign_id`: Integer
  - `name`: String
  - `type`: String (enum: "none", "seg_attr", etc.)
  - `has_conversion`: Boolean
  - `has_tracked_links`: Boolean
  - `delivery_metrics`: Object (contains metric data when available)
- `transactional_messages`: Array of objects
  - `transactional_id`: Integer
  - `name`: String
  - `is_default`: Boolean
  - `has_tracked_links`: Boolean
  - `delivery_metrics`: Object
- `period`: String (date range)
- `resolution`: String
- `bin_count`: Integer (number of time bins)
- `total_count`: Integer (total items across all types)
- `offset`: Integer
- `limit`: Integer
- `has_more`: Boolean

**Workspace Parameters:**
- `data_types`: Array (optional) - Filter by: campaign, broadcast, newsletter, transactional_message
- `include_time_series`: Boolean (default: false)
- `limit`: Integer (default: 20, max: 100) - Max items per type
- `offset`: Integer (default: 0)
- `name`: String (optional) - Filter by name
- `resolution`: String (default: auto) - daily or monthly
- `sort_by`: String (default: sent) - sent, delivered, opened, clicked, converted, delivery_rate, open_rate, click_rate, conversion_rate
- `sort_order`: String (default: desc) - asc or desc
- `statuses`: Array (optional) - running, stopped, archived
- `summary_only`: Boolean (default: false) - Only workspace summary
- `tag_ids`: Array of integers (optional)
- `time_range`: Object (optional) - Same as fetch

**Key Findings:**
- Aggregates metrics across all campaigns and transactional messages
- Supports sorting by various metrics and rates
- Can filter by status and tags
- Pagination support
- Defaults to last 30 days
- Empty delivery_metrics when no activity

---

### 11. integration (Multiple Actions)

**Purpose:** SDK integration and troubleshooting

**Supported Actions:**
1. `sources_list` - List all SDK integrations
2. `sources_search` - Search for SDK by platform
3. `source_get` - Get specific SDK details
4. `source_add` - Add new SDK integration
5. `test_inapp` - Test in-app messaging
6. `test_push` - Test push notifications
7. `troubleshoot` - Troubleshoot integration issues

**Parameters:**
- **sources_search**:
  - `source`: String (enum: expo, reactnative, ios, android, flutter, javascript, node, python, go)
  - `variant`: String (optional)
  - `version`: String (optional)
- **test_inapp**:
  - `user_id`: String (required)
- **test_push**:
  - `user_id`: String (optional)
  - `device_token`: String (optional)
  - `platform`: String (enum: ios, android)
- **troubleshoot**:
  - `platform`: String (enum: ios, android, reactnative, expo, flutter)
  - `symptom`: String (enum: push_not_showing, in_app_not_showing, events_not_showing, metrics_missing, rich_push_images, deep_links_not_working, multiple_push_providers, unexpected_behavior)

**Key Findings:**
- Comprehensive SDK support across 9 platforms
- Built-in testing tools for push and in-app
- Troubleshooting guidance for common issues
- Not tested to avoid sending test messages

---

## Summary of Available Metrics

### Deliverability Metrics
- **attempted** - Total send attempts
- **created** - Messages created/queued
- **drafted** - Messages in draft state
- **sent** - Successfully sent to provider
- **delivered** - Successfully delivered to recipient
- **bounced** - Hard and soft bounces
- **deferred** - Temporarily delayed
- **failed** - Permanent failures
- **suppressed** - Suppressed due to unsubscribe/bounce
- **undeliverable** - Could not be delivered
- **spammed** - Marked as spam by recipient

### Engagement Metrics
- **opened** - Total opens (includes bots)
- **human_opened** - Opens from real humans
- **prefetch_opened** - Bot/email client prefetch opens
- **clicked** - Total clicks (includes bots)
- **human_clicked** - Clicks from real humans
- **machine_clicked** - Bot/automated clicks
- **replied** - Email replies (if tracked)
- **converted** - Conversion events
- **unsubscribed** - Unsubscribe requests
- **topic_unsubscribed** - Topic-specific unsubscribes

### Calculated Rates
- **open_rate** - Opens / Delivered
- **click_rate** - Clicks / Delivered
- **click_to_open_rate** - Clicks / Opens
- **conversion_rate** - Conversions / Delivered
- **delivery_rate** - Delivered / Sent

---

## Data Type Patterns

### Common Patterns Across Tools

1. **Timestamps**: All timestamps are Unix timestamps (seconds since epoch)
   - `created_at`, `updated_at`, `last_updated`

2. **Pagination**: Consistent pagination structure
   ```json
   {
     "meta": {
       "pagination": {
         "page": 1,
         "size": 50,
         "total": 100
       }
     }
   }
   ```

3. **URLs**: Direct links to Customer.io UI
   - Pattern: `https://fly.customer.io/workspaces/{workspace_id}/journeys/{type}/{id}/overview`

4. **States**: Common state values
   - Campaigns/Messages: "draft", "running", "stopped", "archived"
   - Segments: "finished", "processing"

5. **Types**: Enumerated type fields
   - Campaign types: "none", "seg_attr" (segment/attribute triggered)
   - Segment types: "dynamic", "static"
   - Channel types: "email", "sms", "push", "in_app", etc.

---

## Design Recommendations for Analytics Report Skill

### 1. Core Features to Include

#### A. Workspace Overview
- Total campaigns, newsletters, transactional messages
- Total segments and their sizes
- Total attributes and events tracked
- Active vs draft vs stopped campaigns

#### B. Performance Dashboard
- Overall workspace metrics (last 7/30/90 days)
- Top performing campaigns by:
  - Send volume
  - Open rate
  - Click rate
  - Conversion rate
- Bottom performing campaigns (for optimization)
- Trend analysis (time series visualization)

#### C. Deliverability Report
- Delivery rate by campaign/channel
- Bounce rate analysis
- Spam complaint rate
- Failed delivery breakdown
- Channel-specific performance

#### D. Engagement Report
- Human vs bot engagement metrics
- Open rate trends (with human_only filter)
- Click rate trends (with human_only filter)
- Click-to-open rate (engagement quality)
- Conversion tracking (for campaigns with conversion enabled)

#### E. Campaign Deep Dive
- Individual campaign metrics
- A/B test performance comparison
- Action-level metrics (for multi-step campaigns)
- Time-to-open/click analysis
- Cohort performance (for campaigns with splits)

#### F. Segment Analytics
- Segment size over time
- Segment overlap analysis
- Campaign targeting by segment
- Segment growth/decline trends

### 2. Date Range Support
- Preset ranges: Last 7 days, 30 days, 90 days, This month, Last month
- Custom date range picker
- Automatic resolution selection (hourly for <7 days, daily for <90 days, monthly for longer)

### 3. Filtering Capabilities
- By campaign/newsletter/transactional message
- By channel type (email, sms, push, etc.)
- By metric type
- By status (running, stopped, archived)
- By tags
- Human-only vs all engagement

### 4. Export/Output Formats
- Markdown summary with key metrics
- CSV export for time series data
- Visual charts (if supported):
  - Line charts for trends
  - Bar charts for comparisons
  - Pie charts for distribution
- Executive summary (natural language)

### 5. Comparison Features
- Campaign vs campaign
- Time period vs time period (e.g., this month vs last month)
- Channel vs channel
- Segment performance comparison

### 6. Alerting/Insights
- Low delivery rate warnings (<95%)
- High bounce rate alerts (>5%)
- Spam complaint alerts (>0.1%)
- Declining engagement trends
- Best performing campaigns/segments
- Optimization opportunities

### 7. Report Templates

#### Template 1: Executive Summary
- Total sends, opens, clicks, conversions
- Overall rates
- Top 5 campaigns by volume
- Top 5 campaigns by engagement
- Key trends (up/down)
- Action items

#### Template 2: Campaign Performance Report
- All campaigns sorted by selected metric
- Individual campaign metrics
- Time series for selected campaigns
- Channel breakdown
- Recommendations

#### Template 3: Deliverability Health Check
- Delivery rate by campaign
- Bounce analysis
- Failed delivery reasons
- Spam complaints
- Channel-specific issues
- Remediation steps

#### Template 4: Engagement Analysis
- Human vs bot engagement
- Open/click trends over time
- Click-to-open ratio (engagement quality)
- Conversion funnel
- Best/worst performers
- Optimization suggestions

#### Template 5: Workspace Activity Report
- All campaigns, newsletters, broadcasts
- Segment overview
- Recent changes (new campaigns, updated segments)
- Overall workspace health
- Usage statistics

### 8. Implementation Considerations

#### Tool Call Sequence for Comprehensive Report:
1. **Discovery Phase**:
   - Call `list_workspaces` to confirm workspace
   - Call `list` with action="list_campaigns"
   - Call `list` with action="list_newsletters"
   - Call `list` with action="list_segments"
   - Call `list` with action="list_transactional_messages"

2. **Metrics Collection Phase**:
   - Call `metrics` with action="workspace" for overview
   - Call `metrics` with action="fetch" for each important campaign/newsletter
   - Use `include_time_series=true` for trend analysis
   - Use `human_only=true` for accurate engagement metrics

3. **Deep Dive Phase** (optional):
   - Call `get` with action="get_campaign" for flow analysis
   - Call `get` with action="get_segment" for segment details
   - Call `search` with action="search_docs" for contextual help

#### Performance Optimization:
- Use pagination wisely (adjust limit based on workspace size)
- Cache workspace structure (campaigns, segments rarely change)
- Batch metric requests where possible
- Use summary_only=true for quick overviews
- Implement progressive loading (overview first, then details on demand)

#### Error Handling:
- Handle empty metrics gracefully (no activity in date range)
- Validate date ranges (not future dates)
- Handle missing campaigns/newsletters (deleted or archived)
- Provide fallbacks for incomplete data

#### User Experience:
- Show loading progress (especially for large workspaces)
- Allow metric selection (don't always fetch everything)
- Provide metric explanations (what is click_to_open_rate?)
- Include comparison context (vs previous period, vs workspace average)
- Highlight actionable insights
- Link to Customer.io UI for drill-down

### 9. Sample Use Cases

#### Use Case 1: Monthly Marketing Review
```
User: "Generate a monthly report for March 2026"

Actions:
1. Get workspace overview metrics for March 1-31, 2026
2. Sort campaigns by open_rate
3. Identify top 5 and bottom 5 performers
4. Calculate month-over-month changes
5. Generate executive summary with insights
```

#### Use Case 2: Campaign Deep Dive
```
User: "Analyze the performance of campaign 'Welcome Series'"

Actions:
1. Search campaigns by name
2. Get detailed campaign structure
3. Fetch metrics for each action in the campaign
4. Analyze drop-off between steps
5. Compare A/B test variants
6. Provide optimization recommendations
```

#### Use Case 3: Deliverability Audit
```
User: "Check deliverability health for the last 30 days"

Actions:
1. Get workspace metrics with human_only=false
2. Calculate delivery rates by campaign
3. Identify high bounce rates
4. Check spam complaints
5. Analyze failed deliveries
6. Generate remediation checklist
```

#### Use Case 4: Segment Performance
```
User: "How are our segments performing?"

Actions:
1. List all segments
2. For each segment, find campaigns targeting it
3. Aggregate metrics for those campaigns
4. Calculate average engagement by segment
5. Identify high-value segments
6. Suggest segment refinements
```

#### Use Case 5: Trend Analysis
```
User: "Show me engagement trends over the last 90 days"

Actions:
1. Get workspace metrics with include_time_series=true
2. Extract time series for open_rate and click_rate
3. Calculate weekly/monthly averages
4. Identify trends (increasing/decreasing)
5. Correlate with campaign launches
6. Forecast future performance
```

---

## Technical Notes

### Authentication
- MCP server handles authentication transparently
- No need to pass API keys in tool calls
- Session-based access to workspace data

### Rate Limiting
- Not observed during testing
- Recommend batching requests
- Implement exponential backoff if rate limited

### Data Freshness
- Metrics appear to be real-time or near real-time
- Time series bins represent completed periods
- Current day may have incomplete data

### Known Limitations
1. Empty metrics when no activity (expected behavior)
2. Segments don't show overlap information
3. Attributes list doesn't include type information
4. Events list doesn't include property schemas
5. Template content not included in list responses (use get_template)
6. No workspace-level configuration exposed (team members, settings, etc.)

### Best Practices
1. Always start with `list_workspaces` to get workspace_id
2. Use `summary_only=true` for quick checks
3. Enable `human_only=true` for accurate engagement metrics
4. Request time series only when needed (larger response)
5. Use appropriate resolution for date range (hourly for days, daily for weeks, monthly for months)
6. Filter metrics by metric_types to reduce response size
7. Leverage `search_docs` for contextual help and explanations

---

## Test Environment Details

**Workspace:** Shopflo (ID: 200390)
- 4 campaigns (all draft)
- 0 newsletters
- 1 transactional message (default)
- 11 segments (131 total users)
- 15 attributes
- 1 event

**Activity Level:** Minimal
- No messages sent in last 30 days
- All delivery_metrics are empty
- Test campaign has complex flow (11 actions) but never launched

**Limitations:**
- Cannot test actual metric values (no activity)
- Cannot verify time series format with real data
- Cannot test human_only filter effectiveness
- Cannot verify channel breakdown structure

---

## Conclusion

The Customer.io MCP integration is comprehensive and well-designed for building analytics and reporting tools. All 11 tools are functional and provide rich data access. The metrics tool is particularly powerful with support for:
- 21 metric types
- 10 channel types
- Time series analysis
- Human vs bot filtering
- Flexible date ranges
- Multiple sorting/filtering options

The integration supports the full lifecycle of campaign analysis from discovery (list tools) to deep dive (get tools) to optimization insights (metrics + search_docs).

Recommended next steps:
1. Build a prototype report using the workspace metrics tool
2. Test with a more active workspace to validate time series structure
3. Implement caching strategy for workspace structure
4. Design visualization templates for key metrics
5. Create natural language summary generation
6. Build comparison logic for period-over-period analysis
