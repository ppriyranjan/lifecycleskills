# Klaviyo MCP Setup Required

The Klaviyo MCP server is not connected. Follow these steps to set it up:

## Prerequisites

✓ You must have a **Klaviyo account** with API access
✓ A **private API key** with the required scopes

## Option A: Claude Desktop Built-in Connector (Simplest)

1. In Claude, navigate to **Settings > Connectors**
2. Click **Browse Connectors**
3. Search for **Klaviyo** and click **Connect**
4. Review Claude access and click **Approve**
5. Review Klaviyo account permissions and click **Allow**
6. Restart Claude Desktop

## Option B: Local MCP Server (Claude Desktop / Cursor / VS Code)

### Step 1: Create a Klaviyo API Key

1. Log in to Klaviyo
2. Navigate to **Settings > API Keys**
3. Click **Create Private API Key**
4. Enable these **read** scopes:
   - ☑ Accounts (Read)
   - ☑ Campaigns (Read)
   - ☑ Flows (Read)
   - ☑ Metrics (Read)
   - ☑ Profiles (Read)
   - ☑ Segments (Read)
   - ☑ Lists (Read)
5. Copy the generated key

### Step 2: Configure MCP Server

Add this to your Claude MCP configuration:

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "uvx",
      "args": ["klaviyo-mcp-server@latest"],
      "env": {
        "PRIVATE_API_KEY": "your-klaviyo-private-api-key",
        "READ_ONLY": "true"
      }
    }
  }
}
```

**Config file locations:**
- **Claude Desktop**: Settings > Developer > Edit Config
- **Cursor**: Settings > MCP config
- **VS Code**: Ctrl+Shift+P > Preferences: Open Settings (JSON)

### Step 3: Verify Connection

Restart Claude Desktop and try running the analytics skill again. If successful, you'll see your analytics report!

## Option C: Remote MCP Server (Streamable HTTP)

Klaviyo also offers a remote MCP server:

- **URL**: `https://mcp.klaviyo.com/mcp`
- **Authentication**: OAuth (dynamic client registration)
- **Read-only mode**: Add `?read-only=true` to the URL

## Required API Key Scopes

For full analytics, your API key needs these **read** scopes:

| Scope | Required For |
|-------|-------------|
| Accounts (Read) | Connection verification |
| Campaigns (Read) | Campaign list and details |
| Flows (Read) | Flow list and details |
| Metrics (Read) | Event and metric data |

## Need Help?

- Klaviyo MCP Documentation: https://developers.klaviyo.com/en/docs/klaviyo_mcp_server
- Klaviyo API Keys: https://www.klaviyo.com/settings/account/api-keys
- Package on PyPI: https://pypi.org/project/klaviyo-mcp-server/

---

Once setup is complete, I'll be able to automatically generate analytics reports when you ask about email performance!
