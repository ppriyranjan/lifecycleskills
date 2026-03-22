# Customer.io Analytics Report Templates

## Template 1: Executive Summary Report

### Tool Call Sequence
1. `list_workspaces` → Get workspace info
2. `list` (action: list_campaigns) → Get all campaigns
3. `list` (action: list_newsletters) → Get all newsletters
4. `metrics` (action: workspace, human_only: true, include_time_series: true, sort_by: sent, sort_order: desc) → Get workspace metrics

### Output Format
```markdown
# Customer.io Executive Summary
**Workspace:** [Workspace Name]
**Period:** [Start Date] to [End Date]
**Generated:** [Current Date]

## Overview
- **Total Campaigns:** [X active / Y total]
- **Total Newsletters:** [X]
- **Total Sends:** [X]
- **Overall Delivery Rate:** [X%]
- **Overall Open Rate:** [X%] (human only)
- **Overall Click Rate:** [X%] (human only)
- **Overall Conversion Rate:** [X%]

## Top Performers (by engagement)
1. **[Campaign Name]** - [X% open rate], [Y% click rate]
2. **[Campaign Name]** - [X% open rate], [Y% click rate]
3. **[Campaign Name]** - [X% open rate], [Y% click rate]

## Attention Needed
- **Low Delivery:** [Campaign names with <95% delivery]
- **High Bounces:** [Campaign names with >5% bounce]
- **Spam Complaints:** [Campaign names with spam issues]

## Trends
- **Sends:** [Up/Down X% vs previous period]
- **Engagement:** [Up/Down X% vs previous period]
- **Conversions:** [Up/Down X% vs previous period]

## Key Insights
- [Generated insight 1]
- [Generated insight 2]
- [Generated insight 3]

## Recommendations
- [Action item 1]
- [Action item 2]
- [Action item 3]
```

---

## Template 2: Campaign Performance Report

### Tool Call Sequence
1. `list_workspaces` → Get workspace info
2. `list` (action: list_campaigns, limit: 100) → Get all campaigns
3. For each campaign: `metrics` (action: fetch, campaign_id: X, human_only: true, include_time_series: true)
4. For important campaigns: `get` (action: get_campaign, campaign_id: X) → Get structure

### Output Format
```markdown
# Campaign Performance Report
**Period:** [Date Range]

## Campaign Summary Table
| Campaign | Status | Sends | Delivered | Opened | Clicked | Conversions | Open Rate | Click Rate | Conv Rate |
|----------|--------|-------|-----------|--------|---------|-------------|-----------|------------|-----------|
| Campaign 1 | running | 10,000 | 9,500 | 2,500 | 500 | 50 | 26.3% | 5.3% | 0.5% |
| Campaign 2 | running | 5,000 | 4,850 | 1,200 | 300 | 30 | 24.7% | 6.2% | 0.6% |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Totals:** [X sends], [Y delivered], [Z opened], [A clicked], [B conversions]

## Top 5 Campaigns by Engagement
### 1. [Campaign Name]
- **Type:** [Segment/Event triggered]
- **Status:** [Running/Stopped]
- **Period:** [Created date] - [Last activity]
- **Performance:**
  - Sends: [X]
  - Delivery Rate: [X%]
  - Open Rate: [X%] (human only)
  - Click Rate: [X%] (human only)
  - Click-to-Open Rate: [X%]
  - Conversion Rate: [X%]
- **Channel Breakdown:**
  - Email: [X sends], [Y% open rate]
  - SMS: [X sends], [Y% click rate]
  - Push: [X sends], [Y% open rate]
- **Trend:** [Increasing/Stable/Decreasing] engagement over time
- **Insight:** [Analysis of why this campaign performs well]

[Repeat for campaigns 2-5]

## Bottom 5 Campaigns by Engagement
[Similar format, with optimization recommendations]

## A/B Test Results
### [Campaign Name]
- **Test Type:** [Subject line / Content / Send time]
- **Variants:**
  - **Variant A:** [X% open], [Y% click] - [Z sample size]
  - **Variant B:** [X% open], [Y% click] - [Z sample size]
  - **Variant C:** [X% open], [Y% click] - [Z sample size]
- **Winner:** Variant [X] by [Y%] margin
- **Statistical Significance:** [Yes/No]
- **Recommendation:** [Roll out variant X to 100%]

## Multi-Step Campaign Analysis
### [Campaign Name]
**Flow:**
1. **Entry:** [X people entered]
2. **Email 1:** [Y sent] ([Z% of entry])
   - Open: [A%], Click: [B%]
3. **Wait 3 days**
4. **Condition:** [Split based on opened]
   - **Path A (Opened):** [X people] → Email 2A
   - **Path B (Not Opened):** [Y people] → Email 2B
5. **Email 2A:** Open: [A%], Click: [B%]
6. **Email 2B:** Open: [A%], Click: [B%]
7. **Exit/Convert:** [X% overall conversion]

**Drop-off Analysis:**
- Biggest drop: Between [Step X] and [Step Y] ([Z%] drop)
- Optimization opportunity: [Recommendation]

## Recommendations
1. **[Campaign X]:** [Specific recommendation with expected impact]
2. **[Campaign Y]:** [Specific recommendation with expected impact]
3. **General:** [Workspace-wide recommendation]
```

