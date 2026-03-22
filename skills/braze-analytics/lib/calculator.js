/**
 * Braze Analytics Calculator
 * Handles date ranges, period comparisons, and derived metrics for Braze
 */

/**
 * Calculate date ranges for period comparison
 * @param {string} period - "7d", "30d", or "custom"
 * @param {string} customFrom - Start date for custom range (YYYY-MM-DD)
 * @param {string} customTo - End date for custom range (YYYY-MM-DD)
 * @returns {Object} Current and previous date ranges
 */
function calculateDateRanges(period = '7d', customFrom = null, customTo = null) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Custom date range
  if (customFrom && customTo) {
    const fromDate = new Date(customFrom);
    const toDate = new Date(customTo);
    const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    const previousEnd = new Date(fromDate);
    previousEnd.setDate(previousEnd.getDate() - 1);

    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - days + 1);

    return {
      current: {
        start: formatDate(fromDate),
        end: formatDate(toDate),
        days: days
      },
      previous: {
        start: formatDate(previousStart),
        end: formatDate(previousEnd),
        days: days
      }
    };
  }

  // Standard periods (7d or 30d)
  const days = period === '30d' ? 30 : 7;

  const currentEnd = yesterday;
  const currentStart = new Date(yesterday);
  currentStart.setDate(currentStart.getDate() - days + 1);

  const previousEnd = new Date(currentStart);
  previousEnd.setDate(previousEnd.getDate() - 1);

  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - days + 1);

  return {
    current: {
      start: formatDate(currentStart),
      end: formatDate(currentEnd),
      days: days
    },
    previous: {
      start: formatDate(previousStart),
      end: formatDate(previousEnd),
      days: days
    }
  };
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate change between two values
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {Object} Change details (absolute, percentage, trend)
 */
function calculateChange(current, previous) {
  // Handle zero or null values
  if (previous === 0 || previous === null || previous === undefined) {
    if (current > 0) {
      return {
        absolute: current,
        percentage: Infinity,
        trend: 'up',
        isNew: true
      };
    }
    return {
      absolute: 0,
      percentage: 0,
      trend: 'flat',
      isNew: true
    };
  }

  const absolute = current - previous;
  const percentage = (absolute / previous) * 100;

  // Determine trend (with 0.5% threshold for "flat")
  let trend = 'flat';
  if (Math.abs(percentage) > 0.5) {
    trend = percentage > 0 ? 'up' : 'down';
  }

  return {
    absolute: Math.round(absolute * 10) / 10,
    percentage: Math.round(percentage * 10) / 10,
    trend: trend,
    isNew: false
  };
}

/**
 * Calculate derived metrics (rates and percentages) for Braze
 * @param {Object} rawMetrics - Raw count metrics from Braze
 * @returns {Object} All metrics including calculated rates
 */
function calculateDerivedMetrics(rawMetrics) {
  const {
    sends = 0,
    direct_sends = 0,
    delivered = 0,
    bounces = 0,
    reported_spam = 0,
    unique_opens = 0,
    unique_clicks = 0,
    total_opens = 0,
    total_clicks = 0,
    unsubscribes = 0
  } = rawMetrics;

  return {
    // Raw counts
    sends,
    direct_sends,
    delivered,
    bounces,
    reported_spam,
    unique_opens,
    unique_clicks,
    total_opens,
    total_clicks,
    unsubscribes,

    // Deliverability rates
    delivery_rate: safePercentage(delivered, sends),
    bounce_rate: safePercentage(bounces, sends),
    spam_rate: safePercentage(reported_spam, sends),

    // Engagement rates (unique users)
    unique_open_rate: safePercentage(unique_opens, delivered),
    unique_click_rate: safePercentage(unique_clicks, delivered),
    click_to_open: safePercentage(unique_clicks, unique_opens),
    unsubscribe_rate: safePercentage(unsubscribes, delivered),

    // Total engagement rates (including machine activity)
    total_open_rate: safePercentage(total_opens, delivered),
    total_click_rate: safePercentage(total_clicks, delivered),

    // Machine activity estimation
    machine_opens: Math.max(0, total_opens - unique_opens),
    machine_clicks: Math.max(0, total_clicks - unique_clicks),
    machine_open_percentage: safePercentage(
      Math.max(0, total_opens - unique_opens),
      total_opens
    ),
    machine_click_percentage: safePercentage(
      Math.max(0, total_clicks - unique_clicks),
      total_clicks
    )
  };
}

