---
name: test-cio-mcp
description: Test Customer.io MCP integration and explore available metrics data
disable-model-invocation: true
---

You are testing the Customer.io MCP integration to understand what data is available for building the analytics report skill.

## Step 1: Check MCP Connection

First, try to list available workspaces to verify the MCP is connected:
- Attempt to use the Customer.io MCP
- If the connection fails, provide setup instructions

## Step 2: Explore Available Data

If connected, systematically test these capabilities:

1. **List Workspaces**: What workspaces are accessible?
2. **List Campaigns**: Get all available campaigns with IDs and names
3. **Fetch Metrics**: Try the `metrics` tool with different parameters:
   - Overall workspace metrics
   - Campaign-specific metrics
   - Time-based queries (today, yesterday, last 7 days, last 30 days)
   - Check what date range parameters are supported

## Step 3: Document Data Structure

For each successful API call, show:
- The exact parameters used
- The complete data structure returned
- Available fields and their data types
- Any date/time formats used

## Step 4: Report Findings

Create a summary report with:
- ✅ What works
- ❌ What doesn't work or has limitations
- 📊 Available metrics (deliverability, engagement, etc.)
- 🎯 Recommended approach for the full analytics skill

---

## Customer.io MCP Setup Instructions

If the MCP is not set up, provide these instructions:

### Prerequisites
1. Must be an **account admin** in Customer.io
2. Enable both settings in **Settings > Privacy, Data, & AI**:
   - "Customer.io AI"
   - "Customer.io MCP"

### Regional URLs
Choose based on your Customer.io region:
- **US**: `https://mcp.customer.io/mcp`
- **EU**: `https://mcp-eu.customer.io/mcp`

### Claude Desktop Setup
1. Open Claude Desktop settings/preferences
2. Navigate to MCP servers configuration
3. Add the Customer.io MCP server with your regional URL
4. Complete OAuth authentication
5. Restart Claude Desktop

### Verification
Run this test skill again after setup to verify the connection.
