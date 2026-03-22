# Jira MCP Setup Guide

This guide helps you set up the official Atlassian Jira MCP (Model Context Protocol) server to use with the `jira-lifecycle-ideas` skill.

## What is Jira MCP?

The Atlassian Jira MCP server allows Claude to connect directly to your Jira workspace, enabling it to:
- Search and query issues using JQL (Jira Query Language)
- Read issue details, descriptions, and metadata
- Access project information and custom fields
- Discover workspace configuration

## Prerequisites

Before setting up Jira MCP, ensure you have:

- **Jira Cloud Account:** Access to an Atlassian Cloud workspace (Cloud only — Data Center requires API token auth, see below)
- **Claude Code:** Latest version installed on your machine

## Setup Steps

### Step 1: Add the Official Atlassian Remote MCP Server

Run this single command in your terminal:

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp
```

This registers the official Atlassian remote MCP server (no npm install required).

### Step 2: Authenticate via OAuth

1. Open Claude Code
2. Run `/mcp` in the chat
3. Select the `atlassian` server and follow the OAuth browser flow to grant access
4. Claude will now have access to your Jira and Confluence data with your existing permission controls

### Step 3: Verify the Connection

Test the connection by asking Claude:

```
List recent Jira issues from the last week
```

If Claude returns Jira issues, the connection is working!

---

### Alternative: API Token Auth (Data Center / no OAuth)

If you are on Jira Data Center or your admin has enabled API token auth, you can use the stdio-based server instead:

**1. Create a Jira API Token** at https://id.atlassian.com/manage-profile/security/api-tokens

**2. Add the server via CLI:**

```bash
claude mcp add --transport stdio atlassian \
  --env JIRA_URL=https://your-domain.atlassian.net \
  --env JIRA_EMAIL=your-email@example.com \
  --env JIRA_API_TOKEN=your-token-here \
  -- npx -y @atlassian/mcp-server-jira
```

### Step 4: (Optional) Filter to Specific Projects

The skill will automatically ask you to select projects when you run it (Step 2 of SKILL.md). However, you can also manually scope queries to specific projects by adding a JQL project filter:

```
project in (PROJ, PROD, FEAT) AND updated >= -14d
```

## Troubleshooting

### OAuth Flow Fails or Browser Doesn't Open

**Solutions:**
1. Run `/mcp` in Claude Code and manually trigger authentication for the `atlassian` server
2. Ensure you have a modern browser available to complete the OAuth flow
3. Check you're logged into the correct Atlassian account in your browser
4. Re-add the server: `claude mcp remove atlassian && claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp`

### MCP Server Not Found

**Error:** `mcp__atlassian__*` tools not available

**Solutions:**
1. Verify the server was added: `claude mcp list` — look for `atlassian`
2. Re-run the add command: `claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp`
3. Restart Claude Code after adding

### Permission Denied

**Error:** "403 Forbidden" or "You do not have permission to access this resource"

**Solutions:**
1. Re-authenticate via `/mcp` — your OAuth token may have expired
2. Verify your Jira account has permission to view the relevant projects
3. Contact your Jira administrator if you need broader project access

### No Issues Returned

**Error:** Claude says "No issues found" even though you know there are recent issues

**Solutions:**
1. Check your JQL syntax
2. Broaden the date range: `updated >= -30d`
3. Try a simpler query first with no filters
4. Confirm your account has access to the projects containing those issues

## Security Best Practices

**OAuth is Safer Than API Tokens:**
- The remote MCP uses OAuth 2.0 — no tokens to leak or rotate
- It respects all your existing Jira permission controls
- Revoke access anytime from your Atlassian account settings under Connected Apps

**Least Privilege:**
- Only access projects your account has permission for
- Avoid querying confidential projects unless authorized
- Follow your organization's security policies

## Testing Your Setup

Once configured, test the connection with these sample queries:

**Basic connectivity:**
```
Ask Claude: "List 5 recent Jira issues"
```

**Filtered query:**
```
Ask Claude: "Show me issues updated in the last 7 days with status 'Done'"
```

**Project-specific:**
```
Ask Claude: "List issues in project PROJ from the last 2 weeks"
```

**Using the skill:**
```
Ask Claude: "/jira-lifecycle-ideas"
```

## Getting Help

**Atlassian Remote MCP Documentation:**
- Setup guide: https://support.atlassian.com/rovo/docs/getting-started-with-the-atlassian-remote-mcp-server/
- Announcement: https://www.atlassian.com/blog/announcements/remote-mcp-server

**Claude Code Documentation:**
- MCP setup guide: https://code.claude.com/docs/en/mcp

**Jira API Documentation:**
- JQL reference: https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/

## Next Steps

Once your Jira MCP is configured and working:

1. ✅ Test the connection with simple queries
2. ✅ Run the `/jira-lifecycle-ideas` skill for the first time
3. ✅ Review the output and verify it matches your expectations
4. ✅ Customize the skill workflow if needed for your workspace
5. ✅ Share the skill with your marketing team

You're now ready to use the `jira-lifecycle-ideas` skill to discover launch opportunities and generate campaign ideas!
