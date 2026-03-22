# Braze MCP Setup Required

The Braze MCP server is not connected. Follow these steps to set it up:

## Prerequisites

✓ Braze account with API access
✓ Terminal application
✓ `uv` command-line tool (Python dependency manager)

## Step 1: Install `uv`

### macOS/Linux:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Windows (PowerShell):
```powershell
irm https://astral.sh/uv/install.ps1 | iex
```

## Step 2: Create Braze API Key

1. Log in to your Braze workspace
2. Navigate to **Settings** > **APIs and Identifiers** > **API Keys**
3. Click **Create New API Key**
4. Give it a descriptive name (e.g., "MCP Server - Read Only")

### Important: Assign Read-Only Permissions

**Critical:** Create a dedicated API key specifically for MCP. Do NOT reuse existing API keys.

Assign permissions for these **38 read-only endpoints**:

**Campaigns & Canvas:**
- `/campaigns/list`
- `/campaigns/details`
- `/campaigns/data_series`
- `/canvas/list`
- `/canvas/details`
- `/canvas/data_series`
- `/canvas/data_summary`

**Analytics & KPIs:**
- `/events/list`
- `/events/data_series`
- `/kpi/new_users/data_series`
- `/kpi/dau/data_series`
- `/kpi/mau/data_series`
- `/kpi/uninstalls/data_series`
- `/sessions/data_series`
- `/sends/data_series`

**Purchases & Revenue:**
- `/purchases/product_list`
- `/purchases/revenue_series`
- `/purchases/quantity_series`

**Segments & Attributes:**
- `/segments/list`
- `/segments/details`
- `/segments/data_series`
- `/custom_attributes`

**Catalogs:**
- `/catalogs`
- `/catalogs/{catalog_name}/items`
- `/catalogs/{catalog_name}/items/{item_id}`

**Messages & Templates:**
- `/messages/scheduled_broadcasts`
- `/templates/email/list`
- `/templates/email/info`
- `/content_blocks/list`
- `/content_blocks/info`

**Subscription & Preferences:**
- `/subscription/status/get`
- `/subscription/user/status`
- `/preference_center/v1/{preference_center_external_id}/url/{user_id}`
- `/preference_center/v1/list`
- `/preference_center/v1/{preference_center_external_id}`

**Other:**
- `/events`
- Additional read-only, non-PII endpoints

## Step 3: Gather Connection Details

From the **API Keys** page, collect:

1. **API Key Identifier** - Copy the full API key
2. **REST Endpoint** - Note your workspace's regional REST endpoint

### Regional REST Endpoints

Your REST endpoint varies by region. Common endpoints:

- **US-01**: `https://rest.iad-01.braze.com`
- **US-02**: `https://rest.iad-02.braze.com`
- **US-03**: `https://rest.iad-03.braze.com`
- **US-04**: `https://rest.iad-04.braze.com`
- **US-05**: `https://rest.iad-05.braze.com`
- **US-06**: `https://rest.iad-06.braze.com`
- **US-07**: `https://rest.iad-07.braze.com`
- **US-08**: `https://rest.iad-08.braze.com`
- **EU-01**: `https://rest.fra-01.braze.eu`
- **EU-02**: `https://rest.fra-02.braze.eu`

**Find your endpoint** in Settings > APIs and Identifiers, or check your Braze dashboard URL.

## Step 4: Configure MCP Server

Add the Braze MCP server to your Claude configuration.

The server is available via PyPI:
```
braze-mcp-server
```

### Configuration Example

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "braze": {
      "command": "uvx",
      "args": ["braze-mcp-server"],
      "env": {
        "BRAZE_API_KEY": "your-api-key-here",
        "BRAZE_REST_ENDPOINT": "https://rest.iad-01.braze.com"
      }
    }
  }
}
```

Replace:
- `your-api-key-here` with your API key
- `https://rest.iad-01.braze.com` with your regional endpoint

## Step 5: Verify Connection

1. Restart Claude Desktop/CLI
2. Try running the analytics skill again
3. If successful, you'll see your analytics report!

## Security Best Practices

- **Never** reuse existing API keys - create a dedicated one for MCP
- **Only** assign read-only, non-PII permissions
- **Never** share your API key in code or public repositories
- **Rotate** API keys periodically for security
- **Monitor** API key usage in Braze dashboard

## Troubleshooting

### "Connection failed"
- Verify API key is correct and copied completely
- Check that REST endpoint matches your workspace region
- Ensure `uv` is installed and accessible in your PATH

### "Permission denied"
- Verify all 38 read-only endpoints are enabled for the API key
- Check that the API key is active (not archived)
- Confirm you created a new key (not reusing an old one)

### "No data returned"
- Ensure you have campaigns or Canvases with send history
- Try a different date range
- Verify campaigns are not archived

### "Regional endpoint error"
- Double-check your REST endpoint matches your workspace
- Visit Settings > APIs and Identifiers to confirm
- Common issue: using US endpoint for EU workspace or vice versa

## Need Help?

- Braze MCP Documentation: https://www.braze.com/docs/user_guide/brazeai/mcp_server
- Setup Guide: https://www.braze.com/docs/user_guide/brazeai/mcp_server/setup
- API Functions: https://www.braze.com/docs/user_guide/brazeai/mcp_server/available_api_functions
- PyPI Package: https://pypi.org/project/braze-mcp-server/
- Feedback: [[email protected]](/cdn-cgi/l/email-protection)

---

Once setup is complete, I'll be able to automatically generate analytics reports when you ask about campaign performance!

**Note**: The Braze MCP Server is currently in **beta**. All customers have access.
