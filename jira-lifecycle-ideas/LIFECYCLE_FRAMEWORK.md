# Lifecycle Marketing Relevance Framework

This framework helps assess which launched features have the highest potential for lifecycle marketing campaigns. It's built from first principles of lifecycle marketing: engaging users throughout their journey to drive adoption, retention, and expansion.

## Core Relevance Criteria

### 1. Customer-Facing Impact

**High Impact (Include in campaigns):**
- Directly visible to end users in the product interface
- Changes user workflows or capabilities
- Affects user experience or outcomes
- Mentioned in user-facing documentation
- Requires user action or awareness

**Low Impact (Generally exclude):**
- Backend infrastructure improvements
- Internal tools and admin features
- Performance optimizations users won't notice
- Security patches with no user action needed
- Technical debt reduction

**How to assess:**
- Does the feature description mention "users", "customers", or specific user roles?
- Would users need to learn about this to use it effectively?
- Can users see or interact with this change?
- Does it change what users can accomplish?

### 2. Feature Significance

**High Significance:**
- **New Capability:** Enables something users couldn't do before
  - Examples: New integration, new module, new workflow type
- **Major Enhancement:** Significantly improves existing capability
  - Examples: 10x performance improvement, major UI overhaul, expanded limits
- **Strategic Integration:** Connects with popular tools or platforms
  - Examples: Salesforce integration, Slack integration, API enhancements
- **Differentiation:** Provides competitive advantage or unique value
  - Examples: Industry-first feature, innovative approach, patent-worthy

**Medium Significance:**
- **Incremental Enhancement:** Improves existing feature moderately
  - Examples: Additional filter options, small UI improvements, expanded formats
- **Platform Update:** Keeps product modern and competitive
  - Examples: Updated dependencies, modern design patterns, accessibility improvements
- **User-Requested Minor:** Small improvements users asked for
  - Examples: Keyboard shortcuts, export options, notification preferences

**Low Significance:**
- **Bug Fixes:** Resolves errors or unexpected behavior
  - Exception: Bug fixes that unlock new use cases
- **Maintenance:** Keeps things running, no user benefit
  - Examples: Library updates, code refactoring, test improvements
- **Minor Tweaks:** Cosmetic or trivial changes
  - Examples: Button color changes, tooltip text updates

**How to assess:**
- Does the title/description use words like "new", "major", "significant", "launch"?
- How many users will benefit from this change?
- Does it solve a common pain point or request?
- Would users notice if this weren't released?

### 3. Target Audience Clarity

**Clear Audience (Easier to market):**
- Feature explicitly mentions user segments or personas
  - Examples: "for team admins", "for enterprise customers", "for developers"
- Use case is specific and well-defined
  - Examples: "sales pipeline management", "customer onboarding flows"
- Industry or vertical alignment
  - Examples: "for healthcare providers", "for financial services"
- User tier specificity
  - Examples: "Pro plan feature", "Enterprise only", "Free plan enhancement"

**Broad Audience:**
- Benefits all users equally
  - Examples: Performance improvements, general UI updates
- Multiple use cases across different segments
  - Examples: Improved search, better notifications

**Unclear Audience:**
- Highly technical with no user context
- Internal improvements with unclear external benefit
- Experimental or beta features without defined target

**How to assess:**
- Can you identify exactly who would care about this?
- Is there a clear segment you could target with a campaign?
- Does the feature solve a problem for a specific group?

### 4. Adoption Requirements

Features requiring user education or action are high-priority for lifecycle marketing.

**High Education Need (Prioritize for campaigns):**
- Complex new capabilities requiring learning
- Behavioral change or workflow adjustment needed
- Migration from old feature to new approach
- Multi-step setup or configuration required
- Best practices not immediately obvious

**Medium Education Need:**
- Enhancements to familiar features
- Intuitive improvements with some learning curve
- Optional features users can discover organically

**Low Education Need:**
- Automatic improvements requiring no user action
- Obvious enhancements to existing familiar features
- Self-explanatory additions

**How to assess:**
- Would users need a tutorial or guide to use this?
- Does it replace or change an existing workflow?
- Is there a setup process or configuration needed?
- Are there best practices or tips users should know?

## Marketing Value Signals

Look for these keywords and patterns in issue titles, descriptions, and labels:

### High-Value Keywords

**Feature Type:**
- "new", "launch", "introducing", "release", "beta", "alpha"
- "integration", "connector", "sync", "connect"
- "automation", "workflow", "process"
- "dashboard", "analytics", "insights", "reporting"
- "collaboration", "sharing", "team"

