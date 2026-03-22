# Iterable MCP Setup Required

The Iterable MCP server is not connected. Follow these steps to set it up:

## Prerequisites

✓ **Node.js** version 20 or later (v22 LTS recommended)
✓ **Iterable API key** with read permissions
✓ Access to an Iterable project
✓ A desktop AI client that supports MCP (Claude Desktop, Claude Code, or Cursor)

**Note**: Web-based clients like chatgpt.com, gemini.google.com, and claude.ai cannot connect to local MCP servers.

## Step 1: Install Iterable MCP Server

Run the interactive setup wizard:

```bash
npx @iterable/mcp setup
```

**For Claude Code specifically:**
```bash
npx @iterable/mcp setup --claude-code
```

**For auto-updating to latest version on each restart:**
```bash
npx @iterable/mcp setup --auto-update
```

By default, the setup wizard configures the server in **safe, read-only mode** (no PII tools, no writes, no sends). This is perfect for analytics!

## Step 2: Add Your API Key

During setup, you'll be prompted to add your Iterable API key.

Your API key will be securely stored in `~/.iterable-mcp/keys.json` with values encrypted using:
- **macOS**: Keychain
- **Windows**: DPAPI
- **Linux**: File permissions

### Managing API Keys Later

```bash
npx @iterable/mcp keys add          # Add new key (interactive)
npx @iterable/mcp keys list         # Display all keys, marking active one
npx @iterable/mcp keys activate     # Switch between stored keys
npx @iterable/mcp keys update       # Modify existing key
npx @iterable/mcp keys delete       # Remove a key by ID
```

Only one key is active at a time. The server automatically uses the currently active key.

## Step 3: Configure Your AI Client

### Claude Code (Automatic)

If you used `--claude-code` flag, configuration is automatic. Otherwise, manually edit `~/.claude.json`:

```json
{
  "mcpServers": {
    "iterable": {
      "command": "npx",
      "args": ["-y", "@iterable/mcp"]
    }
  }
}
```

### Claude Desktop

Edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add:
```json
{
  "mcpServers": {
    "iterable": {
      "command": "npx",
      "args": ["-y", "@iterable/mcp"]
    }
  }
}
```

### Cursor

Edit `~/.cursor/config.json` with the same JSON structure as above.

## Step 4: Restart Your AI Client

After configuration, restart Claude Desktop, Claude Code, or Cursor completely.

## Step 5: Verify Connection

Check that Iterable's MCP Server is running:

**In Claude Desktop:**
1. Go to **Claude > Settings > Developer**
2. Look for Iterable in the MCP servers list

**In Cursor:**
1. Go to **Cursor > Settings > Cursor Settings… > Tools**
2. Verify Iterable appears in the tools list

**In Claude Code:**
Check the MCP status in your session

## Step 6: Test the Connection

Try a simple query to validate setup:

```
"List my Iterable templates"
```

or

```
"Get details on campaign 12345"
```

If you see results, congratulations! You're connected.

## Troubleshooting

### "Command not found: npx"
- Install or update Node.js (v20+ required, v22 LTS recommended)
- Download from: https://nodejs.org/

### "API key invalid"
- Verify you're using the correct API key from your Iterable project
- Ensure the key has read permissions
- Check that you're using the right region (US vs EU)

### "No campaigns found"
- Verify you have access to the Iterable project
- Check that campaigns exist in the project
- Try a different API key or project

### "Tool not available"
- Ensure you restarted your AI client after setup
- Check configuration file has correct JSON format
- Verify `~/.iterable-mcp/keys.json` exists and has an active key

### Rate Limit Errors (429)
- Iterable's API has rate limits shared across all API consumers
- Wait a moment before trying again
- The MCP server does not automatically retry rate-limited requests

## Important Notes

**Beta Status**: Iterable's MCP Server is currently in beta. MCP functionality may change, be suspended, or be discontinued at any time without notice.

**Privacy**: Project data related to queries doesn't persist on Iterable's MCP Server; responses are available only for your current AI session.

**Permissions**: For analytics, you only need read-only access. The default setup is perfect for this use case.

**Sandbox First**: We highly recommend testing in a sandbox or demo Iterable project before using in production.

## Need More Help?

- **Iterable MCP Documentation**: https://support.iterable.com/hc/en-us/sections/42199521022228-Iterable-s-MCP-Server
- **Setup Guide**: https://support.iterable.com/hc/en-us/articles/42936790497812-Setting-up-Iterable-s-MCP-Server
- **GitHub Repository**: https://github.com/Iterable/mcp-server
- **API Keys Guide**: https://support.iterable.com/hc/en-us/articles/360043464871-API-Keys

---

Once setup is complete, I'll be able to automatically generate analytics reports when you ask about email performance!