/**
 * Safely calculate percentage, handling division by zero
 * @param {number} numerator - Top number
 * @param {number} denominator - Bottom number
 * @returns {number} Percentage rounded to 1 decimal place
 */
function safePercentage(numerator, denominator) {
  if (denominator === 0 || denominator === null || denominator === undefined) {
    return 0;
  }
  return Math.round((numerator / denominator) * 1000) / 10;
}

/**
 * Format trend indicator for display
 * @param {string} trend - 'up', 'down', or 'flat'
 * @returns {string} Arrow emoji
 */
function getTrendIndicator(trend) {
  const indicators = {
    up: '↗',
    down: '↘',
    flat: '→'
  };
  return indicators[trend] || '→';
}

/**
 * Format percentage change for display
 * @param {number} percentage - Percentage change
 * @param {string} trend - Trend direction
 * @returns {string} Formatted string like "+2.3%" or "-5.1%"
 */
function formatPercentageChange(percentage, trend) {
  if (percentage === Infinity) {
    return 'New';
  }
  if (percentage === 0) {
    return '0%';
  }
  const sign = trend === 'up' ? '+' : trend === 'down' ? '' : '';
  return `${sign}${percentage}%`;
}

/**
 * Calculate all metrics with period comparison
 * This is the main function that combines everything
 *
 * @param {Object} currentMetrics - Current period raw metrics
 * @param {Object} previousMetrics - Previous period raw metrics
 * @param {Object} dateRanges - Date range info with days
 * @returns {Object} Complete metrics with comparisons
 */
function calculateMetricsComparison(currentMetrics, previousMetrics, dateRanges) {
  // Calculate derived metrics for both periods
  const currentDerived = calculateDerivedMetrics(currentMetrics);
  const previousDerived = calculateDerivedMetrics(previousMetrics);

  // Calculate changes for all metrics
  const metrics = {};

  // List of all metrics to compare
  const metricsToCompare = [
    'sends', 'delivered', 'bounces', 'reported_spam',
    'unique_opens', 'unique_clicks', 'unsubscribes',
    'delivery_rate', 'bounce_rate', 'spam_rate',
    'unique_open_rate', 'unique_click_rate',
    'click_to_open', 'unsubscribe_rate'
  ];

  metricsToCompare.forEach(metricName => {
    const change = calculateChange(currentDerived[metricName], previousDerived[metricName]);

    metrics[metricName] = {
      current: currentDerived[metricName],
      previous: previousDerived[metricName],
      change: change.absolute,
      changePercentage: change.percentage,
      trend: change.trend,
      trendIndicator: getTrendIndicator(change.trend),
      changeFormatted: formatPercentageChange(change.percentage, change.trend)
    };
  });

  // Add total engagement info (no comparison needed for derived metrics)
  metrics.total_engagement = {
    total_opens: currentDerived.total_opens,
    total_clicks: currentDerived.total_clicks,
    total_open_rate: currentDerived.total_open_rate,
    total_click_rate: currentDerived.total_click_rate,
    machine_opens: currentDerived.machine_opens,
    machine_clicks: currentDerived.machine_clicks,
    machine_open_percentage: currentDerived.machine_open_percentage,
    machine_click_percentage: currentDerived.machine_click_percentage
  };

  return {
    metrics,
    dateRanges,
    summary: {
      current: currentDerived,
      previous: previousDerived
    }
  };
}

module.exports = {
  calculateDateRanges,
  calculateChange,
  calculateDerivedMetrics,
  calculateMetricsComparison,
  formatDate,
  getTrendIndicator,
  formatPercentageChange,
  safePercentage
};
