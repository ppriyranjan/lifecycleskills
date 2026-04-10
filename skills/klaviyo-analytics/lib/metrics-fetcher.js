/**
 * Klaviyo Metrics Fetcher
 * Fetches campaign, flow, and reporting metrics from Klaviyo MCP
 */

/**
 * Fetch campaign report metrics for a campaign
 * Note: This will be called from SKILL.md which has access to MCP tools
 *
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} Campaign metrics data structure
 */
async function fetchCampaignReport(campaignId) {
  // This is a placeholder - actual implementation will be in SKILL.md
  // Returns expected structure

  return {
    id: campaignId,
    name: '',
    recipients: 0,
    delivered: 0,
    bounced: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    unsubscribed: 0,
    spam_complaints: 0,
    revenue: 0
  };
}

/**
 * Fetch flow report metrics for a flow
 *
 * @param {string} flowId - Flow ID
 * @returns {Promise<Object>} Flow metrics data structure
 */
async function fetchFlowReport(flowId) {
  // This is a placeholder - actual implementation will be in SKILL.md
  // Returns expected structure

  return {
    id: flowId,
    name: '',
    recipients: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    unsubscribed: 0,
    revenue: 0
  };
}

/**
 * Aggregate metrics across multiple campaigns or flows
 *
 * @param {Array<Object>} items - Array of campaign or flow metric objects
 * @returns {Object} Aggregated metrics
 */
function aggregateMetrics(items) {
  const aggregated = {
    recipients: 0,
    delivered: 0,
    bounced: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    unsubscribed: 0,
    spam_complaints: 0,
    revenue: 0
  };

  items.forEach(item => {
    aggregated.recipients += item.recipients || 0;
    aggregated.delivered += item.delivered || 0;
    aggregated.bounced += item.bounced || 0;
    aggregated.opened += item.opened || 0;
    aggregated.clicked += item.clicked || 0;
    aggregated.converted += item.converted || 0;
    aggregated.unsubscribed += item.unsubscribed || 0;
    aggregated.spam_complaints += item.spam_complaints || 0;
    aggregated.revenue += item.revenue || 0;
  });

  return aggregated;
}

/**
 * Parse campaign report response from Klaviyo MCP
 * Handles the actual response structure from get_campaign_report
 *
 * @param {Object} response - Raw MCP response from get_campaign_report
 * @param {string} campaignName - Campaign name (from get_campaigns)
 * @returns {Object} Structured campaign metrics
 */
function parseCampaignReportResponse(response, campaignName) {
  // Handle the Klaviyo MCP campaign report response structure
  // The report returns statistics for the campaign
  const stats = response.statistics || response.data || response || {};

  return {
    id: response.id || stats.campaign_id || '',
    name: campaignName || response.name || '',
    recipients: stats.recipients || stats.sends || 0,
    delivered: stats.delivered || 0,
    bounced: stats.bounced || stats.bounces || 0,
    opened: stats.opened || stats.unique_opens || 0,
    clicked: stats.clicked || stats.unique_clicks || 0,
    converted: stats.converted || stats.conversions || 0,
    unsubscribed: stats.unsubscribed || stats.unsubscribes || 0,
    spam_complaints: stats.spam_complaints || stats.spam || 0,
    revenue: stats.revenue || 0
  };
}

/**
 * Parse flow report response from Klaviyo MCP
 * Handles the actual response structure from get_flow_report
 *
 * @param {Object} response - Raw MCP response from get_flow_report
 * @param {string} flowName - Flow name (from get_flows)
 * @returns {Object} Structured flow metrics
 */
function parseFlowReportResponse(response, flowName) {
  const stats = response.statistics || response.data || response || {};

  return {
    id: response.id || stats.flow_id || '',
    name: flowName || response.name || '',
    recipients: stats.recipients || stats.sends || 0,
    delivered: stats.delivered || 0,
    opened: stats.opened || stats.unique_opens || 0,
    clicked: stats.clicked || stats.unique_clicks || 0,
    converted: stats.converted || stats.conversions || 0,
    unsubscribed: stats.unsubscribed || stats.unsubscribes || 0,
    revenue: stats.revenue || 0
  };
}

module.exports = {
  fetchCampaignReport,
  fetchFlowReport,
  aggregateMetrics,
  parseCampaignReportResponse,
  parseFlowReportResponse
};