---

## Template 3: Deliverability Health Report

### Tool Call Sequence
1. `list_workspaces` → Get workspace info
2. `metrics` (action: workspace, metric_types: [attempted, sent, delivered, bounced, failed, deferred, spammed, suppressed])
3. For problem campaigns: `metrics` (action: fetch, campaign_id: X, include_time_series: true)
4. `search` (action: search_docs, query: "How to improve email deliverability")

### Output Format
```markdown
# Email Deliverability Health Report
**Period:** [Date Range]

## Overall Health Score: [X/100]

### Scoring Breakdown
- Delivery Rate (40 points): [X/40] - [Y%] delivery rate
- Bounce Rate (30 points): [X/30] - [Y%] bounce rate
- Spam Complaints (20 points): [X/20] - [Y%] spam rate
- Failed Sends (10 points): [X/10] - [Y%] fail rate

## Key Metrics
| Metric | Count | Rate | Status | Benchmark |
|--------|-------|------|--------|-----------|
| Attempted | 100,000 | 100% | ✓ | - |
| Sent | 99,000 | 99% | ✓ | >98% |
| Delivered | 95,000 | 95.9% | ⚠ | >95% |
| Bounced | 3,500 | 3.5% | ✓ | <5% |
| Failed | 500 | 0.5% | ✓ | <1% |
| Deferred | 1,000 | 1.0% | ✓ | <2% |
| Spam Complaints | 50 | 0.05% | ✓ | <0.1% |
| Suppressed | 200 | 0.2% | ✓ | - |

**Legend:** ✓ Healthy | ⚠ Needs Attention | ✗ Critical

## Campaigns Requiring Attention

### Critical Issues (Delivery Rate <90%)
1. **[Campaign Name]**
   - Delivery Rate: [X%]
   - Bounce Rate: [Y%]
   - Primary Issue: [Hard bounces / Spam complaints / Provider rejection]
   - Recommendation: [Specific action]

### Warning Issues (Delivery Rate 90-95%)
[Similar format]

## Bounce Analysis
### Bounce Breakdown
- **Hard Bounces:** [X] ([Y%]) - Invalid email addresses
- **Soft Bounces:** [X] ([Y%]) - Temporary issues

### Top Bounce Reasons
1. [Reason]: [X occurrences] ([Y%])
2. [Reason]: [X occurrences] ([Y%])
3. [Reason]: [X occurrences] ([Y%])

### Action Items
- Clean [X] invalid email addresses
- Re-engage [Y] soft bounces
- Update validation rules

## Spam Complaint Analysis
### Campaigns with Spam Complaints
1. **[Campaign Name]:** [X complaints] ([Y% of delivered])
   - Subject: [Subject line]
   - Content Issue: [Analysis]
   - Recommendation: [Action]

### Spam Complaint Trend
[Time series chart showing spam complaints over time]
- Current: [X complaints/week]
- Previous period: [Y complaints/week]
- Trend: [Up/Down Z%]

## Channel Performance
| Channel | Sent | Delivered | Delivery Rate | Bounced | Spam |
|---------|------|-----------|---------------|---------|------|
| Email | 95,000 | 91,000 | 95.8% | 3,500 | 45 |
| SMS | 5,000 | 4,950 | 99.0% | 50 | 0 |

## Provider Breakdown
| Email Provider | Sends | Delivery Rate | Bounce Rate | Issues |
|----------------|-------|---------------|-------------|--------|
| Gmail | 40,000 | 97.5% | 2.5% | ✓ Healthy |
| Outlook | 25,000 | 94.0% | 6.0% | ⚠ High bounces |
| Yahoo | 15,000 | 92.0% | 8.0% | ✗ Very high bounces |
| Other | 15,000 | 96.0% | 4.0% | ✓ Healthy |

## Deliverability Trends
[Time series showing delivery rate over time]
- Week 1: [X%]
- Week 2: [Y%]
- Week 3: [Z%]
- Week 4: [A%]
- Trend: [Improving/Stable/Declining]

## Recommendations

### Immediate Actions (This Week)
1. **[High Priority Issue]:** [Specific action with expected impact]
2. **[High Priority Issue]:** [Specific action with expected impact]

### Short-term Actions (This Month)
1. **List Hygiene:** Remove [X] hard bounces, verify [Y] soft bounces
2. **Content Review:** Update [X] campaigns with high spam complaints
3. **Provider Issues:** Investigate Yahoo delivery issues

### Long-term Actions (This Quarter)
1. **Authentication:** Implement SPF/DKIM/DMARC improvements
2. **Engagement:** Re-engagement campaign for inactive subscribers
3. **Monitoring:** Set up alerts for delivery rate <95%

## Resources
- [Customer.io Deliverability Best Practices](link)
- [Email Authentication Guide](link)
- [Bounce Handling Guide](link)
```

