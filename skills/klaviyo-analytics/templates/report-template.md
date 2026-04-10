# Klaviyo Analytics Report

**Period**: {{period_description}}
**Account**: {{account_name}}
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
| **Recipients** | {{current_recipients}} | {{previous_recipients}} | {{recipients_trend}} {{recipients_change}} |
| **Delivered** | {{current_delivered}} ({{current_delivery_rate}}%) | {{previous_delivered}} ({{previous_delivery_rate}}%) | {{delivery_rate_trend}} {{delivery_rate_change}} |
| **Bounced** | {{current_bounced}} ({{current_bounce_rate}}%) | {{previous_bounced}} ({{previous_bounce_rate}}%) | {{bounce_rate_trend}} {{bounce_rate_change}} |
| **Spam Complaints** | {{current_spam}} ({{current_spam_rate}}%) | {{previous_spam}} ({{previous_spam_rate}}%) | {{spam_rate_trend}} {{spam_rate_change}} |

**Period-over-Period**: Delivery rate {{delivery_summary}}

---

## 💌 Engagement Metrics (Unique Activity)

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Opens** | {{current_opens}} | {{previous_opens}} | {{opens_trend}} {{opens_change}} |
| **Open Rate** | {{current_open_rate}}% | {{previous_open_rate}}% | {{open_rate_trend}} {{open_rate_change}} |
| **Clicks** | {{current_clicks}} | {{previous_clicks}} | {{clicks_trend}} {{clicks_change}} |
| **Click Rate** | {{current_click_rate}}% | {{previous_click_rate}}% | {{click_rate_trend}} {{click_rate_change}} |
| **Click-to-Open** | {{current_cto}}% | {{previous_cto}}% | {{cto_trend}} {{cto_change}} |
| **Conversions** | {{current_conversions}} | {{previous_conversions}} | {{conversions_trend}} {{conversions_change}} |
| **Conversion Rate** | {{current_conversion_rate}}% | {{previous_conversion_rate}}% | {{conversion_rate_trend}} {{conversion_rate_change}} |
| **Unsubscribes** | {{current_unsubscribes}} | {{previous_unsubscribes}} | {{unsubscribes_trend}} {{unsubscribes_change}} |
| **Unsubscribe Rate** | {{current_unsubscribe_rate}}% | {{previous_unsubscribe_rate}}% | {{unsubscribe_rate_trend}} {{unsubscribe_rate_change}} |

---

## 💰 Revenue Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Total Revenue** | {{current_revenue}} | {{previous_revenue}} | {{revenue_trend}} {{revenue_change}} |
| **Revenue per Recipient** | {{current_rpr}} | {{previous_rpr}} | {{rpr_trend}} {{rpr_change}} |

---

## 🎯 Campaign Performance

{{campaign_table}}

### Campaign Spotlight
{{campaign_spotlight}}

---

## 🔄 Flow Performance

{{flow_table}}

**Flow Summary**: {{flow_summary}}

---

## 📝 Notes

- Engagement metrics use unique activity counts
- Spam complaint rate should stay below 0.1% to maintain deliverability
- Percentages marked "pp" indicate percentage point changes
- Arrows indicate direction: ↗ up, ↘ down, → flat (±0.5% threshold)
- Revenue data depends on Klaviyo conversion tracking configuration
{{pro_rating_note}}

---

**Analytics powered by Klaviyo MCP**
**Report generated via Claude Code**