**Scope Indicators:**
- "all users", "everyone", "global"
- "enterprise", "business", "professional", "pro plan"
- "mobile", "desktop", "cross-platform"
- "real-time", "live", "instant"

**Impact Indicators:**
- "faster", "easier", "simpler", "streamlined"
- "powerful", "advanced", "enhanced", "improved"
- "secure", "compliant", "certified"
- "scalable", "unlimited", "expanded"

**Adoption Signals:**
- "onboarding", "getting started", "setup wizard"
- "migration", "upgrade", "transition"
- "deprecation", "sunset", "replacing"
- "beta", "early access", "preview"

### User Segment Keywords

**By Role:**
- Admin, manager, developer, analyst, designer, marketer
- Team lead, executive, contributor, viewer

**By Use Case:**
- Sales, marketing, support, product, engineering
- Project management, collaboration, communication

**By Company Size:**
- Enterprise, SMB, startup, team, individual

### Red Flags (Exclude)

**Internal/Technical (No marketing needed):**
- "refactor", "migrate", "upgrade dependencies"
- "technical debt", "code cleanup", "optimization"
- "under the hood", "backend", "infrastructure"
- "logging", "monitoring", "observability"
- "dev tools", "internal tools", "admin only"

**Security (Communicate differently):**
- "security patch", "vulnerability fix", "CVE"
- These need security bulletins, not marketing campaigns

**Deprecations (Different communication):**
- "removing", "deprecating", "end of life", "sunset"
- These need transition communications, not launch campaigns

**Not Ready:**
- "internal beta", "testing", "experimental", "WIP"
- Wait until GA (general availability)

## Scoring Guidelines

Use this rubric to categorize features:

### High Relevance (Top priority for campaigns)

Must meet **3 out of 4** criteria:
- ✅ Customer-facing with clear user impact
- ✅ Significant new capability or major enhancement
- ✅ Clear target audience or segment
- ✅ Requires user education or adoption support

**Examples:**
- New Salesforce integration for sales teams
- Advanced analytics dashboard for Pro customers
- Mobile app launch for field workers
- Automated workflow builder requiring onboarding

**Campaign Priority:** Create detailed multi-channel campaigns

### Medium Relevance (Consider for lighter campaigns)

Meets **2 out of 4** criteria:
- Partially customer-facing or moderate impact
- Incremental improvement to existing feature
- Broad audience or multiple segments
- Some education helpful but not critical

**Examples:**
- Additional export formats (PDF, Excel, CSV)
- UI refresh of existing feature
- Performance improvements (2x faster)
- New keyboard shortcuts

**Campaign Priority:** Include in newsletters, release notes, or combined announcements

### Low Relevance (Mention in release notes only)

Meets **0-1 out of 4** criteria:
- Internal or backend changes
- Bug fixes or maintenance
- No clear user benefit
- Automatic with no user action needed

**Examples:**
- Library version updates
- Bug fixes
- Infrastructure improvements
- Internal tooling

**Campaign Priority:** Release notes, changelog, no dedicated campaign

## Special Considerations

### Platform vs. Feature

**Platform improvements** that enable multiple use cases:
- Treat as high relevance if they unlock new possibilities
- Focus campaigns on use cases, not the platform itself
- Example: "New API endpoints" → Campaign about "Build custom integrations"

### Beta vs. GA

**Beta releases:**
- Lower priority unless seeking beta testers
- Focus on community of early adopters
- Set expectations about stability

**General Availability (GA):**
- High priority for campaigns
- Broader reach, emphasize stability
- Include success stories from beta if available

### Free vs. Paid Features

**Paid/Premium features:**
- High value for upsell campaigns
- Target free users who would benefit
- Emphasize ROI and advanced capabilities

**Free plan features:**
- High value for adoption and retention
- Broaden appeal and reduce churn
- Competitive differentiation

**Feature gating changes:**
- If moving from paid to free: Re-engagement opportunity
- If adding to paid tier: Upgrade campaign opportunity

### Integrations and Partnerships

**Third-party integrations:**
- Almost always high relevance
- Co-marketing opportunities with partner
- Clear audience (users of both tools)
- Requires education on setup and use cases

## Decision Tree

Use this quick decision tree:

