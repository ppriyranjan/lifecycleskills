/**
 * Customer.io MCP Connection Checker
 * Verifies MCP connection and returns workspace context
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if Customer.io MCP is connected
 * @returns {Promise<Object|null>} Workspace context or null if not connected
 */
async function checkMCPConnection() {
  try {
    // Attempt to list workspaces
    // Note: This will be called from SKILL.md which has access to MCP tools
    // For now, this is a placeholder that will be replaced with actual MCP call

    // In SKILL.md, we'll call mcp__customerio__list_workspaces directly
    // This file provides the logic flow

    return {
      connected: true,
      workspace: null // Will be populated from SKILL.md
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get MCP setup instructions
 * @returns {string} Formatted setup instructions
 */
function getSetupInstructions() {
  const instructionsPath = path.join(__dirname, '..', 'templates', 'setup-instructions.md');

  try {
    return fs.readFileSync(instructionsPath, 'utf8');
  } catch (error) {
    // Fallback if file doesn't exist
    return `# Customer.io MCP Setup Required

The Customer.io MCP server is not connected.

Please:
1. Enable "Customer.io AI" and "Customer.io MCP" in Settings > Privacy, Data, & AI
2. Add MCP server URL (https://mcp.customer.io/mcp or https://mcp-eu.customer.io/mcp)
3. Restart Claude Desktop

See https://docs.customer.io/ai/mcp-server/ for details.`;
  }
}

module.exports = {
  checkMCPConnection,
  getSetupInstructions
};
