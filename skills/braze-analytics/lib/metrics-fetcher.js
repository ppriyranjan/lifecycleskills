/**
 * Braze Metrics Fetcher
 * Fetches campaign and Canvas metrics from Braze MCP
 */

/**
 * Fetch campaign data series for a date range
 * Note: This will be called from SKILL.md which has access to MCP tools
 *
 * @param {string} campaignId - Campaign ID
 * @param {number} length - Number of days
 * @param {string} endingAt - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Campaign metrics data
 */
async function fetchCampaignDataSeries(campaignId, length, endingAt) {
  // This is a placeholder - actual implementation will be in SKILL.md
  // Returns expected Braze structure

  return {
    data: [{
      time: endingAt,
      messages: {
        sends: 0,
        direct_sends: 0,
        total_opens: 0,
        unique_opens: 0,
        unique_clicks: 0,
        total_clicks: 0,
        unsubscribes: 0,
        bounces: 0,
        delivered: 0,
        reported_spam: 0
      }
    }]
  };
}

/**
 * Fetch Canvas data series for a date range
 *
 * @param {string} canvasId - Canvas ID
 * @param {number} length - Number of days
 * @param {string} endingAt - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Canvas metrics data
 */
async function fetchCanvasDataSeries(canvasId, length, endingAt) {
  // Placeholder for Canvas analytics
  return {
    data: [{
      time: endingAt,
      stats: {
        total_stats: {
          revenue: 0,
          conversions: 0,
          entries: 0
        }
      }
    }]
  };
}

/**
 * Aggregate campaign metrics from data series
 * Braze returns time series data, we need to sum across the period
 *
 * @param {Array} dataSeries - Array of campaign data series responses
 * @returns {Object} Aggregated metrics
 */
function aggregateCampaignMetrics(dataSeries) {
  const aggregated = {
    sends: 0,
    direct_sends: 0,
    total_opens: 0,
    unique_opens: 0,
    unique_clicks: 0,
    total_clicks: 0,
    unsubscribes: 0,
    bounces: 0,
    delivered: 0,
    reported_spam: 0
  };

  dataSeries.forEach(series => {
    if (!series.data || !Array.isArray(series.data)) return;

    series.data.forEach(dataPoint => {
      const messages = dataPoint.messages || {};

      aggregated.sends += messages.sends || 0;
      aggregated.direct_sends += messages.direct_sends || 0;
      aggregated.total_opens += messages.total_opens || 0;
      aggregated.unique_opens += messages.unique_opens || 0;
      aggregated.unique_clicks += messages.unique_clicks || 0;
      aggregated.total_clicks += messages.total_clicks || 0;
      aggregated.unsubscribes += messages.unsubscribes || 0;
      aggregated.bounces += messages.bounces || 0;
      aggregated.delivered += messages.delivered || 0;
      aggregated.reported_spam += messages.reported_spam || 0;
    });
  });

  return aggregated;
}

/**
 * Parse campaign list response from Braze MCP
 *
 * @param {Object} response - Raw MCP response from get_campaign_list
 * @returns {Array} Array of campaign objects
 */
function parseCampaignList(response) {
  // Braze campaign list structure
  // Returns: { campaigns: [ { id, name, ... } ] }

  if (!response || !response.campaigns) {
    return [];
  }

  return response.campaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    description: campaign.description || '',
    created_at: campaign.created_at,
    updated_at: campaign.updated_at,
    archived: campaign.archived || false
  }));
}

/**
 * Parse Canvas list response from Braze MCP
 *
 * @param {Object} response - Raw MCP response from get_canvas_list
 * @returns {Array} Array of Canvas objects
 */
function parseCanvasList(response) {
  if (!response || !response.canvases) {
    return [];
  }

  return response.canvases.map(canvas => ({
    id: canvas.id,
    name: canvas.name,
    description: canvas.description || '',
    created_at: canvas.created_at,
    updated_at: canvas.updated_at,
    archived: canvas.archived || false
  }));
}

/**
 * Fetch period comparison data
 * Fetches campaign metrics for both current and previous periods
 *
 * @param {Array} campaignIds - Array of campaign IDs to fetch
 * @param {Object} dateRanges - Current and previous date ranges
 * @param {Object} dateRanges.current - Current period {start, end, days}
 * @param {Object} dateRanges.previous - Previous period {start, end, days}
 * @returns {Promise<Object>} Current and previous period data
 */
async function fetchPeriodComparison(campaignIds, dateRanges) {
  // This will be implemented in SKILL.md with actual MCP calls
  // Placeholder structure:

  const currentData = [];
  const previousData = [];

  // For each campaign, fetch current and previous period data
  for (const campaignId of campaignIds) {
    const current = await fetchCampaignDataSeries(
      campaignId,
      dateRanges.current.days,
      dateRanges.current.end
    );
    currentData.push(current);

    const previous = await fetchCampaignDataSeries(
      campaignId,
      dateRanges.previous.days,
      dateRanges.previous.end
    );
    previousData.push(previous);
  }

  return {
    current: {
      metrics: aggregateCampaignMetrics(currentData),
      campaigns: currentData,
      period: dateRanges.current
    },
    previous: {
      metrics: aggregateCampaignMetrics(previousData),
      campaigns: previousData,
      period: dateRanges.previous
    }
  };
}

module.exports = {
  fetchCampaignDataSeries,
  fetchCanvasDataSeries,
  aggregateCampaignMetrics,
  parseCampaignList,
  parseCanvasList,
  fetchPeriodComparison
};
