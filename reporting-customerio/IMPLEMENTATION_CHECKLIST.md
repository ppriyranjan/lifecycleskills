# Implementation Checklist - Customer.io Analytics Skill

Use this checklist to track implementation progress through Phase A.

---

## Pre-Implementation Setup

- [ ] Review DESIGN_DOCUMENT.md completely
- [ ] Approve architecture and technical approach
- [ ] Set up development environment
- [ ] Verify Customer.io MCP is connected and working
- [ ] Create skill directory: `.claude/skills/cio-analytics/`

---

## Phase A.1: Core Infrastructure (Week 1)

**Goal**: Basic skill that checks MCP and fetches data

### Directory Structure
- [ ] Create `.claude/skills/cio-analytics/` directory
- [ ] Create `lib/` subdirectory
- [ ] Create `templates/` subdirectory
- [ ] Create `config/` subdirectory
- [ ] Create `test/` subdirectory

### Files to Create
- [ ] `SKILL.md` - Main entry point (basic version)
- [ ] `README.md` - Skill documentation
- [ ] `lib/mcp-checker.js` - MCP connection verification
- [ ] `lib/metrics-fetcher.js` - Data fetching (basic)
- [ ] `templates/setup-instructions.md` - MCP setup guide

### lib/mcp-checker.js
- [ ] Function: `checkMCPConnection()`
  - [ ] Try calling `list_workspaces`
  - [ ] Return workspace context if successful
  - [ ] Return null if failed
- [ ] Function: `getSetupInstructions()`
  - [ ] Load template from `templates/setup-instructions.md`
  - [ ] Return formatted instructions
- [ ] Error handling for network issues
- [ ] Test with MCP connected
- [ ] Test with MCP disconnected

### lib/metrics-fetcher.js
- [ ] Function: `fetchWorkspaceMetrics(workspaceId, startDate, endDate)`
  - [ ] Call Customer.io MCP `metrics` tool
  - [ ] Use `human_only: true` for engagement
  - [ ] Return structured metrics object
  - [ ] Handle empty responses
- [ ] Function: `fetchCampaignList(workspaceId)`
  - [ ] Call `list` tool with action: "list_campaigns"
  - [ ] Return array of campaigns
  - [ ] Handle pagination
- [ ] Error handling and retries
- [ ] Test with real workspace data

### SKILL.md (Basic Version)
- [ ] Parse `$ARGUMENTS`
- [ ] Check MCP connection using `mcp-checker.js`
- [ ] If not connected, show setup instructions
- [ ] If connected, fetch basic metrics
- [ ] Display raw metrics (no formatting yet)
- [ ] Test skill invocation: `/cio-analytics`

### Testing
- [ ] Test: MCP not connected → shows setup instructions
- [ ] Test: MCP connected → fetches and displays metrics
- [ ] Test: Invalid workspace → handles error gracefully
- [ ] Test: Network error → retries and shows helpful message

### Deliverable
- [ ] Skill runs without errors
- [ ] Shows setup instructions when MCP not connected
- [ ] Displays basic workspace metrics when connected

---

## Phase A.2: Period Comparison & Calculations (Week 2)

**Goal**: Calculate period-over-period comparisons with pro-rating

### Files to Create
- [ ] `lib/calculator.js` - All calculation logic
- [ ] `config/metrics.json` - Metric definitions
- [ ] `test/unit/calculator.test.js` - Unit tests

### lib/calculator.js
- [ ] Function: `calculateDateRanges(period, customFrom, customTo)`
  - [ ] Handle `period: "7d"` → last 7 days vs previous 7 days
  - [ ] Handle `period: "30d"` → last 30 days vs previous 30 days
  - [ ] Handle custom `from`/`to` → calculate matching previous period
  - [ ] Return `{ current: {...}, previous: {...} }`
  - [ ] Test with various date inputs
- [ ] Function: `calculateChange(current, previous)`
  - [ ] Calculate absolute difference
  - [ ] Calculate percentage change
  - [ ] Determine trend (up/down/flat)
  - [ ] Handle division by zero
  - [ ] Return `{ absolute, percentage, trend }`
  - [ ] Test with edge cases (zero values, negative, etc.)
- [ ] Function: `proRateMetric(value, actualDays, targetDays)`
  - [ ] Calculate pro-rated value
  - [ ] Calculate daily average
  - [ ] Return detailed object with all calculations
  - [ ] Test with various day combinations
- [ ] Function: `calculateDerivedMetrics(rawMetrics)`
  - [ ] Calculate delivery_rate = (delivered / sent) × 100
  - [ ] Calculate bounce_rate = (bounced / sent) × 100
  - [ ] Calculate open_rate = (human_opened / delivered) × 100
  - [ ] Calculate click_rate = (human_clicked / delivered) × 100
  - [ ] Calculate click_to_open = (human_clicked / human_opened) × 100
  - [ ] Handle division by zero for all rates
  - [ ] Test with sample data