---

## Template 4: Engagement Analysis Report

### Tool Call Sequence
1. `list_workspaces` → Get workspace info
2. `metrics` (action: workspace, human_only: true, include_time_series: true, metric_types: [opened, human_opened, clicked, human_clicked, converted])
3. `metrics` (action: workspace, human_only: false, include_time_series: true, metric_types: [opened, clicked]) → Compare bot vs human
4. `list` (action: list_segments) → Get segment info

### Output Format
```markdown
# Engagement Analysis Report
**Period:** [Date Range]

## Executive Summary
- **True Open Rate:** [X%] (human only)
- **True Click Rate:** [Y%] (human only)
- **Click-to-Open Rate:** [Z%] (engagement quality)
- **Conversion Rate:** [A%]
- **Bot Activity:** [B%] of opens, [C%] of clicks

## Human vs Bot Engagement

### Overall Comparison
| Metric | All Activity | Human Only | Bot/Machine | Bot % |
|--------|--------------|------------|-------------|-------|
| Opens | 10,000 | 7,500 | 2,500 | 25% |
| Clicks | 2,000 | 1,800 | 200 | 10% |

**Insight:** [X%] of opens are from bots (likely email clients with link protection/preview features)

### Bot Activity by Campaign
| Campaign | Total Opens | Human Opens | Bot % | Impact |
|----------|-------------|-------------|-------|--------|
| Campaign A | 1,000 | 950 | 5% | Low |
| Campaign B | 2,000 | 1,400 | 30% | High |
| Campaign C | 1,500 | 1,200 | 20% | Medium |

**Recommendation:** Use human_only metrics for accurate engagement measurement

## Engagement Funnel
```
Delivered: 100,000 (100%)
    ↓
Opened (human): 25,000 (25.0%)
    ↓
Clicked (human): 5,000 (5.0% of delivered, 20.0% of opened)
    ↓
