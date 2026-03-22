/**
 * Iterable Metrics Fetcher
 * Fetches campaign metrics from Iterable MCP
 */

/**
 * Fetch campaign metrics for a date range
 * Note: This will be called from SKILL.md which has access to MCP tools
 *
 * @param {number} campaignId - Campaign ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Metrics data structure
 */
async function fetchCampaignMetrics(campaignId, startDate, endDate) {
  // This is a placeholder - actual implementation will be in SKILL.md
  // Returns expected structure based on Iterable API

  return {
    campaignId: campaignId,
    sent: 0,
    delivered: 0,
    bounced: 0,
    opened: 0,
    unique_opens: 0,
    clicked: 0,
    unique_clicks: 0,
    conversions: 0,
    unsubscribed: 0
  };
}

/**
 * Fetch period comparison data
 * Fetches metrics for both current and previous periods
 *
 * @param {Array} campaigns - List of campaign objects with IDs
 * @param {Object} dateRanges - Current and previous date ranges
 * @param {Object} dateRanges.current - Current period {start, end, days}
 * @param {Object} dateRanges.previous - Previous period {start, end, days}
 * @returns {Promise<Object>} Current and previous period data
 */
async function fetchPeriodComparison(campaigns, dateRanges) {
  // This will be implemented in SKILL.md with actual MCP calls
  // Placeholder structure:

  const currentMetrics = {
    sent: 0,
    delivered: 0,
    bounced: 0,
    opened: 0,
    unique_opens: 0,
    clicked: 0,
    unique_clicks: 0,
    conversions: 0,
    unsubscribed: 0,
    campaigns: []
  };

  const previousMetrics = {
    sent: 0,
    delivered: 0,
    bounced: 0,
    opened: 0,
    unique_opens: 0,
    clicked: 0,
    unique_clicks: 0,
    conversions: 0,
    unsubscribed: 0,
    campaigns: []
  };

  // Aggregate metrics from all campaigns
  for (const campaign of campaigns) {
    // Fetch current period metrics
    const currentCampaignMetrics = await fetchCampaignMetrics(
      campaign.id,
      dateRanges.current.start,
      dateRanges.current.end
    );

    // Aggregate to total
    currentMetrics.sent += currentCampaignMetrics.sent;
    currentMetrics.delivered += currentCampaignMetrics.delivered;
    currentMetrics.bounced += currentCampaignMetrics.bounced;
    currentMetrics.opened += currentCampaignMetrics.opened;
    currentMetrics.unique_opens += currentCampaignMetrics.unique_opens;
    currentMetrics.clicked += currentCampaignMetrics.clicked;
    currentMetrics.unique_clicks += currentCampaignMetrics.unique_clicks;
    currentMetrics.conversions += currentCampaignMetrics.conversions;
    currentMetrics.unsubscribed += currentCampaignMetrics.unsubscribed;

    currentMetrics.campaigns.push({
      ...campaign,
      ...currentCampaignMetrics
    });

    // Fetch previous period metrics
    const previousCampaignMetrics = await fetchCampaignMetrics(
      campaign.id,
      dateRanges.previous.start,
      dateRanges.previous.end
    );

    previousMetrics.sent += previousCampaignMetrics.sent;
    previousMetrics.delivered += previousCampaignMetrics.delivered;
    previousMetrics.bounced += previousCampaignMetrics.bounced;
    previousMetrics.opened += previousCampaignMetrics.opened;
    previousMetrics.unique_opens += previousCampaignMetrics.unique_opens;
    previousMetrics.clicked += previousCampaignMetrics.clicked;
    previousMetrics.unique_clicks += previousCampaignMetrics.unique_clicks;
    previousMetrics.conversions += previousCampaignMetrics.conversions;
    previousMetrics.unsubscribed += previousCampaignMetrics.unsubscribed;

    previousMetrics.campaigns.push({
      ...campaign,
      ...previousCampaignMetrics
    });
  }

  return {
    current: {
      ...currentMetrics,
      period: dateRanges.current
    },
    previous: {
      ...previousMetrics,
      period: dateRanges.previous
    }
  };
}

/**
 * Parse metrics response from Iterable MCP
 * Handles the actual response structure from campaign metrics API
 *
 * @param {Object} response - Raw MCP response
 * @returns {Object} Structured metrics data
 */
function parseMetricsResponse(response) {
  // Handle the actual Iterable MCP response structure
  // Based on standard email marketing metrics, expect:
  // - Campaign-level metrics with counts
  // - Unique and total engagement metrics

  return {
    campaignId: response.campaignId || response.id,
    sent: response.sent || response.emailSent || 0,
    delivered: response.delivered || response.emailDelivered || 0,
    bounced: response.bounced || response.emailBounced || 0,
    opened: response.opened || response.totalOpens || 0,
    unique_opens: response.uniqueOpens || response.unique_opens || response.opened || 0,
    clicked: response.clicked || response.totalClicks || 0,
    unique_clicks: response.uniqueClicks || response.unique_clicks || response.clicked || 0,
    conversions: response.conversions || response.purchases || 0,
    unsubscribed: response.unsubscribed || response.unsubscribes || 0
  };
}

module.exports = {
  fetchCampaignMetrics,
  fetchPeriodComparison,
  parseMetricsResponse
};
