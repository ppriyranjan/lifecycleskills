# Iterable Analytics Report

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
| **Sent** | {{current_sent}} | {{previous_sent}} | {{sent_trend}} {{sent_change}} |
| **Delivered** | {{current_delivered}} ({{current_delivery_rate}}%) | {{previous_delivered}} ({{previous_delivery_rate}}%) | {{delivery_rate_trend}} {{delivery_rate_change}} |
| **Bounced** | {{current_bounced}} ({{current_bounce_rate}}%) | {{previous_bounced}} ({{previous_bounce_rate}}%) | {{bounce_rate_trend}} {{bounce_rate_change}} |

**Period-over-Period**: Delivery rate {{delivery_summary}}

---

## 💌 Engagement Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Opens** | {{current_opens}} | {{previous_opens}} | {{opens_trend}} {{opens_change}} |
| **Open Rate** | {{current_open_rate}}% | {{previous_open_rate}}% | {{open_rate_trend}} {{open_rate_change}} |
| **Clicks** | {{current_clicks}} | {{previous_clicks}} | {{clicks_trend}} {{clicks_change}} |
| **Click Rate** | {{current_click_rate}}% | {{previous_click_rate}}% | {{click_rate_trend}} {{click_rate_change}} |
| **Click-to-Open** | {{current_cto}}% | {{previous_cto}}% | {{cto_trend}} {{cto_change}} |
| **Conversions** | {{current_conversions}} | {{previous_conversions}} | {{conversions_trend}} {{conversions_change}} |
| **Conversion Rate** | {{current_conversion_rate}}% | {{previous_conversion_rate}}% | {{conversion_rate_trend}} {{conversion_rate_change}} |

---

## 🎯 Campaign Performance

{{campaign_table}}

### Campaign Spotlight
{{campaign_spotlight}}

---

## 📝 Notes

- Engagement metrics use unique counts where available (unique opens, unique clicks)
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat (±0.5% threshold)
{{pro_rating_note}}

---

**Data Source**: Iterable API via MCP
**Iterable MCP Server**: Beta
**Analytics Skill Version**: 1.0