Converted: 500 (0.5% of delivered, 10.0% of clicked)
```

### Drop-off Analysis
- **Delivered → Opened:** 75% drop (opportunity: improve subject lines)
- **Opened → Clicked:** 80% drop (opportunity: improve CTA/content)
- **Clicked → Converted:** 90% drop (opportunity: improve landing page)

## Engagement by Campaign
| Campaign | Opens | Open Rate | Clicks | Click Rate | CTOR | Conv Rate |
|----------|-------|-----------|--------|------------|------|-----------|
| Campaign A | 2,500 | 30.0% | 750 | 9.0% | 30.0% | 1.2% |
| Campaign B | 2,000 | 25.0% | 500 | 6.3% | 25.0% | 0.8% |
| Campaign C | 1,500 | 20.0% | 300 | 4.0% | 20.0% | 0.5% |

**CTOR = Click-to-Open Rate (clicks / opens) - measures content quality**

## Engagement Trends
[Time series chart showing daily open and click rates]

### Daily Breakdown
| Date | Sends | Open Rate | Click Rate | CTOR | Conv Rate |
|------|-------|-----------|------------|------|-----------|
| Mar 1 | 3,500 | 25.5% | 5.2% | 20.4% | 0.6% |
| Mar 2 | 3,200 | 26.1% | 5.5% | 21.1% | 0.7% |
| ... | ... | ... | ... | ... | ... |

### Weekly Summary
| Week | Avg Open Rate | Avg Click Rate | Trend |
|------|---------------|----------------|-------|
| Week 1 | 24.5% | 4.8% | Baseline |
| Week 2 | 25.2% | 5.1% | ↑ +2.9% |
| Week 3 | 26.0% | 5.4% | ↑ +3.2% |
| Week 4 | 25.8% | 5.3% | → -0.8% |

**Overall Trend:** Improving engagement (+5.3% open rate over period)

## Engagement by Segment
| Segment | Size | Campaigns | Avg Open Rate | Avg Click Rate | Quality Score |
|---------|------|-----------|---------------|----------------|---------------|
| Premium Users | 1,200 | 5 | 35.0% | 12.0% | Excellent |
| Active Users | 5,000 | 8 | 28.0% | 7.5% | Good |
| Trial Users | 3,000 | 6 | 22.0% | 5.0% | Average |
| Inactive Users | 2,000 | 3 | 12.0% | 2.0% | Poor |

**Insight:** Premium users engage 3x more than inactive users

## Engagement by Channel
| Channel | Sends | Open Rate | Click Rate | CTOR | Best For |
|---------|-------|-----------|------------|------|----------|
| Email | 90,000 | 25.0% | 5.0% | 20.0% | Awareness |
| SMS | 8,000 | N/A | 15.0% | N/A | Urgency |
| Push | 2,000 | 45.0% | 8.0% | 17.8% | Retention |

## Engagement Quality Tiers

### Excellent (CTOR >25%)
- [Campaign names]
- Common traits: [Analysis]
- Apply learnings to other campaigns

### Good (CTOR 15-25%)
- [Campaign names]
- Optimization opportunities: [Recommendations]

### Needs Improvement (CTOR <15%)
- [Campaign names]
- Issues identified: [Problems]
- Action plan: [Steps to improve]

## Content Performance

### Top Performing Subject Lines
1. **"[Subject]"** - [X% open rate] - [Campaign]
2. **"[Subject]"** - [X% open rate] - [Campaign]
3. **"[Subject]"** - [X% open rate] - [Campaign]

**Common elements:** [Patterns identified]

### Top Performing CTAs
1. **"[CTA Text]"** - [X% click rate] - [Campaign]
2. **"[CTA Text]"** - [X% click rate] - [Campaign]
3. **"[CTA Text]"** - [X% click rate] - [Campaign]

**Common elements:** [Patterns identified]

## Send Time Analysis
| Send Hour (EST) | Sends | Open Rate | Click Rate | Best For |
|-----------------|-------|-----------|------------|----------|
| 6-9 AM | 20,000 | 28.0% | 6.0% | B2B |
| 9-12 PM | 30,000 | 24.0% | 5.0% | General |
| 12-3 PM | 25,000 | 22.0% | 4.5% | - |
| 3-6 PM | 15,000 | 26.0% | 5.5% | B2C |
| 6-9 PM | 10,000 | 30.0% | 7.0% | B2C |

**Recommendation:** Send B2C campaigns between 6-9 PM for best engagement

## Conversion Analysis

### Conversion Funnel by Campaign
| Campaign | Delivered | Opened | Clicked | Converted | Conv Rate |
|----------|-----------|--------|---------|-----------|-----------|
| Welcome Series | 10,000 | 3,000 | 800 | 120 | 1.2% |
| Re-engagement | 5,000 | 1,000 | 200 | 15 | 0.3% |
| Product Launch | 8,000 | 2,400 | 720 | 72 | 0.9% |

### Conversion Attribution
- **First Touch:** [X%] of conversions from first campaign interaction
- **Multi-Touch:** [Y%] of conversions from multiple campaign interactions
- **Time to Convert:** Average [Z] days from first open to conversion

## Recommendations

### Quick Wins
1. **Subject Lines:** Apply learnings from top performers to underperforming campaigns
2. **Send Time:** Shift B2C sends to 6-9 PM window
3. **Bot Filtering:** Use human_only metrics for all reporting

### Medium-term Optimizations
1. **Content:** Improve CTOR for campaigns below 15%
2. **Segmentation:** Create premium user segment for high-engagement content
3. **A/B Testing:** Test subject line variations for campaigns with <20% open rate

### Long-term Strategy
1. **Engagement Scoring:** Implement engagement-based segmentation
2. **Re-engagement:** Campaign for inactive users (<12% open rate)
3. **Personalization:** Increase relevance for better click-through rates
```

