/**
 * Braze MCP Connection Checker
 * Verifies MCP connection and returns connection status
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if Braze MCP is connected
 * @returns {Promise<Object|null>} Connection status or null if not connected
 */
async function checkMCPConnection() {
  try {
    // Attempt to list available functions
    // Note: This will be called from SKILL.md which has access to MCP tools
    // For now, this is a placeholder that will be replaced with actual MCP call

    // In SKILL.md, we'll call mcp__braze__list_functions directly
    // This file provides the logic flow

    return {
      connected: true,
      // Braze doesn't have a workspace concept like Customer.io
      // Connection is at the account level via API key
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
    return `# Braze MCP Setup Required

The Braze MCP server is not connected.

Please:
1. Install the \`uv\` command-line tool
2. Create a Braze API key with read-only permissions (38 endpoints)
3. Configure the Braze MCP server with your API key and REST endpoint
4. Restart Claude

See https://www.braze.com/docs/user_guide/brazeai/mcp_server/setup for details.`;
  }
}

module.exports = {
  checkMCPConnection,
  getSetupInstructions
};
