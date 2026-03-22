# Customer.io MCP Exploration Checklist

## Connection Status
✅ **CONNECTED** - `customerio: https://mcp.customer.io/mcp (HTTP) - ✓ Connected`

## Tools to Test

Based on the documentation, these tools should be available:

### 1. `list_workspaces`
**Purpose**: Identify accessible workspaces
**Test**: Call with no parameters
**Expected Output**: List of workspace IDs and names
**Document**:
- Workspace ID format
- Any metadata included

### 2. `list`
**Purpose**: Enumerate workspace resources and metadata
**Test Parameters**:
- List campaigns
- List segments
- List newsletters
**Expected Output**: Campaign/segment/newsletter details
**Document**:
- Campaign ID format
- Campaign names
- Campaign status (active, draft, etc.)
- Any other metadata (created date, last sent, etc.)

### 3. `metrics`
**Purpose**: Fetch performance and deliverability data
**Critical for our analytics skill**

#### Test Cases:

**A. Workspace-level metrics**
```
Parameters to try:
- No campaign ID (overall metrics)
- Date range parameters
```

**B. Campaign-level metrics**
```
Parameters to try:
- Specific campaign ID
- Date range: today
- Date range: yesterday
- Date range: last 7 days
- Date range: last 30 days
- Custom date range
```

**C. Metric types to look for:**
- **Deliverability**:
  - sent_count
  - delivered_count
  - bounced_count (hard/soft)
  - spam_reports
  - delivery_rate

- **Engagement**:
  - opened_count
  - unique_opens
  - clicked_count
  - unique_clicks
  - open_rate
  - click_rate
  - click_to_open_rate

- **Conversions**:
  - conversions
  - conversion_rate
  - revenue (if available)

- **List Health**:
  - unsubscribed_count
  - unsubscribe_rate

**D. Date range format**
```
Document what format is accepted:
- ISO 8601 timestamps?
- Unix timestamps?
- Date strings (YYYY-MM-DD)?
- Relative dates ("today", "yesterday")?
```

### 4. `get`
**Purpose**: Retrieve individual resources
**Test**: Get specific campaign details
**Document**: What additional info is available beyond `list`

### 5. `search`
**Purpose**: Query documentation and workspace data
**Test**: Search for specific campaigns or metrics
**Document**: Search syntax and capabilities

---

## Questions to Answer

1. **Can we query metrics by date range?**
   - What's the smallest granularity? (hourly, daily?)
   - What's the maximum lookback period?

2. **Can we compare time periods?**
   - Do we need to make multiple calls?
   - Or is there a comparison feature built-in?

3. **Pro-rating for partial periods:**
   - If we want "this week vs last week" on a Wednesday, can we get partial week data?
   - Do we need to calculate pro-rated metrics ourselves?

4. **Campaign filtering:**
   - Can we get metrics for all campaigns at once?
   - Or do we need individual calls per campaign?
   - Is there a batch API?

5. **Rate limits:**
   - Are there any rate limits we need to be aware of?
   - Should we implement caching?

---

## Next Steps

1. Run actual test calls to the MCP
2. Document the exact request/response format
3. Create sample data structures
4. Move to design doc phase (Phase B)