```
Is it customer-facing?
├─ No → LOW RELEVANCE
└─ Yes
    └─ Is it a bug fix with no new capability?
        ├─ Yes → LOW RELEVANCE
        └─ No
            └─ Is the audience clear?
                ├─ No → MEDIUM RELEVANCE
                └─ Yes
                    └─ Is it significant (new capability or major enhancement)?
                        ├─ No → MEDIUM RELEVANCE
                        └─ Yes → HIGH RELEVANCE
```

## Assessment Checklist

For each feature, answer these questions:

**Customer Impact:**
- [ ] Would users notice this change?
- [ ] Does it affect what users can do?
- [ ] Is it mentioned in user-facing docs?

**Significance:**
- [ ] Does it enable new capabilities?
- [ ] Does it solve a major pain point?
- [ ] Would users be excited about this?

**Audience:**
- [ ] Can I name the specific user segment?
- [ ] Is there a clear use case or job-to-be-done?
- [ ] Can I target this in a campaign?

**Adoption:**
- [ ] Do users need to learn about this?
- [ ] Is there a setup or configuration step?
- [ ] Would a tutorial or guide be helpful?

**Red Flags:**
- [ ] Is this internal/backend only?
- [ ] Is this just a bug fix?
- [ ] Is this a security patch?
- [ ] Is this still in beta/experimental?

**Score:**
- 4 checkmarks in first 4 sections + no red flags = HIGH
- 2-3 checkmarks in first 4 sections + no red flags = MEDIUM
- 0-1 checkmarks or any red flags = LOW

## Examples by Category

### HIGH RELEVANCE Examples

1. **"New Slack Integration for Team Notifications"**
   - ✅ Customer-facing: Users interact with Slack notifications
   - ✅ Significant: New capability (integration)
   - ✅ Clear audience: Teams using Slack
   - ✅ Education needed: Setup and configuration required
   - Campaign: Onboarding series + integration announcement

2. **"Advanced Analytics Dashboard for Enterprise Plans"**
   - ✅ Customer-facing: New dashboard interface
   - ✅ Significant: Major new capability
   - ✅ Clear audience: Enterprise customers
   - ✅ Education needed: How to interpret analytics
   - Campaign: Feature launch + educational webinar

3. **"Mobile App for iOS and Android"**
   - ✅ Customer-facing: New platform
   - ✅ Significant: Entirely new capability
   - ✅ Clear audience: Mobile users
   - ✅ Education needed: Download and feature discovery
   - Campaign: Multi-channel launch campaign

### MEDIUM RELEVANCE Examples

1. **"Export Reports in PDF and Excel Formats"**
   - ✅ Customer-facing: Users see new export options
   - ✅ Clear audience: Report users
   - ❌ Moderate significance: Enhancement to existing feature
   - ❌ Low education need: Intuitive dropdown option
   - Campaign: Include in monthly newsletter

2. **"Performance Improvement - 3x Faster Search"**
   - ✅ Customer-facing: Users notice faster search
   - ❌ Broad audience: Everyone
   - ❌ Moderate significance: Improvement not new capability
   - ❌ No education needed: Automatic
   - Campaign: Mention in release notes + social post

3. **"Dark Mode UI Theme"**
   - ✅ Customer-facing: Visual change
   - ✅ Clear audience: Users who prefer dark mode
   - ❌ Moderate significance: UI preference
   - ❌ Low education need: Simple toggle
   - Campaign: In-app announcement + settings prompt

### LOW RELEVANCE Examples

1. **"Upgraded Database to PostgreSQL 15"**
   - ❌ Not customer-facing: Backend infrastructure
   - ❌ No user impact visible
   - Campaign: None (maybe tech blog post)

2. **"Fixed Bug Where Export Button Didn't Work"**
   - ❌ Bug fix, not new capability
   - Campaign: None (include in bug fix changelog)

3. **"Internal Admin Tool for Customer Support"**
   - ❌ Internal tool, not customer-facing
   - Campaign: None (internal announcement only)

## Applying the Framework

When assessing a Jira issue:

1. **Read the issue thoroughly:** Title, description, acceptance criteria, comments
2. **Look for signals:** Check against keyword lists and patterns
3. **Answer the questions:** Use the assessment checklist
4. **Check red flags:** Any reason to exclude?
5. **Calculate score:** Count checkmarks in main criteria
6. **Categorize:** High, Medium, or Low relevance
7. **Note reasoning:** Document why you scored it that way

Be honest and objective. Not every launch deserves a campaign. Focus marketing resources on features with clear user value and adoption needs.
