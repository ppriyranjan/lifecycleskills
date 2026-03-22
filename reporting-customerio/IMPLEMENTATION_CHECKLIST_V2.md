# Implementation Checklist - Customer.io Analytics Skill (Simplified)

Use this checklist to track implementation progress.

---

## Pre-Implementation Setup

- [ ] Review DESIGN_DOCUMENT_V2.md
- [ ] Approve simplified architecture
- [ ] Verify Customer.io MCP is connected
- [ ] Create skill directory: `.claude/skills/cio-analytics/`

---

## Phase 1: Core Functionality (Week 1)

**Goal**: Basic skill that checks MCP and fetches data

### Directory Structure
- [ ] Create `.claude/skills/cio-analytics/` directory
- [ ] Create `lib/` subdirectory
- [ ] Create `templates/` subdirectory

### Files to Create
- [ ] `SKILL.md` - Main entry point (basic version)
- [ ] `README.md` - Skill documentation
- [ ] `lib/mcp-checker.js` - MCP connection verification
- [ ] `lib/metrics-fetcher.js` - Data fetching (basic)
- [ ] `templates/setup-instructions.md` - MCP setup guide

### lib/mcp-checker.js
- [ ] Function: `checkMCPConnection()`
  - [ ] Call `list_workspaces`
  - [ ] Return workspace context if successful
  - [ ] Return null if failed
- [ ] Function: `getSetupInstructions()`
  - [ ] Load and format setup template
- [ ] Test with MCP connected and disconnected

### lib/metrics-fetcher.js
- [ ] Function: `fetchWorkspaceMetrics(workspaceId, startDate, endDate)`
  - [ ] Call MCP `metrics` tool
  - [ ] Use `human_only: true`
  - [ ] Return structured metrics
- [ ] Function: `fetchCampaignList(workspaceId)`
  - [ ] Get top campaigns by volume
- [ ] Error handling
- [ ] Test with real data

### SKILL.md (Basic Version)
- [ ] Set skill description for auto-invocation
- [ ] Parse `$ARGUMENTS` (period)
- [ ] Check MCP connection
- [ ] If not connected → show setup instructions
- [ ] If connected → fetch basic metrics
- [ ] Display raw data
- [ ] Test: `/cio-analytics`

### Testing
- [ ] MCP not connected → shows setup instructions
- [ ] MCP connected → fetches metrics
- [ ] Invalid workspace → handles error
- [ ] Network error → helpful message

**Deliverable:** ✅ Skill connects to MCP and fetches data

---

## Phase 2: Period Comparison (Week 2)

**Goal**: Calculate period-over-period comparisons with pro-rating

### Files to Create
- [ ] `lib/calculator.js` - All calculation logic

### lib/calculator.js
- [ ] Function: `calculateDateRanges(period, customFrom, customTo)`
  - [ ] Handle "7d" (default)
  - [ ] Handle "30d"
  - [ ] Handle custom date ranges
  - [ ] Return current and previous periods
- [ ] Function: `calculateChange(current, previous)`
  - [ ] Absolute difference
  - [ ] Percentage change
  - [ ] Trend direction
  - [ ] Handle zero division
- [ ] Function: `proRateMetric(value, actualDays, targetDays)`
  - [ ] Calculate pro-rated value
  - [ ] Daily average
  - [ ] Return detailed object
- [ ] Function: `calculateDerivedMetrics(rawMetrics)`
  - [ ] delivery_rate
  - [ ] bounce_rate
  - [ ] open_rate
  - [ ] click_rate
  - [ ] click_to_open
  - [ ] conversion_rate
  - [ ] Handle all zero divisions

### Update lib/metrics-fetcher.js
- [ ] Function: `fetchPeriodComparison(workspaceId, dateRanges)`
  - [ ] Fetch current period
  - [ ] Fetch previous period
  - [ ] Return both

