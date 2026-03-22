# Braze Analytics Report

**Period**: {{period_description}}
**Generated**: {{generated_time}}

---

## 📊 Executive Summary

{{executive_summary}}

### Key Insights
{{key_insights_list}}

### Recommended Actions
{{recommendations_list}}

---

## 📈 Deliverability Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Sends** | {{current_sends}} | {{previous_sends}} | {{sends_trend}} {{sends_change}} |
| **Delivered** | {{current_delivered}} ({{current_delivery_rate}}%) | {{previous_delivered}} ({{previous_delivery_rate}}%) | {{delivery_rate_trend}} {{delivery_rate_change}} |
| **Bounced** | {{current_bounces}} ({{current_bounce_rate}}%) | {{previous_bounces}} ({{previous_bounce_rate}}%) | {{bounce_rate_trend}} {{bounce_rate_change}} |
| **Spam Reports** | {{current_spam}} ({{current_spam_rate}}%) | {{previous_spam}} ({{previous_spam_rate}}%) | {{spam_rate_trend}} {{spam_rate_change}} |

**Period-over-Period**: Delivery rate {{delivery_summary}}

---

## 💌 Engagement Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Unique Opens** | {{current_unique_opens}} | {{previous_unique_opens}} | {{unique_opens_trend}} {{unique_opens_change}} |
| **Unique Open Rate** | {{current_unique_open_rate}}% | {{previous_unique_open_rate}}% | {{unique_open_rate_trend}} {{unique_open_rate_change}} |
| **Unique Clicks** | {{current_unique_clicks}} | {{previous_unique_clicks}} | {{unique_clicks_trend}} {{unique_clicks_change}} |
| **Unique Click Rate** | {{current_unique_click_rate}}% | {{previous_unique_click_rate}}% | {{unique_click_rate_trend}} {{unique_click_rate_change}} |
| **Click-to-Open** | {{current_cto}}% | {{previous_cto}}% | {{cto_trend}} {{cto_change}} |
| **Unsubscribes** | {{current_unsubscribes}} | {{previous_unsubscribes}} | {{unsubscribes_trend}} {{unsubscribes_change}} |
| **Unsubscribe Rate** | {{current_unsubscribe_rate}}% | {{previous_unsubscribe_rate}}% | {{unsubscribe_rate_trend}} {{unsubscribe_rate_change}} |

**Total Engagement**: {{total_opens}} total opens ({{total_open_rate}}%), {{total_clicks}} total clicks ({{total_click_rate}}%)

**Estimated Machine Activity**: {{machine_opens}} machine opens ({{machine_open_pct}}% of total), {{machine_clicks}} machine clicks ({{machine_click_pct}}% of total)

---

## 🎯 Campaign Performance

{{campaign_table}}

### Campaign Spotlight
{{campaign_spotlight}}

---

## 🌊 Canvas Performance (if applicable)

{{canvas_section}}

---

## 📝 Notes

- **Unique metrics** represent individual user interactions (deduplicated by user)
- **Total metrics** include all activity (may include machine opens/clicks)
- Machine activity is estimated as the difference between total and unique metrics
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat (±0.5% threshold)
{{pro_rating_note}}

---

## 📚 Methodology

This report uses Braze MCP server to access the following endpoints:
- `/campaigns/list` - Campaign metadata
- `/campaigns/data_series` - Time series campaign analytics
- `/canvas/list` - Canvas metadata (if applicable)
- `/canvas/data_series` - Canvas analytics (if applicable)

All data is read-only and does not include PII.

---

**Analytics powered by Braze MCP**
**Report generated via Claude Code**
**Braze MCP Server Version**: Beta
