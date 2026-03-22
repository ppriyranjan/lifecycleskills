# Customer.io Analytics Skill (`/cio-analytics`)

Generates a Customer.io email performance report with deliverability metrics, engagement rates, campaign breakdowns, and AI-powered insights — for any date range you choose.

---

## When to use this

- You want a quick health check on how emails are performing
- You're preparing a weekly or monthly report for stakeholders
- Open rates, click rates, or deliverability have changed and you want to understand why
- You want to see which campaigns are driving the most (or least) engagement

## What you get

A full markdown report with:

- **Executive summary** — AI-generated overview of the most important takeaways
- **Deliverability** — Sent, delivered, bounced, failed; with rates and period-over-period change
- **Engagement** — Human-only opens, clicks, click-to-open, conversions, unsubscribes; with trends
- **Bot activity** — Machine opens/clicks shown separately for context
- **Top 10 campaigns** — Open rate, click rate, and conversion rate per campaign, with trend indicators
- **AI insights** — Key patterns, what changed, and 3 specific recommended actions
- **Campaign spotlight** — One or two campaigns to replicate or fix

## How to invoke it

```
/cio-analytics                        # Last 7 days vs previous 7 days (default)
/cio-analytics 30d                    # Last 30 days vs previous 30 days
/cio-analytics March 1 to March 15   # Custom date range
```

You can also just ask in plain language:
- "How are our emails doing?"
- "Show me campaign metrics for last month"
- "Any deliverability issues this week?"

## What you need first

- Customer.io MCP server connected to Claude
- Admin access to your Customer.io workspace
- At least one workspace with campaigns that have sent email

If the MCP isn't connected, the skill will display setup instructions automatically.

## Troubleshooting

**"No data for period"** — Check that campaigns sent during this period exist, or try a wider date range.

**"Workspace not found"** — Verify MCP is authenticated and you have access to the workspace.

**MCP setup help** — See `templates/setup-instructions.md` or the [Customer.io MCP docs](https://docs.customer.io/ai/mcp-server/).
