/**
 * Customer.io Metrics Fetcher
 * Fetches workspace and campaign metrics from Customer.io MCP
 */

/**
 * Fetch workspace metrics for a date range
 * Note: This will be called from SKILL.md which has access to MCP tools
 *
 * @param {number} workspaceId - Workspace ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Metrics data structure
 */
async function fetchWorkspaceMetrics(workspaceId, startDate, endDate) {
  // This is a placeholder - actual implementation will be in SKILL.md
  // Returns expected structure

  return {
    summary: {
      sent: 0,
      delivered: 0,
      bounced: 0,
      failed: 0,
      human_opened: 0,
      human_clicked: 0,
      converted: 0,
      unsubscribed: 0,
      machine_opened: 0,
      machine_clicked: 0
    },
    campaigns: []
  };
}

/**
 * Fetch period comparison data
 * Fetches metrics for both current and previous periods
 *
 * @param {number} workspaceId - Workspace ID
 * @param {Object} dateRanges - Current and previous date ranges
 * @param {Object} dateRanges.current - Current period {start, end, days}
 * @param {Object} dateRanges.previous - Previous period {start, end, days}
 * @returns {Promise<Object>} Current and previous period data
 */
async function fetchPeriodComparison(workspaceId, dateRanges) {
  // This will be implemented in SKILL.md with actual MCP calls
  // Placeholder structure:

  const current = await fetchWorkspaceMetrics(
    workspaceId,
    dateRanges.current.start,
    dateRanges.current.end
  );

  const previous = await fetchWorkspaceMetrics(
    workspaceId,
    dateRanges.previous.start,
    dateRanges.previous.end
  );

  return {
    current: {
      ...current,
      period: dateRanges.current
    },
    previous: {
      ...previous,
      period: dateRanges.previous
    }
  };
}

/**
 * Parse metrics response from Customer.io MCP
 * Handles the actual response structure from workspace metrics API
 *
 * @param {Object} response - Raw MCP response
 * @returns {Object} Structured metrics data
 */
function parseMetricsResponse(response) {
  // Handle the actual Customer.io MCP response structure
  // Based on exploration, workspace metrics returns:
  // - workspace_summary with aggregated metrics
  // - campaigns/newsletters array with per-campaign data

  const summary = response.workspace_summary || {};
  const campaigns = response.campaigns || response.newsletters || [];

  return {
    summary: {
      sent: summary.sent || 0,
      delivered: summary.delivered || 0,
      bounced: summary.bounced || 0,
      failed: summary.failed || 0,
      human_opened: summary.human_opened || 0,
      human_clicked: summary.human_clicked || 0,
      converted: summary.converted || 0,
      unsubscribed: summary.unsubscribed || 0,
      machine_opened: summary.machine_opened || summary.prefetch_opened || 0,
      machine_clicked: summary.machine_clicked || 0
    },
    campaigns: campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      sent: campaign.sent || 0,
      delivered: campaign.delivered || 0,
      bounced: campaign.bounced || 0,
      human_opened: campaign.human_opened || 0,
      human_clicked: campaign.human_clicked || 0,
      converted: campaign.converted || 0
    }))
  };
}

module.exports = {
  fetchWorkspaceMetrics,
  fetchPeriodComparison,
  parseMetricsResponse
};