### Update metrics-fetcher.js
- [ ] Modify `fetchWorkspaceMetrics()` to accept date range
- [ ] Add function: `fetchPeriodComparison(workspaceId, period)`
  - [ ] Calculate date ranges using calculator
  - [ ] Fetch current period metrics
  - [ ] Fetch previous period metrics
  - [ ] Return both periods
- [ ] Test fetching two periods

### Update SKILL.md
- [ ] Parse `--period` argument (default: "7d")
- [ ] Parse `--from` and `--to` arguments
- [ ] Fetch both current and previous periods
- [ ] Calculate changes using calculator
- [ ] Display period comparison (basic format)

### Testing
- [ ] Test: 7-day period comparison
- [ ] Test: 30-day period comparison
- [ ] Test: Custom date range
- [ ] Test: Pro-rating on partial periods
- [ ] Test: All derived metrics calculate correctly
- [ ] Test: Zero division handled gracefully
- [ ] Unit tests for all calculator functions

### Deliverable
- [ ] Accurate period-over-period comparisons
- [ ] Pro-rating works correctly
- [ ] Shows percentage and absolute changes
- [ ] All unit tests passing

---

## Phase A.3: Report Formatting (Week 3)

**Goal**: Professional, readable reports with benchmarks

### Files to Create
- [ ] `lib/report-formatter.js` - Report formatting
- [ ] `config/benchmarks.json` - Industry benchmarks
- [ ] `templates/quick-report.md` - Quick report template
- [ ] `templates/standard-report.md` - Standard report template
- [ ] `templates/deliverability-report.md` - Deliverability template
- [ ] `templates/engagement-report.md` - Engagement template

### config/benchmarks.json
- [ ] Define benchmarks for delivery_rate
- [ ] Define benchmarks for bounce_rate
- [ ] Define benchmarks for open_rate
- [ ] Define benchmarks for click_rate
- [ ] Define benchmarks for click_to_open
- [ ] Define rating levels (excellent, good, average, poor)

### lib/report-formatter.js
- [ ] Function: `getBenchmarkRating(metric, value)`
  - [ ] Compare value against benchmarks
  - [ ] Return rating (excellent/good/average/poor)
  - [ ] Return emoji indicator (🟢🟡🔴)
- [ ] Function: `formatMetricWithTrend(metric, current, previous, rating)`
  - [ ] Format: "24.5% ↗ +2.3% 🟢"
  - [ ] Include rating emoji
  - [ ] Include trend arrow (↗↘→)
  - [ ] Include percentage change
- [ ] Function: `formatTable(data, columns)`
  - [ ] Create markdown table
  - [ ] Align columns properly
  - [ ] Handle long campaign names
- [ ] Function: `formatQuickReport(data)`
  - [ ] Use quick-report.md template
  - [ ] Show top 3 metrics
  - [ ] Show top 3 campaigns
  - [ ] Show critical issues only
  - [ ] Keep under 30 lines
- [ ] Function: `formatStandardReport(data)`
  - [ ] Use standard-report.md template
  - [ ] Include executive summary
  - [ ] Include all key metrics table
  - [ ] Include campaign breakdown
  - [ ] Include insights section
- [ ] Function: `formatDeliverabilityReport(data)`
  - [ ] Focus on deliverability metrics
  - [ ] Include bounce analysis
  - [ ] Show spam reports
- [ ] Function: `formatEngagementReport(data)`
  - [ ] Focus on engagement metrics
  - [ ] Show human vs bot comparison
  - [ ] Include engagement funnel

### Update SKILL.md
- [ ] Parse `--quick` flag
- [ ] Parse `--type` argument (standard/deliverability/engagement)
- [ ] Route to appropriate formatter
- [ ] Display formatted report
- [ ] Add `--format` argument (markdown/csv/json) - basic support

### Testing
- [ ] Test: Quick report format
- [ ] Test: Standard report format
- [ ] Test: Deliverability report format
- [ ] Test: Engagement report format
- [ ] Test: Benchmark ratings are correct
- [ ] Test: Emoji indicators display correctly
- [ ] Test: Tables are properly aligned
- [ ] Visual inspection of all report types

### Deliverable
- [ ] Beautiful, readable reports
- [ ] Metrics show benchmark ratings
- [ ] Trends are visually clear
- [ ] Multiple report types working

---

## Phase A.4: Campaign Breakdown (Week 4)

**Goal**: Show per-campaign metrics and enable campaign filtering

### Update metrics-fetcher.js
- [ ] Function: `fetchCampaignMetrics(workspaceId, campaignId, startDate, endDate)`
  - [ ] Fetch metrics for specific campaign
  - [ ] Use same period comparison logic
  - [ ] Return campaign-specific metrics
