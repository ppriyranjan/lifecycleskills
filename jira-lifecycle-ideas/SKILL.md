---
name: jira-lifecycle-ideas
description: Discovers recently launched product features from Jira and generates targeted lifecycle marketing campaign ideas. Use when planning marketing campaigns, identifying new launches, or finding features that need marketing support.
allowed-tools: mcp__*
---

# Jira Lifecycle Marketing Ideas

Generate actionable lifecycle marketing campaign ideas from recently launched product features in Jira.

## What this skill does

This skill connects to your Jira workspace via MCP to:
1. Discover product features launched in the last 2 weeks (default) or a specified timeline in the prompt
2. Assess each feature's relevance for lifecycle marketing
3. Generate specific, actionable campaign ideas with channels, timing, and target segments
4. Prioritize opportunities by marketing impact

## When to use this skill

- Planning weekly or biweekly marketing campaigns
- Discovering new product launches that need marketing support
- Identifying features that could benefit from targeted outreach
- Creating data-driven lifecycle marketing strategies

## Workflow

Follow these steps in order. This skill is designed to be adaptive and work across different Jira configurations.

### Step 1: Verify Jira MCP Connection

Check if the Atlassian Jira MCP is available and connected.

**If MCP is not available:** Direct the user to see [JIRA_SETUP.md](JIRA_SETUP.md) for setup instructions.

**If MCP is available:** Proceed to Step 2.

### Step 2: Discover Jira Configuration

Query recent issues to understand how this Jira workspace indicates "launched" features.

**Query parameters:**
- Timeframe: Last 14 days (`updated >= -14d`)
- Limit: 50-100 recent issues for analysis
- Sort: Most recently updated first

**Analyze the results to identify:**
- **Status patterns:** Look for statuses containing "done", "released", "launched", "deployed", "closed", "resolved"
- **Label patterns:** Check for labels like "released", "launched", "shipped", "production"
- **Issue types:** Identify which types represent features (Story, Feature, Epic, New Feature, Enhancement)
- **Custom fields:** Look for release dates, deployment dates, or launch-related fields
- **Resolution patterns:** Check if resolution field or resolution date indicates completion

**Important:** Do not assume specific field names. Different workspaces use different conventions.

### Step 3: Identify Launched Features

Based on the patterns discovered in Step 2, filter for issues that appear to be launched features.

**Heuristics to apply:**
- Status recently changed to a "done" state (within last 14 days)
- Resolution date within last 14 days
- Labels indicating release or launch
- Issue type suggests feature work (not bug fixes or tasks)
- Title or description suggests user-facing changes

**Focus on issue types:**
- Story (if customer-facing)
- Feature
- Epic
- New Feature
- Enhancement (if significant)

**Exclude:**
- Bug fixes (unless they enable new functionality)
- Internal tasks
- Technical debt
- Infrastructure work (unless it enables new capabilities)

**Gather details for each potential feature:**
- Issue key and title
- Description summary
- Status and when it changed
- Labels and components
- Any custom fields indicating target audience or impact
- Any links to documentation or product requirement docs 

### Step 4: Assess Marketing Relevance

For each identified feature, assess its relevance for lifecycle marketing using the framework in [LIFECYCLE_FRAMEWORK.md](LIFECYCLE_FRAMEWORK.md).

**Read the framework to understand:**
- Core relevance criteria (customer-facing, significance, audience clarity)
- Marketing value signals (keywords, scope, adoption needs)
- Scoring guidelines (high/medium/low relevance)
- Red flags that indicate exclusion

**Categorize each feature:**
- **High relevance:** Customer-facing new features, major enhancements, integrations requiring education
- **Medium relevance:** Incremental improvements, platform updates, minor features
- **Low relevance:** Bug fixes, internal tools, technical infrastructure

**For high-relevance features, note:**
- Target audience (who benefits?)
- Feature type (new capability, enhancement, integration?)
- Adoption needs (does it require onboarding/education?)
- Business impact keywords (enterprise, pro, integration, automation, etc.)

### Step 5: Generate Campaign Ideas

For each high-relevance feature, generate specific campaign ideas using templates from [CAMPAIGN_TEMPLATES.md](CAMPAIGN_TEMPLATES.md).

**Read the templates to understand:**
- 6 campaign types (launch, onboarding, re-engagement, upgrade, integration, deprecation)
- Channel recommendations for each type
- Timing guidance
- Segment targeting strategies

**Match features to campaign types:**
- **New capabilities** → New Feature Launch Campaign
- **Complex features** → Onboarding & Education Campaign
- **Underutilized features** → Re-engagement Campaign
- **Premium features** → Upgrade/Upsell Campaign
- **Partner integrations** → Integration/Partnership Announcement
- **Feature transitions** → Deprecation/Sunset Communication

**For each campaign idea, specify:**
1. **Campaign Name:** Descriptive and compelling
2. **Campaign Type:** Which template from CAMPAIGN_TEMPLATES.md
3. **Value Proposition:** Why should users care?
4. **Target Segments:** Who should receive this campaign?
5. **Channels:** Email, in-app, blog, video, webinar, etc.
6. **Timeline:** When to launch and follow up
7. **Success Metrics:** How to measure effectiveness

