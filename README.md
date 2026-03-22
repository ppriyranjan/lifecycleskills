# Lifecycle Marketing Skills for Claude Code

Claude Code skills for lifecycle marketing teams. Each skill connects to your marketing tools via MCP and automates a common analysis or planning task.

## Skills at a Glance

| Skill | What it does | Use when... |
|-------|-------------|-------------|
| [`/jira-lifecycle-ideas`](#jira-lifecycle-ideas) | Turns recent Jira launches into lifecycle campaign ideas | Planning campaigns around new features |
| [`/cio-analytics`](#cio-analytics) | Analyzes Customer.io email performance | You use Customer.io and want a performance report |
| [`/braze-analytics`](#braze-analytics) | Analyzes Braze campaign and Canvas performance | You use Braze and want a performance report |
| [`/iterable-analytics`](#iterable-analytics) | Analyzes Iterable campaign performance | You use Iterable and want a performance report *(beta)* |

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

### cio-analytics

**What it does**: Pulls deliverability and engagement data from your Customer.io workspace and generates a full performance report with period-over-period comparisons and AI-generated insights.

**Use this when:**
- You want a quick health check on email performance
- You're preparing a weekly or monthly metrics report
- You're investigating a deliverability or engagement drop
- You want to know which campaigns are performing best or worst

**What you get:** A report covering deliverability rates, human engagement (bot-filtered), top 10 campaigns by volume, trend indicators, and specific recommended actions.

**Invoke it:**
```
/cio-analytics            # Last 7 days vs previous 7 days
/cio-analytics 30d        # Last 30 days vs previous 30 days
/cio-analytics March 1 to March 15   # Custom date range
```

**Needs:** Customer.io MCP connected. See [skills/cio-analytics/SKILL.md](skills/cio-analytics/SKILL.md) for setup.

---

### braze-analytics

**What it does**: Pulls campaign and Canvas data from Braze and generates a performance report with period-over-period comparisons and AI-generated insights.

**Use this when:**
- You want a health check on Braze email performance
- You want to see how Canvases (multi-step journeys) are performing
- You're preparing a campaign performance report for stakeholders

**What you get:** A report covering deliverability, unique opens/clicks, Canvas analytics, top campaigns by volume, and actionable recommendations.

**Invoke it:**
```
/braze-analytics          # Last 7 days vs previous 7 days
/braze-analytics 30d      # Last 30 days
/braze-analytics Welcome Campaign   # Focus on a specific campaign
```

**Needs:** Braze MCP connected with a read-only API key. See [skills/braze-analytics/SKILL.md](skills/braze-analytics/SKILL.md) for setup.

---

### iterable-analytics

**What it does**: Pulls campaign data from Iterable and generates a performance report with period-over-period comparisons and AI-generated insights.

> **Beta**: Built against Iterable's MCP Server, which is currently in beta. Looking for testers — reach out to priy@sortment.com if you'd like to help.

**Use this when:**
- You want a health check on Iterable campaign performance
- You want to compare this week's metrics to last week

**What you get:** A report covering deliverability, open/click/conversion rates, top campaigns, and AI-generated insights.

**Invoke it:**
```
/iterable-analytics        # Last 7 days vs previous 7 days
/iterable-analytics 30d    # Last 30 days
```

**Needs:** Iterable MCP Server configured. See [skills/iterable-analytics/SKILL.md](skills/iterable-analytics/SKILL.md) for setup.

---

## Installation

### Claude CoWork

1. Go to **Settings → Plugins** in your CoWork workspace
2. Click **Browse Marketplace** and search for `lifecycle-marketing-skills`
3. Click **Install** on the plugin card by `ppriyranjan`
4. Configure MCP connections under **Settings → Integrations** for whichever tools you use
5. Skills are immediately available — type the skill command in any conversation

### From GitHub Marketplace

```bash
claude plugin marketplace add ppriyranjan/lifecycleskills
claude plugin install lifecycle-marketing-skills@ppriyranjan-lifecycleskills
```

### Local Development

```bash
git clone https://github.com/ppriyranjan/lifecycleskills.git
cd lifecycleskills
claude --plugin-dir .
```

---

## Which skill should I use?

- **I want campaign ideas from recent product work** → `/jira-lifecycle-ideas`
- **I use Customer.io** → `/cio-analytics`
- **I use Braze** → `/braze-analytics`
- **I use Iterable** → `/iterable-analytics`
- **I want all the analytics skills** → install them all; they only run when invoked or when you ask about that specific platform
