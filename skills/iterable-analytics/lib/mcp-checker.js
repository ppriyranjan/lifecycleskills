/**
 * Iterable MCP Connection Checker
 * Verifies MCP connection and returns project context
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if Iterable MCP is connected
 * @returns {Promise<Object|null>} Project context or null if not connected
 */
async function checkMCPConnection() {
  try {
    // Attempt to verify connection with Iterable MCP
    // Note: This will be called from SKILL.md which has access to MCP tools
    // For now, this is a placeholder that will be replaced with actual MCP call

    // In SKILL.md, we'll call iterable_get_campaigns directly
    // This file provides the logic flow

    return {
      connected: true,
      project: null // Will be populated from SKILL.md
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
    return `# Iterable MCP Setup Required

The Iterable MCP server is not connected.

Please follow these steps:

1. Install Node.js v20 or later (v22 LTS recommended)
2. Run the setup wizard:
   \`\`\`bash
   npx @iterable/mcp setup
   \`\`\`

   For Claude Code specifically:
   \`\`\`bash
   npx @iterable/mcp setup --claude-code
   \`\`\`

3. Add your Iterable API key when prompted
4. Restart Claude Desktop/Code/Cursor
5. Verify Iterable's MCP Server appears in developer/tools settings

See https://support.iterable.com/hc/en-us/articles/42936790497812 for detailed instructions.`;
  }
}

module.exports = {
  checkMCPConnection,
  getSetupInstructions
};