### Step 6: Generate Output Report

Create a comprehensive markdown report with the following structure:

```markdown
# Lifecycle Marketing Ideas from Recent Jira Launches
*Analysis Period: [Start Date] - [End Date]*

## Summary
- **Total Issues Analyzed:** [count]
- **Launched Features Identified:** [count]
- **High Marketing Relevance:** [count]
- **Medium Marketing Relevance:** [count]
- **Low Marketing Relevance:** [count]
- **Campaign Ideas Generated:** [count]

## High-Priority Campaigns

### [Feature 1 Title] ([JIRA-KEY])
**Launch Date:** [date]
**Relevance Score:** High
**Target Audience:** [description]

**Campaign Idea: "[Campaign Name]"**
- **Type:** [Campaign type from templates]
- **Value Proposition:** [Why users should care]
- **Channels:**
  - [Channel 1 with specific tactic]
  - [Channel 2 with specific tactic]
  - [Channel 3 with specific tactic]
- **Timeline:**
  - Week 1: [Action]
  - Week 2: [Action]
  - Week 3: [Action]
  - Week 4: [Action]
- **Target Segments:** [Specific user segments]
- **Success Metrics:** [How to measure]
- **Jira Link:** [Link to issue]

---

[Repeat for each high-priority feature]

## Medium-Priority Features

### [Feature Title] ([JIRA-KEY])
**Why it matters:** [Brief explanation]
**Quick idea:** [One-sentence campaign suggestion]

[Repeat for medium-priority features]

## Low-Priority Features (For Reference)

- [JIRA-KEY]: [Feature title]
- [JIRA-KEY]: [Feature title]
[List all low-priority features]

## Recommendations

1. **Prioritize:** Focus on the [X] high-priority campaigns first
2. **Assign owners:** Allocate campaign DRI (Directly Responsible Individual) for each
3. **Set dates:** Schedule campaign launches across next 2-4 weeks
4. **Create briefs:** Develop detailed campaign briefs with creative requirements
5. **Track impact:** Set up analytics and tracking for success metrics

## Next Steps

- [ ] Review and approve campaign ideas with marketing team
- [ ] Assign campaign owners and set deadlines
- [ ] Create detailed campaign briefs
- [ ] Schedule content creation (copy, design, video)
- [ ] Set up tracking and analytics
- [ ] Launch campaigns according to timeline
- [ ] Monitor performance and iterate
```

## Guidelines for Success

**Be Adaptive:**
- Do not assume Jira field names or statuses
- Discover configuration dynamically from actual data
- Adapt to different workspace conventions

**Be Selective:**
- Focus on truly marketing-relevant features
- Exclude internal changes and technical work
- Prioritize high-impact opportunities

**Be Specific:**
- Generate concrete, actionable campaign ideas
- Include specific channels, timing, and segments
- Provide clear success metrics

**Be Concise:**
- Keep campaign descriptions focused and scannable
- Use bullet points for clarity
- Highlight the most important information

## Common Scenarios

**Scenario: No launched features found**
If no features appear to have launched in the last 2 weeks:
- Extend the search window to 3-4 weeks
- Broaden the criteria (include more issue types)
- Report findings honestly and suggest next steps

**Scenario: Too many features (50+)**
If you find many launched features:
- Focus on the top 10-15 by relevance score
- Group similar features into combined campaigns
- Provide summary statistics for the rest

**Scenario: Unclear if feature is customer-facing**
When it's not clear if a feature is customer-facing:
- Look for audience indicators in description
- Check components and labels for hints
- Default to including it but mark as "medium relevance"
- Note the uncertainty in the report

**Scenario: Feature requires technical understanding**
For technical features:
- Focus on the user benefit, not the implementation
- Translate technical details into value propositions
- Suggest educational content as part of the campaign

## Troubleshooting

**MCP connection fails:**
See [JIRA_SETUP.md](JIRA_SETUP.md) for setup instructions.

**No issues returned from query:**
- Check that the Jira project has been active recently
- Verify MCP permissions allow reading issues
- Try broadening the date range

**Difficulty determining "launched" status:**
- Ask the user which statuses or labels indicate launches in their workspace
- Provide a list of observed statuses and ask for guidance
- Use resolution date as a fallback indicator

**Features seem irrelevant for marketing:**
- This may indicate a technical-focused sprint
- Report findings honestly
- Suggest checking back in 1-2 weeks

## Additional Resources

- **[LIFECYCLE_FRAMEWORK.md](LIFECYCLE_FRAMEWORK.md):** Complete framework for assessing marketing relevance
- **[CAMPAIGN_TEMPLATES.md](CAMPAIGN_TEMPLATES.md):** Detailed campaign templates for different feature types
- **[JIRA_SETUP.md](JIRA_SETUP.md):** Setup instructions for Atlassian Jira MCP