- [ ] Function: `fetchAllCampaignsMetrics(workspaceId, startDate, endDate)`
  - [ ] Get campaign list
  - [ ] Fetch metrics for each campaign (or top N)
  - [ ] Aggregate results
  - [ ] Handle pagination
  - [ ] Consider caching campaign list
- [ ] Add campaign search by name (partial match)

### Update calculator.js
- [ ] Function: `sortCampaignsByMetric(campaigns, metric, order)`
  - [ ] Sort campaigns by specified metric
  - [ ] Support ascending/descending
  - [ ] Filter out campaigns with < minimum sends

### Update report-formatter.js
- [ ] Function: `formatCampaignTable(campaigns, topN)`
  - [ ] Show top N performers
  - [ ] Include key metrics for each
  - [ ] Show ratings for each campaign
  - [ ] Highlight best and worst performers
- [ ] Add campaign breakdown section to standard report
- [ ] Create campaign-specific report template

### Update SKILL.md
- [ ] Parse `--campaign` argument (ID or name)
- [ ] If `--campaign` specified:
  - [ ] Search for campaign by ID or name
  - [ ] Fetch campaign-specific metrics
  - [ ] Generate campaign-specific report
- [ ] Else:
  - [ ] Fetch metrics for top 10 campaigns
  - [ ] Include in standard report

### Testing
- [ ] Test: Campaign search by ID
- [ ] Test: Campaign search by name (partial match)
- [ ] Test: Campaign-specific report
- [ ] Test: Top 10 campaigns in standard report
- [ ] Test: Campaign not found → helpful error
- [ ] Test: Multiple campaigns with similar names

### Deliverable
- [ ] Standard reports include top 10 campaigns
- [ ] Can generate campaign-specific reports
- [ ] Campaign filtering works by ID or name
- [ ] Campaign metrics are accurate

---

## Phase A.5: Insights Generation (Week 5)

**Goal**: Generate actionable insights and recommendations

### Files to Create
- [ ] `lib/insights-generator.js` - Insights logic
- [ ] `test/unit/insights-generator.test.js` - Unit tests

### lib/insights-generator.js
- [ ] Function: `identifyTopPerformers(campaigns, metric, topN)`
  - [ ] Filter campaigns with minimum sends
  - [ ] Sort by specified metric
  - [ ] Return top N with insights
  - [ ] Generate specific insight for each
- [ ] Function: `identifyIssues(workspace, campaigns, benchmarks)`
  - [ ] Check for deliverability issues
  - [ ] Check for engagement issues
  - [ ] Check for declining trends
  - [ ] Categorize by severity (critical/high/medium/low)
  - [ ] Return prioritized list
- [ ] Function: `analyzeTrends(current, previous, historical)`
  - [ ] Identify week-over-week trends
  - [ ] Detect consistent patterns
  - [ ] Flag anomalies
  - [ ] Return trend insights
- [ ] Function: `generateRecommendations(workspace, campaigns, issues)`
  - [ ] Generate specific action items
  - [ ] Prioritize by impact
  - [ ] Include step-by-step instructions
  - [ ] Estimate impact of each recommendation
  - [ ] Return prioritized recommendations
- [ ] Function: `generateInsights(data)`
  - [ ] Combine all insight types
  - [ ] Prioritize most important insights
  - [ ] Format for display
  - [ ] Return structured insights object

### Update report-formatter.js
- [ ] Add insights section to standard report
- [ ] Format top performers section
- [ ] Format issues section with severity colors
- [ ] Format recommendations with action steps
- [ ] Add insights to deliverability report
- [ ] Add insights to engagement report

### Update SKILL.md
- [ ] Generate insights for all report types
- [ ] Include insights in report output
- [ ] Ensure insights are actionable

### Testing
- [ ] Test: Identifies top performers correctly
- [ ] Test: Detects critical deliverability issues
- [ ] Test: Detects low engagement campaigns
- [ ] Test: Generates relevant recommendations
- [ ] Test: Prioritizes issues correctly
- [ ] Test: Insights make sense for sample data
- [ ] User testing: Are insights helpful?

### Deliverable
- [ ] All reports include insights section
- [ ] At least 3 insights per report
- [ ] Recommendations are specific and actionable
- [ ] Issues are prioritized correctly

---

## Phase A.6: Scheduling & Polish (Week 6)

**Goal**: Production-ready with scheduling and final polish

### Files to Create
- [ ] `lib/scheduler.js` - Scheduling utilities
- [ ] `templates/scheduled-report.sh` - Shell script template
- [ ] `USAGE.md` - Usage documentation
- [ ] `TROUBLESHOOTING.md` - Common issues guide

