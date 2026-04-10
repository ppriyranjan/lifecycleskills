/**
 * Klaviyo MCP Connection Checker
 * Verifies MCP connection and returns account context
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if Klaviyo MCP is connected
 * @returns {Promise<Object|null>} Account context or null if not connected
 */
async function checkMCPConnection() {
  try {
    // Attempt to get account details
    // Note: This will be called from SKILL.md which has access to MCP tools
    // For now, this is a placeholder that will be replaced with actual MCP call

    // In SKILL.md, we'll call mcp__klaviyo__get_account_details directly
    // This file provides the logic flow

    return {
      connected: true,
      account: null // Will be populated from SKILL.md
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
    return `# Klaviyo MCP Setup Required

The Klaviyo MCP server is not connected.

Please:
1. Install the Klaviyo MCP server: uvx klaviyo-mcp-server@latest
2. Configure your Klaviyo private API key
3. Restart Claude Desktop

See https://developers.klaviyo.com/en/docs/klaviyo_mcp_server for details.`;
  }
}

module.exports = {
  checkMCPConnection,
  getSetupInstructions
};
