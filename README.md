# Lifecycle Marketing Skills for Claude Code

Claude skills for lifecycle marketing teams. 

Made by [Lifecycle Luminaries](https://www.lifecycleluminaries.com/) and [Sortment](https://sortment.com/)

## Skills at a Glance

| Skill | What it does | Use when... |
|-------|-------------|-------------|
| [`/jira-lifecycle-ideas`](#jira-lifecycle-ideas) | Turns recent Jira launches into lifecycle campaign ideas | Planning campaigns around new features |
| [`/cio-analytics`](#esp-analytics) | Analyzes Customer.io performance | You use Customer.io and want a performance report |
| [`/klaviyo-analytics`](#esp-analytics) | Analyzes Klaviyo performance | You use Klaviyo and want a performance report |
| [`/braze-analytics`](#esp-analytics) | Analyzes Braze performance | You use Braze and want a performance report |
| [`/iterable-analytics`](#esp-analytics) | Analyzes Iterable performance | You use Iterable and want a performance report |

---

## Installation

### Claude CoWork

> Requires a paid plan (Pro, Max, Team, or Enterprise).

1. Open the **Cowork** tab in Claude Desktop
2. Click **Customize** in the left sidebar
3. Click the **+** next to **Personal plugins**
4. Click on Create Plugin and then on Add Marketplace
5. Enter the GitHub repo/url: `ppriyranjan/lifecycleskills` and press Sync
6. Connect the tools each skill needs:
   - Go to **Customize → Connectors**
   - Add the relevant connector (e.g. Atlassian for Jira, Customer.io, Klaviyo, Braze) and authenticate
   - For Iterable, you will need to connect to their MCP server. [Docs](https://support.iterable.com/hc/en-us/articles/42936790497812-Setting-up-Iterable-s-MCP-Server)
6. Skills are now available — type the slash command (e.g. `/cio-analytics`) in any conversation

---

## Skills

### jira-lifecycle-ideas

**What it does**: Scans your Jira projects for features shipped in the last 2 weeks and generates specific lifecycle marketing campaign ideas for each one — including suggested channels, timing, and target segments.

**Use this when:**
- You're planning your weekly or biweekly campaign calendar
- A product launch just happened and you need marketing ideas fast
- You want to make sure no shipped features go without outreach

**What you get:** A prioritized list of campaign ideas, each with a target segment, recommended channel (email, push, in-app), suggested timing, and success metrics.

**Invoke it:**
```
/jira-lifecycle-ideas
```

**Needs:** Atlassian Jira MCP connected. See [skills/jira-lifecycle-ideas/SKILL.md](skills/jira-lifecycle-ideas/SKILL.md) for setup.

---

### ESP Analytics

Pulls campaign and deliverability data from your ESP and generates a performance report with period-over-period comparisons and AI-generated insights. Pick the skill that matches your ESP:

| ESP | Skill | Status |
|-----|-------|--------|
| Customer.io | `/cio-analytics` | Stable |
| Klaviyo | `/klaviyo-analytics` | Stable |
| Braze | `/braze-analytics` | Stable |
| Iterable | `/iterable-analytics` | Beta |

**Use this when:**
- You want a quick health check on email performance
- You're preparing a weekly or monthly metrics report
- You're investigating a deliverability or engagement drop
- You want to know which campaigns are performing best or worst

**What you get:** A report covering deliverability rates, engagement metrics (opens, clicks), top campaigns by volume, trend indicators, and specific recommended actions. Klaviyo reports also include flow performance and revenue metrics.

**Invoke it:**
```
/cio-analytics            # Last 7 days vs previous 7 days
/cio-analytics 30d        # Last 30 days vs previous 30 days
/klaviyo-analytics        # Last 7 days vs previous 7 days
/klaviyo-analytics 30d    # Last 30 days vs previous 30 days
/braze-analytics          # Last 7 days vs previous 7 days
/braze-analytics Welcome Campaign   # Focus on a specific campaign
/iterable-analytics 30d   # Last 30 days
```

**Needs:** The MCP connector for your ESP.

---

## Which skill should I use?

- **I want campaign ideas from recent product work** → `/jira-lifecycle-ideas`
- **I use Customer.io** → `/cio-analytics`
- **I use Klaviyo** → `/klaviyo-analytics`
- **I use Braze** → `/braze-analytics`
- **I use Iterable** → `/iterable-analytics`
- **I want all the analytics skills** → install them all; they only run when invoked or when you ask about that specific platform
