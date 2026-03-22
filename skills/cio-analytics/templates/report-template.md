# Customer.io Analytics Report

**Period**: {{period_description}}
**Workspace**: {{workspace_name}} (ID: {{workspace_id}})
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
| **Sent** | {{current_sent}} | {{previous_sent}} | {{sent_trend}} {{sent_change}} |
| **Delivered** | {{current_delivered}} ({{current_delivery_rate}}%) | {{previous_delivered}} ({{previous_delivery_rate}}%) | {{delivery_rate_trend}} {{delivery_rate_change}} |
| **Bounced** | {{current_bounced}} ({{current_bounce_rate}}%) | {{previous_bounced}} ({{previous_bounce_rate}}%) | {{bounce_rate_trend}} {{bounce_rate_change}} |
| **Failed** | {{current_failed}} ({{current_failure_rate}}%) | {{previous_failed}} ({{previous_failure_rate}}%) | {{failure_rate_trend}} {{failure_rate_change}} |

**Period-over-Period**: Delivery rate {{delivery_summary}}

---

## 💌 Engagement Metrics (Human Activity)

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Opens** | {{current_opens}} | {{previous_opens}} | {{opens_trend}} {{opens_change}} |
| **Open Rate** | {{current_open_rate}}% | {{previous_open_rate}}% | {{open_rate_trend}} {{open_rate_change}} |
| **Clicks** | {{current_clicks}} | {{previous_clicks}} | {{clicks_trend}} {{clicks_change}} |
| **Click Rate** | {{current_click_rate}}% | {{previous_click_rate}}% | {{click_rate_trend}} {{click_rate_change}} |
| **Click-to-Open** | {{current_cto}}% | {{previous_cto}}% | {{cto_trend}} {{cto_change}} |
| **Conversions** | {{current_conversions}} | {{previous_conversions}} | {{conversions_trend}} {{conversions_change}} |
| **Conversion Rate** | {{current_conversion_rate}}% | {{previous_conversion_rate}}% | {{conversion_rate_trend}} {{conversion_rate_change}} |

**Bot Activity**: {{bot_opens}} machine opens ({{bot_open_pct}}% of total), {{bot_clicks}} machine clicks ({{bot_click_pct}}% of total)

---

## 🎯 Campaign Performance

{{campaign_table}}

### Campaign Spotlight
{{campaign_spotlight}}

---

## 📝 Notes

- All engagement metrics use human-only activity (bot opens/clicks excluded)
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat (±0.5% threshold)
{{pro_rating_note}}

---

**Phase 4 Complete**: Full report with AI-powered insights and recommendations
**Next**: Phase 5 will add final testing and production polish
