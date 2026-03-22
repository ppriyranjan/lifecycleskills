/**
 * Customer.io Analytics Calculator
 * Handles date ranges, period comparisons, pro-rating, and derived metrics
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
 * Pro-rate a metric for partial periods
 * Used when comparing incomplete periods (e.g., this week vs last week on Wednesday)
 *
 * @param {number} value - Actual value for partial period
 * @param {number} actualDays - Actual days elapsed
 * @param {number} targetDays - Target period length (for projection)
 * @returns {Object} Pro-rated details
 */
function proRateMetric(value, actualDays, targetDays) {
  // If periods are equal, no pro-rating needed
  if (actualDays === targetDays) {
    return {
      value: value,
      proRated: false,
      actualValue: value,
      actualDays: actualDays,
      targetDays: targetDays,
      dailyAverage: Math.round((value / actualDays) * 10) / 10
    };
  }

  // Calculate pro-rated projection
  const dailyAverage = value / actualDays;
  const proRatedValue = Math.round(dailyAverage * targetDays);

  return {
    value: proRatedValue,
    proRated: true,
    actualValue: value,
    actualDays: actualDays,
    targetDays: targetDays,
    dailyAverage: Math.round(dailyAverage * 10) / 10
  };
}

/**
 * Calculate derived metrics (rates and percentages)
 * @param {Object} rawMetrics - Raw count metrics
 * @returns {Object} All metrics including calculated rates
 */
function calculateDerivedMetrics(rawMetrics) {
  const {
    sent = 0,
    delivered = 0,
    bounced = 0,
    failed = 0,
    human_opened = 0,
    human_clicked = 0,
    converted = 0,
    unsubscribed = 0,
    machine_opened = 0,
    machine_clicked = 0
  } = rawMetrics;

  return {
    // Raw counts
    sent,
    delivered,
    bounced,
    failed,
    human_opened,
    human_clicked,
    converted,
    unsubscribed,
    machine_opened,
    machine_clicked,

    // Deliverability rates
    delivery_rate: safePercentage(delivered, sent),
    bounce_rate: safePercentage(bounced, sent),
    failure_rate: safePercentage(failed, sent),

    // Engagement rates (based on delivered, human-only)
    open_rate: safePercentage(human_opened, delivered),
    click_rate: safePercentage(human_clicked, delivered),
    click_to_open: safePercentage(human_clicked, human_opened),
    conversion_rate: safePercentage(converted, delivered),
    unsubscribe_rate: safePercentage(unsubscribed, delivered),

    // Bot activity percentages
    bot_open_percentage: safePercentage(machine_opened, human_opened + machine_opened),
    bot_click_percentage: safePercentage(machine_clicked, human_clicked + machine_clicked),

    // Total engagement (for reference)
    total_opened: human_opened + machine_opened,
    total_clicked: human_clicked + machine_clicked
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
    'sent', 'delivered', 'bounced', 'failed',
    'human_opened', 'human_clicked', 'converted', 'unsubscribed',
    'delivery_rate', 'bounce_rate', 'open_rate', 'click_rate',
    'click_to_open', 'conversion_rate'
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

  // Add bot activity info (no comparison needed)
  metrics.bot_activity = {
    machine_opened: currentDerived.machine_opened,
    machine_clicked: currentDerived.machine_clicked,
    bot_open_percentage: currentDerived.bot_open_percentage,
    bot_click_percentage: currentDerived.bot_click_percentage,
    total_opened: currentDerived.total_opened,
    total_clicked: currentDerived.total_clicked
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
  proRateMetric,
  calculateDerivedMetrics,
  calculateMetricsComparison,
  formatDate,
  getTrendIndicator,
  formatPercentageChange,
  safePercentage
};
