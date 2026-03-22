# Customer.io Analytics Reporting Skill

This folder contains all documentation and exploration files for building a comprehensive Customer.io analytics reporting skill.

## 📁 Folder Contents

### 🚀 Start Here
- **[QUICK_START.md](QUICK_START.md)** (8.4KB) - Quick overview and getting started guide (5 min read)
- **[README_CUSTOMERIO_TESTING.md](README_CUSTOMERIO_TESTING.md)** (13KB) - Main index and overview (10 min read)

### 📚 Core Documentation
- **[customerio_mcp_test_results.md](customerio_mcp_test_results.md)** (31KB) - Complete API reference with all tools, parameters, and response structures (30 min read)
- **[customerio_mcp_quick_reference.md](customerio_mcp_quick_reference.md)** (11KB) - Developer quick reference guide (15 min read)
- **[customerio_report_templates.md](customerio_report_templates.md)** (25KB) - 5 complete report templates ready to implement (20 min read)
- **[TEST_SUMMARY.md](TEST_SUMMARY.md)** (13KB) - High-level test results summary (10 min read)

### 🔬 Exploration Files
- **[mcp-exploration-checklist.md](mcp-exploration-checklist.md)** (3KB) - Original exploration checklist
- **[test-mcp-connection.md](test-mcp-connection.md)** (487B) - Initial connection test
- **[test-skill/](test-skill/)** - Test skill used during exploration

### 🧪 Legacy Files
- **[test-cio-mcp.claud](test-cio-mcp.claud)** - Early test skill (before proper structure)

---

## 🎯 Project Goal

Build a comprehensive Customer.io analytics reporting skill that:
- ✅ Checks MCP connection with setup instructions
- ✅ Analyzes deliverability and engagement metrics
- ✅ Compares time periods (last 7/30 days vs previous periods)
- ✅ Pro-rates partial period metrics
- ✅ Breaks down by campaigns with insights
- ✅ Supports custom time ranges and specific campaigns
- ✅ Can be scheduled for recurring reports

---

## 📊 Key Findings from Exploration

### MCP Status
✅ **Connected** - Customer.io MCP at `https://mcp.customer.io/mcp`

### Available Data
- **21 Metric Types** - Deliverability, engagement, conversions
- **10 Channel Types** - Email, SMS, push, in-app, and more
- **Bot Detection** - `human_only: true` filters bot activity (critical!)
- **Time Series** - Daily, weekly, monthly resolutions
- **Campaign Details** - Full workflow, A/B tests, action-level data

### Tools Available
1. `list_workspaces` - Get accessible workspaces
2. `list` - Enumerate campaigns, segments, attributes, events
3. `metrics` - Fetch deliverability and engagement data (workspace or campaign-level)
4. `get` - Retrieve detailed resource information
5. `search` - Query documentation and workspace data

---

## 🏗️ Implementation Roadmap

### Phase C: ✅ Complete
- MCP exploration and testing
- Comprehensive documentation
- Report templates

### Phase B: Next (Design Document)
- Skill architecture design
- Command-line interface specification
- Metric calculation formulas
- Report format specifications
- Scheduling approach

### Phase A: Final (Implementation)
- Build the analytics reporting skill
- Implement 5 report types
- Add scheduling capabilities
- Testing and refinement

---

## 📖 Recommended Reading Order

1. **First Time?** → [QUICK_START.md](QUICK_START.md)
2. **Ready to Build?** → [customerio_report_templates.md](customerio_report_templates.md)
3. **Need API Details?** → [customerio_mcp_quick_reference.md](customerio_mcp_quick_reference.md)
4. **Deep Dive?** → [customerio_mcp_test_results.md](customerio_mcp_test_results.md)

---

## 🎨 Available Report Templates

1. **Executive Summary** - Monthly business review with top performers
2. **Campaign Performance** - All campaigns analysis with winners/losers
3. **Deliverability Health** - Email health monitoring and issue detection
4. **Engagement Analysis** - Human vs bot engagement with funnel analysis
5. **Segment Performance** - Segment growth and engagement metrics

---

## 🔑 Critical Insights

### Bot Detection is Essential
- 25-30% of opens can be from bots
- 10% of clicks can be from machines
- **Always use `human_only: true`** for accurate engagement metrics

### Metric Benchmarks
| Metric | Excellent | Good | Average | Poor |
|--------|-----------|------|---------|------|
| Delivery Rate | >98% | 95-98% | 90-95% | <90% |
| Open Rate | >30% | 20-30% | 10-20% | <10% |
| Click Rate | >10% | 5-10% | 2-5% | <2% |
| Bounce Rate | <2% | 2-5% | 5-10% | >10% |

---

## 🚦 Next Steps

1. ✅ MCP exploration complete
2. → Create design document (Phase B)
3. → Implement analytics skill (Phase A)
4. → Test with real workspace data
5. → Deploy and schedule recurring reports

---

**Total Documentation:** 101KB across 6 comprehensive files
**Status:** Ready for Phase B (Design Document)