### Update SKILL.md
- [ ] Parse period from `$ARGUMENTS` (default: "7d")
- [ ] Calculate date ranges
- [ ] Fetch both periods
- [ ] Calculate all changes
- [ ] Display comparison (basic format)

### Unit Tests
- [ ] Test date range calculations
- [ ] Test change calculations
- [ ] Test pro-rating logic
- [ ] Test derived metrics
- [ ] Test zero division handling

### Testing
- [ ] 7-day comparison works
- [ ] 30-day comparison works
- [ ] Custom date range works
- [ ] Pro-rating calculates correctly
- [ ] All rates calculate correctly

**Deliverable:** ✅ Accurate period comparisons with pro-rating

---

## Phase 3: Report Template & Campaign Data (Week 3)

**Goal**: Professional unified report with campaign breakdown

### Files to Create
- [ ] `templates/report-template.md` - Single unified template

### Report Template
- [ ] Executive Summary section (placeholder for Claude insights)
- [ ] Deliverability Metrics table
- [ ] Engagement Metrics table
- [ ] Campaign Performance table
- [ ] Detailed Analysis section (placeholder for Claude)
- [ ] Notes section

### Update SKILL.md
- [ ] Parse campaign filter from `$ARGUMENTS`
- [ ] Fetch campaign data
- [ ] Sort campaigns by volume (top 10)
- [ ] Format deliverability table
- [ ] Format engagement table
- [ ] Format campaign table
- [ ] Add trend indicators (↗↘→)
- [ ] Add percentage point formatting
- [ ] Display formatted report

### Campaign Filtering
- [ ] If campaign specified:
  - [ ] Search by name (partial match)
  - [ ] Filter report to that campaign
  - [ ] Show campaign-specific comparisons
- [ ] Else:
  - [ ] Show workspace-level metrics
  - [ ] Include top 10 campaigns

### Testing
- [ ] Report renders correctly
- [ ] Tables align properly
- [ ] Trend arrows display correctly
- [ ] Campaign filtering works
- [ ] Campaign not found → helpful error
- [ ] Visual inspection of output

**Deliverable:** ✅ Professional unified report with campaign data

---

## Phase 4: LLM-Powered Insights (Week 4)

**Goal**: AI-generated insights and recommendations

### Insights Prompt Design
- [ ] Design prompt structure for Claude analysis
- [ ] Structure data for LLM consumption
- [ ] Request format:
  - [ ] 3-5 key findings
  - [ ] Trend and pattern analysis
  - [ ] 3 specific recommended actions
  - [ ] Anomaly detection
  - [ ] What's working well

### Update SKILL.md
- [ ] Prepare structured data for Claude
- [ ] Create insights analysis prompt
- [ ] Call Claude with metrics data
- [ ] Parse Claude's insights
- [ ] Insert into Executive Summary
- [ ] Insert into Detailed Analysis
- [ ] Format recommendations clearly

### Prompt Template
- [ ] Include all period comparison data
- [ ] Include campaign performance data
- [ ] Include bot activity context
- [ ] Request actionable insights
- [ ] Request prioritized recommendations
- [ ] Emphasize period-over-period analysis

### Testing
- [ ] Test with sample data
- [ ] Evaluate quality of insights
- [ ] Are insights actionable?
- [ ] Are recommendations specific?
- [ ] Refine prompt based on output
- [ ] Test with edge cases (all up, all down, mixed)

**Deliverable:** ✅ Report with AI-generated insights and recommendations

---

## Phase 5: Polish & Testing (Week 5)

**Goal**: Production-ready skill

### Error Handling
- [ ] Comprehensive error messages
- [ ] Handle empty workspace
- [ ] Handle zero sends
- [ ] Handle invalid dates
- [ ] Handle campaign not found
- [ ] Handle MCP timeout
- [ ] Handle network errors
- [ ] Add helpful recovery suggestions

