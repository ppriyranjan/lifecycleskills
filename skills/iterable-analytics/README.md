# Iterable Analytics Skill (`/iterable-analytics`)

> **Beta**: Built against Iterable's MCP Server, which is currently in beta. This skill has been developed based on official Iterable MCP documentation but is looking for real-world testers. If you'd like to help, reach out to priy@sortment.com.

Generates an Iterable campaign performance report with deliverability metrics, engagement rates, and AI-powered insights — for any date range you choose.

---

## When to use this

- You want a health check on Iterable campaign performance
- You want to compare this week's or month's metrics against the previous period
- You want to identify which campaigns are performing best or need attention

## What you get

A full markdown report with:

- **Executive summary** — AI-generated overview of the most important takeaways
- **Deliverability** — Sent, delivered, bounced; with rates and period-over-period change
- **Engagement** — Opens, clicks, conversions, unsubscribes (unique and total); with trends
- **Top 10 campaigns** — Open rate, click rate, and conversion rate per campaign, with trend indicators
- **AI insights** — Key patterns, what changed, and 3 specific recommended actions

## How to invoke it

```
/iterable-analytics               # Last 7 days vs previous 7 days (default)
/iterable-analytics 30d           # Last 30 days vs previous 30 days
/iterable-analytics Welcome Email # Focus on a specific campaign
```

You can also just ask in plain language:
- "How are our Iterable campaigns doing?"
- "Compare this week's email metrics to last week"
- "Show campaign performance for last month"

## What you need first

- Node.js v20 or later
- Iterable MCP Server installed and connected
- An Iterable API key (read-only is sufficient)

### Setting up the Iterable MCP Server

Run the setup wizard:

```bash
npx @iterable/mcp setup
```

For Claude Code specifically:
```bash
npx @iterable/mcp setup --claude-code
```

Your API key is stored in `~/.iterable-mcp/keys.json`. To manage keys later:
```bash
npx @iterable/mcp keys add       # Add a new key
npx @iterable/mcp keys list      # See all keys
npx @iterable/mcp keys activate  # Switch active key
```

After setup, restart Claude Code and verify the Iterable MCP appears in your tools.

## Good to know

- **Rate limits**: Iterable's MCP uses the same rate limits as their regular API. If you hit a 429, wait a moment and try again — it won't retry automatically.
- **Read-only**: This skill only reads data; read-only API key permissions are sufficient.
- **Privacy**: Query data doesn't persist on Iterable's MCP Server beyond your current session.
- **Test first**: If you're new to this, try it against a sandbox project before your production workspace.

## Troubleshooting

**"No data for period"** — Check that campaigns sent during this period exist, or try a wider date range.

**"429 Too Many Requests"** — Wait a moment before retrying. Consider analyzing a shorter date range.

**MCP not connecting** — Restart Claude Code after running the setup wizard. Verify the MCP appears in developer/tool settings.

**MCP setup help** — See `templates/setup-instructions.md` or the [Iterable MCP documentation](https://support.iterable.com/hc/en-us/sections/42199521022228-Iterable-s-MCP-Server).
