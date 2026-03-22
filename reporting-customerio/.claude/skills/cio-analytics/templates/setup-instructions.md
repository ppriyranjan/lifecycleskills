# Customer.io MCP Setup Required

The Customer.io MCP server is not connected. Follow these steps to set it up:

## Prerequisites

✓ You must be an **account admin** in Customer.io
✓ Access to Customer.io settings

## Step 1: Enable MCP in Customer.io

1. Log in to Customer.io
2. Navigate to **Settings > Privacy, Data, & AI**
3. Enable these two settings:
   - ☑ **"Customer.io AI"**
   - ☑ **"Customer.io MCP"**
4. Save changes

## Step 2: Identify Your Region

Check your Customer.io URL to determine your region:

- `app.customer.io` → **US Region**
- `app-eu.customer.io` → **EU Region**

## Step 3: Configure MCP Server

Add the Customer.io MCP server to your Claude configuration:

**US Region:**
```
https://mcp.customer.io/mcp
```

**EU Region:**
```
https://mcp-eu.customer.io/mcp
```

## Step 4: Authenticate

Follow the OAuth authentication flow when prompted.

## Step 5: Verify Connection

Restart Claude Desktop and try running the analytics skill again. If successful, you'll see your analytics report!

## Need Help?

- Customer.io MCP Documentation: https://docs.customer.io/ai/mcp-server/
- Check that you're an account admin
- Verify both AI and MCP settings are enabled
- Ensure you're using the correct regional URL

---

Once setup is complete, I'll be able to automatically generate analytics reports when you ask about email performance!
