#!/usr/bin/env node

/**
 * Test script for Customer.io MCP integration
 * This script will call the MCP tools and document their responses
 */

async function testCustomerIOMCP() {
  const baseUrl = 'https://mcp.customer.io/mcp';

  console.log('='.repeat(80));
  console.log('Customer.io MCP Integration Test');
  console.log('='.repeat(80));
  console.log();

  // Test 1: List available tools
  console.log('TEST 1: Discovering available tools');
  console.log('-'.repeat(80));
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      })
    });

    const data = await response.json();
    console.log('Available Tools:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Test 2: List workspaces
  console.log('TEST 2: List Workspaces');
  console.log('-'.repeat(80));
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'list_workspaces',
          arguments: {}
        }
      })
    });

    const data = await response.json();
    console.log('Tool: list_workspaces');
    console.log('Parameters: {}');
    console.log('Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Test 3: List campaigns
  console.log('TEST 3: List Campaigns');
  console.log('-'.repeat(80));
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'list',
          arguments: {
            type: 'campaigns'
          }
        }
      })
    });

    const data = await response.json();
    console.log('Tool: list');
    console.log('Parameters: { type: "campaigns" }');
    console.log('Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Test 4: Get metrics
  console.log('TEST 4: Get Metrics (default date range)');
  console.log('-'.repeat(80));
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'metrics',
          arguments: {}
        }
      })
    });

    const data = await response.json();
    console.log('Tool: metrics');
    console.log('Parameters: {}');
    console.log('Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Test 5: Get metrics with date range (last 7 days)
  console.log('TEST 5: Get Metrics (last 7 days)');
  console.log('-'.repeat(80));
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 5,
        method: 'tools/call',
        params: {
          name: 'metrics',
          arguments: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          }
        }
      })
    });

    const data = await response.json();
    console.log('Tool: metrics');
    console.log(`Parameters: { start: "${startDate.toISOString().split('T')[0]}", end: "${endDate.toISOString().split('T')[0]}" }`);
    console.log('Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Test 6: Get metrics with date range (last 30 days)
  console.log('TEST 6: Get Metrics (last 30 days)');
  console.log('-'.repeat(80));
  const endDate30 = new Date();
  const startDate30 = new Date();
  startDate30.setDate(startDate30.getDate() - 30);

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 6,
        method: 'tools/call',
        params: {
          name: 'metrics',
          arguments: {
            start: startDate30.toISOString().split('T')[0],
            end: endDate30.toISOString().split('T')[0]
          }
        }
      })
    });

    const data = await response.json();
    console.log('Tool: metrics');
    console.log(`Parameters: { start: "${startDate30.toISOString().split('T')[0]}", end: "${endDate30.toISOString().split('T')[0]}" }`);
    console.log('Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('='.repeat(80));
  console.log('Testing Complete');
  console.log('='.repeat(80));
}

testCustomerIOMCP().catch(console.error);