### lib/scheduler.js
- [ ] Function: `generateScheduledScript(options)`
  - [ ] Create executable shell script
  - [ ] Include report configuration
  - [ ] Add output file naming
  - [ ] Add optional email delivery
  - [ ] Add cleanup of old reports
  - [ ] Return script content
- [ ] Function: `getCronSchedule(frequency)`
  - [ ] Return cron expression for frequency
  - [ ] Support daily, weekly, monthly
- [ ] Function: `generateSetupInstructions(scriptPath, frequency)`
  - [ ] Generate macOS/Linux cron instructions
  - [ ] Generate Windows Task Scheduler instructions
  - [ ] Include verification steps

### Update SKILL.md
- [ ] Parse `--schedule` argument (daily/weekly/monthly)
- [ ] If `--schedule` specified:
  - [ ] Generate scheduled script
  - [ ] Save to `.claude/skills/cio-analytics/scripts/`
  - [ ] Make executable (chmod +x)
  - [ ] Display setup instructions
- [ ] Parse `--output` argument for file saving
- [ ] Parse `--format` argument (markdown/csv/json)
  - [ ] Implement CSV export
  - [ ] Implement JSON export

### CSV/JSON Export
- [ ] Function: `exportToCSV(data)`
  - [ ] Convert metrics to CSV format
  - [ ] Include headers
  - [ ] Handle campaign data
- [ ] Function: `exportToJSON(data)`
  - [ ] Convert to structured JSON
  - [ ] Include metadata
  - [ ] Make it easy to parse

### Documentation
- [ ] Write `USAGE.md`
  - [ ] All arguments documented
  - [ ] Examples for common use cases
  - [ ] Output format examples
- [ ] Write `TROUBLESHOOTING.md`
  - [ ] Common errors and solutions
  - [ ] MCP connection issues
  - [ ] Data fetching errors
  - [ ] Calculation edge cases
- [ ] Update `README.md`
  - [ ] Installation instructions
  - [ ] Quick start guide
  - [ ] Feature list
  - [ ] Examples

### Error Handling Polish
- [ ] Improve all error messages
- [ ] Add helpful suggestions to errors
- [ ] Handle all edge cases gracefully
- [ ] Add debug mode (`--debug` flag)

### Performance Optimization
- [ ] Implement caching for campaign list
- [ ] Optimize API calls (minimize requests)
- [ ] Add loading indicators for long operations
- [ ] Benchmark performance against targets

### Final Testing
- [ ] Test all report types
- [ ] Test all arguments and combinations
- [ ] Test scheduling on macOS
- [ ] Test scheduling on Linux
- [ ] Test with multiple workspaces
- [ ] Test with large campaigns
- [ ] Test with edge cases (zero data, etc.)
- [ ] Test error scenarios
- [ ] User acceptance testing

### Deliverable
- [ ] Production-ready skill
- [ ] Scheduling works
- [ ] All features implemented
- [ ] Comprehensive documentation
- [ ] All tests passing

---

## Final Checklist

### Functionality
- [ ] MCP connection check works
- [ ] Setup instructions are clear
- [ ] All report types generate successfully
- [ ] Period comparisons are accurate
- [ ] Pro-rating works correctly
- [ ] Campaign breakdown works
- [ ] Insights are relevant
- [ ] Recommendations are actionable
- [ ] Scheduling works on target platforms
- [ ] CSV/JSON export works

### Performance
- [ ] Quick report: <5 seconds ✓
- [ ] Standard report: <10 seconds ✓
- [ ] Campaign-specific: <8 seconds ✓

### Quality
- [ ] <5% error rate in testing
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Edge cases handled gracefully
- [ ] Error messages are helpful

### User Experience
- [ ] Reports are easy to read
- [ ] Insights are immediately useful
- [ ] Setup takes <2 minutes (MCP connected)
- [ ] Can understand issues in <30 seconds
- [ ] Scheduling setup <5 minutes

### Documentation
- [ ] README.md complete
- [ ] USAGE.md complete
- [ ] TROUBLESHOOTING.md complete
- [ ] Code comments in all modules
- [ ] Examples provided

---

## Launch Checklist

- [ ] All features working
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Tested with real Customer.io data
- [ ] Tested on macOS
- [ ] Tested on Linux
- [ ] Performance targets met
- [ ] User feedback incorporated
- [ ] Version tagged as v1.0
- [ ] Ready for production use!

---

## Post-Launch

### Collect Feedback
- [ ] User feedback on reports
- [ ] User feedback on insights
- [ ] Feature requests
- [ ] Bug reports

### Monitor Usage
- [ ] Track error rates
- [ ] Track performance
- [ ] Identify common issues

### Plan v1.1
- [ ] Data visualization
- [ ] Multi-workspace comparison
- [ ] Historical trend analysis
- [ ] Additional export formats

---

**Use this checklist to track implementation progress. Check off items as completed.**
**Estimated timeline: 6 weeks from start to v1.0 release**