---

## Template 5: Segment Performance Report

### Tool Call Sequence
1. `list_workspaces` → Get workspace info
2. `list` (action: list_segments) → Get all segments
3. For each segment: `get` (action: get_segment, segment_id: X) → Get segment details
4. `list` (action: list_campaigns) → Get all campaigns
5. For each campaign: Check which segments are targeted
6. `metrics` (action: fetch, campaign_id: X) → Get metrics for each campaign
7. Aggregate by segment

### Output Format
```markdown
# Segment Performance Report
**Period:** [Date Range]

## Segment Overview
| Segment | Type | Size | Campaigns Targeted | Avg Open Rate | Avg Click Rate | Engagement Score |
|---------|------|------|--------------------|---------------|----------------|------------------|
| All Users | Dynamic | 10,000 | 15 | 22.0% | 4.5% | 72/100 |
| Premium Users | Dynamic | 1,200 | 8 | 35.0% | 12.0% | 95/100 |
| Active Users | Dynamic | 5,000 | 12 | 28.0% | 7.5% | 85/100 |
| Trial Users | Dynamic | 2,000 | 6 | 22.0% | 5.0% | 75/100 |
| Inactive Users | Dynamic | 1,800 | 4 | 12.0% | 2.0% | 45/100 |

**Engagement Score:** Weighted score based on open rate (40%), click rate (40%), conversion rate (20%)

## Segment Deep Dive

### Premium Users (ID: 3)
**Definition:** People with "plan_name" attribute = "premium"
**Size:** 1,200 people (+50 this month)
**Growth:** +4.3% month-over-month

#### Campaigns Targeting This Segment
1. **Premium Features Announcement** - 38% open, 15% click
2. **Premium User Survey** - 42% open, 18% click
3. **Early Access to New Features** - 40% open, 14% click

#### Performance Metrics
- **Average Open Rate:** 35.0% (vs. 22.0% workspace average)
- **Average Click Rate:** 12.0% (vs. 4.5% workspace average)
- **Average Conversion Rate:** 2.5% (vs. 0.5% workspace average)
- **CTOR:** 34.3% (excellent engagement quality)

#### Insights
- Premium users engage 59% more than average
- Best performing content: Feature announcements and early access
- Optimal send time: Weekday mornings (9-11 AM)

#### Recommendations
- Increase campaign frequency (currently 2x/month, could support 3-4x/month)
- Create exclusive content series
- Use as test audience for new campaign types

---

### Active Users (ID: 2)
**Definition:** Users who logged in within last 30 days
**Size:** 5,000 people (-100 this month)
**Growth:** -2.0% month-over-month ⚠

#### Campaigns Targeting This Segment
1. **Weekly Tips** - 30% open, 8% click
2. **Product Updates** - 28% open, 7% click
3. **User Community Events** - 26% open, 6% click

#### Performance Metrics
- **Average Open Rate:** 28.0% (above workspace average)
- **Average Click Rate:** 7.5% (above workspace average)
- **Average Conversion Rate:** 1.2%
- **CTOR:** 26.8% (good engagement quality)

#### Insights
- Strong engagement but segment size declining
- Best content: Educational and community-focused
- Drop-off: 100 users moved to "Inactive" this month

#### Recommendations
- **Priority:** Prevent further decline
- Launch re-activation sub-campaign for at-risk users (20-29 days since login)
- Increase value of weekly tips (currently 26% open, target 30%)
- Cross-promote to free users to grow segment

---

### Inactive Users (ID: 5)
**Definition:** No login in 60+ days
**Size:** 1,800 people (+300 this month)
**Growth:** +20.0% month-over-month ⚠

#### Campaigns Targeting This Segment
1. **We Miss You** - 15% open, 3% click
2. **Special Comeback Offer** - 18% open, 4% click
3. **Account Status Reminder** - 8% open, 1% click

#### Performance Metrics
- **Average Open Rate:** 12.0% (below workspace average)
- **Average Click Rate:** 2.0% (below workspace average)
- **Average Conversion Rate:** 0.2%
- **CTOR:** 16.7% (those who open are somewhat engaged)

#### Insights
- Low overall engagement but decent CTOR suggests content relevance
- Growing segment is a concern (churn risk)
- Special offers perform better than account reminders

#### Recommendations
- **Immediate:** Aggressive re-engagement campaign
- **Content:** Focus on value reminders and special offers
- **Frequency:** Reduce from 1x/week to 1x/2 weeks (avoid fatigue)
- **Consider:** Win-back automation with escalating offers
- **Monitor:** Move to suppression list if no engagement after 90 days

## Segment Overlap Analysis
```
Premium Users (1,200)
    ∩ Active Users (900) = 75% of premium are active
    ∩ Inactive Users (50) = 4% of premium are inactive ⚠