### Edge Cases
- [ ] Test: No campaigns in workspace
- [ ] Test: Single campaign only
- [ ] Test: Zero sends in period
- [ ] Test: All metrics zero
- [ ] Test: Very large numbers
- [ ] Test: 1 day of data (pro-rating)
- [ ] Test: Custom date range spanning months
- [ ] Test: Invalid date formats

### Documentation
- [ ] Write comprehensive README.md
  - [ ] What the skill does
  - [ ] When Claude invokes it
  - [ ] How to use manually
  - [ ] Example outputs
- [ ] Add usage examples
- [ ] Document argument formats
- [ ] Troubleshooting guide

### Performance
- [ ] Optimize API calls
- [ ] Minimize requests
- [ ] Test report generation time (<10s target)
- [ ] Add loading indicator for long operations

### Skill Description
- [ ] Refine description for auto-invocation
- [ ] Test that Claude invokes automatically
- [ ] Test various user queries:
  - [ ] "How are our emails performing?"
  - [ ] "Show me campaign metrics"
  - [ ] "Any deliverability issues?"
  - [ ] "What's our open rate?"

### Final Testing
- [ ] Test with real Customer.io workspace
- [ ] Test all argument combinations
- [ ] Test with multiple workspaces
- [ ] Test with large campaigns (>100k sends)
- [ ] User acceptance testing
- [ ] Validate insights quality
- [ ] Performance benchmarking

**Deliverable:** ✅ Production-ready skill

---

## Final Validation

### Functionality
- [ ] MCP connection check works
- [ ] Setup instructions are clear
- [ ] Report generates successfully
- [ ] Period comparisons accurate (±0.1%)
- [ ] Pro-rating works correctly
- [ ] Campaign data accurate
- [ ] Claude generates relevant insights
- [ ] Recommendations are actionable

### Performance
- [ ] Report generation <10 seconds ✓
- [ ] No unnecessary API calls
- [ ] Handles large datasets

### Quality
- [ ] <5% error rate
- [ ] All edge cases handled
- [ ] Error messages helpful
- [ ] Code is clean and documented

### User Experience
- [ ] Claude invokes automatically when relevant
- [ ] Report is easy to read
- [ ] Insights immediately useful
- [ ] Key findings visible in <30 seconds
- [ ] Setup takes <2 minutes

### Documentation
- [ ] README complete and clear
- [ ] Code comments in all modules
- [ ] Examples provided
- [ ] Troubleshooting guide helpful

---

## Launch Checklist

- [ ] All features working
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Tested with real data
- [ ] Performance targets met
- [ ] User feedback positive
- [ ] Ready for production

---

## Post-Launch

### Monitor
- [ ] Track error rates
- [ ] Track performance
- [ ] Collect user feedback
- [ ] Monitor insight quality

### Iterate
- [ ] Refine insights prompt based on feedback
- [ ] Improve error messages
- [ ] Optimize performance
- [ ] Enhance reporting format

### Future Enhancements (v2.0)
- [ ] Multi-workspace comparison
- [ ] Historical trend analysis (>2 periods)
- [ ] Export capabilities (if requested)
- [ ] Custom metric definitions
- [ ] Segment-level reporting

---

## Comparison: V1 vs V2

### What We Removed ❌
- Scheduling functionality (lib/scheduler.js)
- Multiple report types (quick, detailed, deliverability, engagement)
- Hard-coded insights (lib/insights-generator.js)
- Benchmark comparisons (config/benchmarks.json)
- CLI-style invocation
- CSV/JSON export
- Email delivery

### What We Kept ✅
- MCP connection checking
- Period-over-period comparison
- Pro-rating logic
- Campaign breakdown
- Human-only metrics

### What Got Better 🎉
- Simpler architecture (3 lib files vs 6)
- LLM-powered insights (vs hard-coded)
- Single unified report (vs 5 types)
- Auto-invocation by Claude
- 5 weeks implementation (vs 6)

---

**Estimated Timeline: 5 weeks**
**Files to Create: ~10** (vs 20+ in V1)
**Lines of Code: ~800** (vs ~1500 in V1)
