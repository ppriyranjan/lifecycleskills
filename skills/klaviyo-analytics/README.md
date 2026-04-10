# Klaviyo Analytics Skill (`/klaviyo-analytics`)

Generates a Klaviyo email performance report with deliverability metrics, engagement rates, campaign breakdowns, flow performance, revenue tracking, and AI-powered insights — for any date range you choose.

---

## When to use this

- You want a quick health check on how emails are performing in Klaviyo
- You're preparing a weekly or monthly report for stakeholders
- Open rates, click rates, or deliverability have changed and you want to understand why
- You want to see which campaigns and flows are driving the most engagement and revenue
- You need to monitor spam complaint rates and list health

## What you get

A full markdown report with:

- **Executive summary** — AI-generated overview of the most important takeaways
- **Deliverability** — Recipients, delivered, bounced, spam complaints; with rates and period-over-period change
- **Engagement** — Unique opens, clicks, click-to-open, conversions, unsubscribes; with trends
- **Revenue** — Total revenue and revenue per recipient from campaigns
- **Top 10 campaigns** — Open rate, click rate, conversion rate, and revenue per campaign, with trend indicators
- **Flow performance** — Automated flow metrics including opens, clicks, conversions, and revenue
- **AI insights** — Key patterns, what changed, and 3 specific recommended actions
- **Campaign spotlight** — One or two campaigns to replicate or fix

## How to invoke it

```
/klaviyo-analytics                        # Last 7 days vs previous 7 days (default)
/klaviyo-analytics 30d                    # Last 30 days vs previous 30 days
/klaviyo-analytics March 1 to March 15   # Custom date range
```

You can also just ask in plain language:
- "How are our Klaviyo emails doing?"
- "Show me campaign metrics for last month"
- "Any deliverability issues this week?"
- "What revenue are our flows generating?"

## What you need first

- Klaviyo MCP server connected to Claude
- A Klaviyo account with a private API key (with read scopes for Accounts, Campaigns, Flows, Metrics, and Reporting)
- At least one account with campaigns that have sent email

If the MCP isn't connected, the skill will display setup instructions automatically.

## Troubleshooting

**"No data for period"** — Check that campaigns sent during this period exist, or try a wider date range.

**"Account not found"** — Verify MCP is authenticated and your API key has the required scopes.

**"Flow data unavailable"** — Ensure your API key includes Flows (Read) scope. Flow reporting may not be available for all account tiers.

**MCP setup help** — See `templates/setup-instructions.md` or the [Klaviyo MCP docs](https://developers.klaviyo.com/en/docs/klaviyo_mcp_server).