Active Users (5,000)
    ∩ Trial Users (800) = 16% of active are on trial
    ∩ Premium Users (900) = 18% of active are premium

Inactive Users (1,800)
    ∩ Trial Users (600) = 33% of inactive are trial (churn risk!)
```

**Key Finding:** 33% of inactive users are trial users - opportunity to improve trial-to-paid conversion

## Segment Growth Trends
| Segment | 30 Days Ago | Today | Change | Trend |
|---------|-------------|-------|--------|-------|
| All Users | 9,800 | 10,000 | +200 | ↑ +2.0% |
| Premium Users | 1,150 | 1,200 | +50 | ↑ +4.3% |
| Active Users | 5,100 | 5,000 | -100 | ↓ -2.0% |
| Trial Users | 2,000 | 2,000 | 0 | → 0% |
| Inactive Users | 1,500 | 1,800 | +300 | ↑ +20.0% |

**Concern:** Inactive segment growing 10x faster than overall user growth

## Segment Health Scores
| Segment | Engagement | Growth | Conversion | Overall Health |
|---------|------------|--------|------------|----------------|
| Premium Users | 95/100 | 85/100 | 90/100 | A+ |
| Active Users | 85/100 | 60/100 | 75/100 | B+ |
| Trial Users | 75/100 | 70/100 | 60/100 | B |
| Inactive Users | 45/100 | 20/100 | 30/100 | D |

## Campaign-Segment Fit Analysis
| Campaign | Segment | Expected Open | Actual Open | Fit Score |
|----------|---------|---------------|-------------|-----------|
| Welcome Series | Trial Users | 25% | 32% | Excellent ✓ |
| Product Updates | Active Users | 30% | 28% | Good ✓ |
| Win-back Offer | Inactive | 15% | 18% | Excellent ✓ |
| Feature Launch | Premium | 35% | 42% | Excellent ✓ |
| Weekly Newsletter | All Users | 22% | 19% | Needs Work ⚠ |

**Insight:** Most campaigns are well-targeted; Weekly Newsletter needs segmentation

## Recommendations by Priority

### Critical (This Week)
1. **Inactive User Growth:** Launch aggressive re-engagement campaign
2. **Trial Churn:** 600 trial users are inactive - special trial extension offer
3. **Active User Decline:** Implement at-risk detection (20-29 days no login)

### High Priority (This Month)
1. **Segment Weekly Newsletter:** Create separate versions for Premium, Active, Trial
2. **Premium User Growth:** Upgrade campaign for engaged trial users
3. **Engagement Tracking:** Implement segment movement monitoring

### Medium Priority (This Quarter)
1. **New Segments:** Create "Power Users" (top 10% engagement) and "At Risk Premium" (premium + inactive)
2. **Predictive Segments:** Build "Likely to Convert" and "Churn Risk" segments
3. **Lifecycle Campaigns:** Automated journeys based on segment membership

## Segment Optimization Ideas

### Create New Segments
1. **Power Users:** Active users with >50% open rate and >20% click rate
2. **At-Risk Premium:** Premium users who haven't logged in for 14+ days
3. **High-Value Trial:** Trial users with >40% engagement (likely to convert)
4. **Win-back Candidates:** Inactive 60-89 days (better than 90+)

### Refine Existing Segments
1. **Active Users:** Split into "Very Active" (<7 days) and "Active" (7-30 days)
2. **Trial Users:** Add engagement score dimension
3. **Inactive Users:** Separate "Recoverable" (60-90 days) from "Lost" (90+ days)

## Success Metrics for Next Period
- **Premium Users:** Maintain 35%+ open rate, grow by 5%
- **Active Users:** Halt decline, target 0% change or growth
- **Trial Users:** Improve open rate from 22% to 25%
- **Inactive Users:** Reduce growth to <10%, recover 15% to Active
- **Overall:** Improve workspace average open rate from 22% to 24%
```

