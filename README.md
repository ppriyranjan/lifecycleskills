# Lifecycle Marketing Skills for Claude Code

A collection of Claude Code skills designed for lifecycle marketing teams using Customer.io and Jira.

## Overview

This plugin provides two powerful skills that help marketing teams:
- **Generate lifecycle marketing campaigns** from recently launched product features in Jira
- **Analyze Customer.io email performance** with comprehensive deliverability and engagement metrics

## Installation

### From GitHub (recommended for public distribution)

```bash
claude plugin install github:ppriyranjan/lifecycle-marketing-skills
```

### Local Development

```bash
# Clone this repository
git clone https://github.com/ppriyranjan/lifecycle-marketing-skills.git
cd lifecycle-marketing-skills

# Use with --plugin-dir flag
claude --plugin-dir .
```

## Skills Included

### 1. Jira Lifecycle Ideas (`/jira-lifecycle-ideas`)

Discovers recently launched product features from Jira and generates targeted lifecycle marketing campaign ideas.

**Use when:**
- Planning weekly or biweekly marketing campaigns
- Discovering new product launches that need marketing support
- Identifying features that could benefit from targeted outreach
- Creating data-driven lifecycle marketing strategies

**What it does:**
1. Connects to your Jira workspace via MCP
2. Discovers product features launched in the last 2 weeks
3. Assesses each feature's relevance for lifecycle marketing
4. Generates specific, actionable campaign ideas with channels, timing, and target segments
5. Prioritizes opportunities by marketing impact

**Prerequisites:**
- Atlassian Jira MCP server configured (see setup instructions below)

**Usage:**
```bash
# In Claude Code
/jira-lifecycle-ideas
```

**Output:** Comprehensive markdown report with campaign ideas, target segments, channels, timelines, and success metrics.

**Learn more:** See [skills/jira-lifecycle-ideas/SKILL.md](skills/jira-lifecycle-ideas/SKILL.md)

---

### 2. Customer.io Analytics (`/cio-analytics`)

Generates comprehensive Customer.io analytics reports with deliverability, engagement, and campaign performance metrics.

**Use when:**
- Analyzing email performance
- Reviewing campaign results
- Investigating deliverability issues
- Understanding open/click rates and engagement trends
- Comparing period-over-period performance

**What it does:**
1. Connects to your Customer.io workspace via MCP
2. Fetches metrics for current and previous periods (7-day or 30-day)
3. Calculates deliverability rates, engagement rates, bot activity percentages
4. Analyzes top campaigns by volume
5. Generates AI-powered insights and recommendations

**Prerequisites:**
- Customer.io MCP server configured (see setup instructions below)

**Usage:**
```bash
# In Claude Code - analyzes last 7 days vs previous 7 days
/cio-analytics

# Analyze last 30 days
/cio-analytics 30d

# Custom date range
/cio-analytics March 1 to March 15
```

**Output:** Comprehensive analytics report with deliverability metrics, engagement metrics, campaign performance, AI insights, and actionable recommendations.

**Learn more:** See [skills/cio-analytics/SKILL.md](skills/cio-analytics/SKILL.md)

---

## Setup Instructions

### Setting up Atlassian Jira MCP (for jira-lifecycle-ideas)

```bash
# Add the official Atlassian MCP server
claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp

# Complete OAuth authentication
/mcp
```

For detailed setup instructions, see [skills/jira-lifecycle-ideas/JIRA_SETUP.md](skills/jira-lifecycle-ideas/JIRA_SETUP.md)

### Setting up Customer.io MCP (for cio-analytics)

The Customer.io MCP server should already be available if you're using Claude Code with Customer.io integration. If not configured:

1. Verify the MCP server is installed: `/mcp list`
2. Follow Customer.io's MCP setup documentation
3. Ensure you have workspace access permissions

For detailed setup instructions, see [skills/cio-analytics/templates/setup-instructions.md](skills/cio-analytics/templates/setup-instructions.md)

---

## Directory Structure

```
lifecycle-marketing-skills/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── skills/
│   ├── jira-lifecycle-ideas/
│   │   ├── SKILL.md             # Main skill definition
│   │   ├── CAMPAIGN_TEMPLATES.md # Campaign templates
│   │   ├── LIFECYCLE_FRAMEWORK.md # Marketing relevance framework
│   │   └── JIRA_SETUP.md        # Setup instructions
│   └── cio-analytics/
│       ├── SKILL.md             # Main skill definition
│       ├── README.md            # Skill documentation
│       ├── lib/                 # Helper scripts
│       └── templates/           # Report templates
├── README.md                    # This file
└── LICENSE                      # MIT License
```

## Contributing

Contributions are welcome! If you'd like to add new skills or improve existing ones:

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- Open an issue on GitHub
- Check individual skill documentation in `skills/*/SKILL.md`

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Version History

### 1.0.0 (Initial Release)
- Added `jira-lifecycle-ideas` skill for generating marketing campaigns from Jira launches
- Added `cio-analytics` skill for Customer.io performance reporting
- Full MCP integration for both Atlassian Jira and Customer.io

---

**Built for lifecycle marketing teams who want to automate campaign discovery and performance analysis using Claude Code.**
