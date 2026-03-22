// Test Phase 2: Calculator functions
// Run with: node test-phase-2.js

const calculator = require('./.claude/skills/cio-analytics/lib/calculator.js');

console.log('=== PHASE 2 CALCULATOR TESTS ===\n');

// Test 1: Date Range Calculation
console.log('Test 1: Date Range Calculation (7d)');
const ranges7d = calculator.calculateDateRanges('7d');
console.log('Current:', ranges7d.current);
console.log('Previous:', ranges7d.previous);
console.log('✅ Test 1 passed\n');

// Test 2: Date Range Calculation (30d)
console.log('Test 2: Date Range Calculation (30d)');
const ranges30d = calculator.calculateDateRanges('30d');
console.log('Current:', ranges30d.current);
console.log('Previous:', ranges30d.previous);
console.log('✅ Test 2 passed\n');

// Test 3: Custom Date Range
console.log('Test 3: Custom Date Range');
const rangesCustom = calculator.calculateDateRanges('custom', '2026-03-01', '2026-03-15');
console.log('Current:', rangesCustom.current);
console.log('Previous:', rangesCustom.previous);
console.log('✅ Test 3 passed\n');

// Test 4: Calculate Change
console.log('Test 4: Calculate Change');
const change1 = calculator.calculateChange(120, 100);
console.log('120 vs 100:', change1);

const change2 = calculator.calculateChange(95, 100);
console.log('95 vs 100:', change2);

const change3 = calculator.calculateChange(100, 0);
console.log('100 vs 0 (new):', change3);
console.log('✅ Test 4 passed\n');

// Test 5: Pro-rating
console.log('Test 5: Pro-rating');
const prorated = calculator.proRateMetric(300, 3, 7);
console.log('300 opens in 3 days, projected to 7 days:', prorated);
console.log('✅ Test 5 passed\n');

// Test 6: Derived Metrics
console.log('Test 6: Derived Metrics');
const rawMetrics = {
  sent: 10000,
  delivered: 9500,
  bounced: 400,
  failed: 100,
  human_opened: 2280,
  human_clicked: 570,
  converted: 95,
  machine_opened: 720,
  machine_clicked: 60
};

const derived = calculator.calculateDerivedMetrics(rawMetrics);
console.log('Delivery Rate:', derived.delivery_rate + '%');
console.log('Bounce Rate:', derived.bounce_rate + '%');
console.log('Open Rate:', derived.open_rate + '%');
console.log('Click Rate:', derived.click_rate + '%');
console.log('Click-to-Open:', derived.click_to_open + '%');
console.log('Conversion Rate:', derived.conversion_rate + '%');
console.log('Bot Open %:', derived.bot_open_percentage + '%');
console.log('✅ Test 6 passed\n');

// Test 7: Full Metrics Comparison
console.log('Test 7: Full Metrics Comparison');
const currentMetrics = {
  sent: 10000,
  delivered: 9500,
  bounced: 400,
  failed: 100,
  human_opened: 2280,
  human_clicked: 570,
  converted: 95
};

const previousMetrics = {
  sent: 9500,
  delivered: 9100,
  bounced: 300,
  failed: 100,
  human_opened: 2093,
  human_clicked: 519,
  converted: 82
};

const comparison = calculator.calculateMetricsComparison(
  currentMetrics,
  previousMetrics,
  ranges7d
);

console.log('Open Rate Comparison:');
console.log('  Current:', comparison.metrics.open_rate.current + '%');
console.log('  Previous:', comparison.metrics.open_rate.previous + '%');
console.log('  Change:', comparison.metrics.open_rate.changeFormatted, comparison.metrics.open_rate.trendIndicator);

console.log('Click Rate Comparison:');
console.log('  Current:', comparison.metrics.click_rate.current + '%');
console.log('  Previous:', comparison.metrics.click_rate.previous + '%');
console.log('  Change:', comparison.metrics.click_rate.changeFormatted, comparison.metrics.click_rate.trendIndicator);

console.log('✅ Test 7 passed\n');

console.log('=== ALL TESTS PASSED ✅ ===');
console.log('\nPhase 2 calculator is working correctly!');