---

## General Report Components

### Standard Header
```markdown
# [Report Title]
**Workspace:** [Workspace Name] (ID: [X])
**Period:** [Start Date] - [End Date] ([X] days)
**Generated:** [Current Date and Time]
**Report Type:** [Executive Summary / Campaign Performance / Deliverability / etc.]
```

### Status Indicators
- ✓ Healthy / Good / On Track
- ⚠ Warning / Needs Attention / At Risk
- ✗ Critical / Poor / Urgent Action Required
- → Stable / No Change
- ↑ Improving / Increasing
- ↓ Declining / Decreasing

### Metric Benchmarks
| Metric | Excellent | Good | Average | Poor |
|--------|-----------|------|---------|------|
| Delivery Rate | >98% | 95-98% | 90-95% | <90% |
| Open Rate | >30% | 20-30% | 10-20% | <10% |
| Click Rate | >10% | 5-10% | 2-5% | <2% |
| CTOR | >25% | 15-25% | 10-15% | <10% |
| Bounce Rate | <2% | 2-5% | 5-10% | >10% |
| Spam Rate | <0.05% | 0.05-0.1% | 0.1-0.5% | >0.5% |
| Conversion Rate | >3% | 1-3% | 0.5-1% | <0.5% |

### Trend Indicators
```
Metric: [X]
Current: [Y]
Previous Period: [Z]
Change: [+/-A%]
Trend: [Improving/Stable/Declining]
Forecast: [Expected value next period]
```

### Action Priority Levels
1. **Critical (Do Now):** Issues causing immediate harm or lost revenue
2. **High (This Week):** Important optimizations with significant impact
3. **Medium (This Month):** Improvements that enhance performance
4. **Low (This Quarter):** Nice-to-have optimizations

### Insights Format
```
**Finding:** [Observation]
**Impact:** [What this means for business]
**Recommendation:** [Specific action to take]
**Expected Outcome:** [Predicted result]
**Effort:** [Low/Medium/High]
**Priority:** [Critical/High/Medium/Low]
```

---

## Implementation Notes

### For All Reports:
1. **Caching:** Cache workspace structure, refresh metrics
2. **Date Handling:** Always use YYYY-MM-DD format, validate ranges
3. **Human Metrics:** Default to human_only=true for engagement
4. **Comparison:** Include period-over-period comparisons when possible
5. **Visualization:** Generate data suitable for charts (arrays of values)
6. **Export:** Provide both Markdown and CSV/JSON formats
7. **Links:** Include direct links to Customer.io UI for drill-down
8. **Context:** Explain metrics (what is CTOR, why it matters)
9. **Actions:** Always end with specific, prioritized recommendations
10. **Freshness:** Include "Generated at [timestamp]" for report age awareness
