# Braze Analytics Skill (`/braze-analytics`)

> **Beta**: Built against Braze's AI/MCP Server, which is currently in beta. If you run into unexpected behavior, reach out to priy@sortment.com.

Generates a Braze email performance report with deliverability metrics, engagement rates, campaign and Canvas breakdowns, and AI-powered insights — for any date range you choose.

---

## When to use this

- You want a quick health check on Braze email or Canvas performance
- You're preparing a weekly or monthly report for stakeholders
- You want to compare this period's metrics against the previous one
- You want to identify which campaigns or Canvases deserve attention

## What you get

A full markdown report with:

- **Executive summary** — AI-generated overview of the most important takeaways
- **Deliverability** — Sends, delivered, bounced, spam reports; with rates and period-over-period change
- **Engagement** — Unique opens, unique clicks, click-to-open, unsubscribes; with trends
- **Canvas analytics** — Multi-step journey performance and conversion tracking (if you use Canvases)
- **Top 10 campaigns** — Unique open rate, click rate per campaign, with trend indicators
- **AI insights** — Key patterns, what changed, and 3 specific recommended actions
- **Campaign spotlight** — One or two campaigns or Canvases to replicate or fix

## How to invoke it

```
/braze-analytics                      # Last 7 days vs previous 7 days (default)
/braze-analytics 30d                  # Last 30 days vs previous 30 days
/braze-analytics Welcome Campaign     # Focus on a specific campaign
```

You can also just ask in plain language:
- "How are our Braze campaigns performing?"
- "Show me email metrics for last month"
- "Any deliverability issues in Braze this week?"

## What you need first

- Braze MCP server connected to Claude
- A Braze API key with **read-only permissions** (38 specific endpoints required — see setup guide)
- The correct **regional REST endpoint** for your Braze instance (found in Settings → APIs and Identifiers)

If the MCP isn't connected, the skill will display setup instructions automatically.

## Setup tips

When creating your Braze API key for MCP:
- Create a dedicated key (don't reuse existing ones)
- Read-only permissions are sufficient — this skill only reads data
- Make sure you select your correct regional endpoint during MCP setup

## Troubleshooting

**"Invalid API key"** — Verify the key has all 38 required read-only endpoints assigned and was created specifically for MCP.

**"Regional endpoint error"** — Check Settings → APIs and Identifiers in Braze for your correct REST endpoint (e.g. `rest.iad-01.braze.com`).

**"No data for period"** — Check that campaigns sent during this period exist, or try a wider date range.

**MCP setup help** — See `templates/setup-instructions.md` or the [Braze MCP setup guide](https://www.braze.com/docs/user_guide/brazeai/mcp_server/setup).
