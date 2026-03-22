# Publishing Your Claude Code Skills Plugin

This guide walks you through the steps to publish your lifecycle marketing skills plugin for public use.

## Quick Summary

Your plugin is now properly structured and ready to publish! Here's what you need to do:

1. **Test locally** - Verify skills work correctly
2. **Publish to GitHub** - Make it publicly accessible
3. **Update URLs** - Replace placeholder URLs with your actual GitHub repo
4. **(Optional) Submit to marketplace** - Get listed in official Claude plugin marketplace

---

## Step 1: Test Locally

Before publishing, test your plugin locally to ensure everything works:

### Option A: Test with --plugin-dir flag

```bash
# From the plugin directory
cd /Users/priyranjan/Documents/Lifecycle\ Skills

# Launch Claude Code with this plugin loaded
claude --plugin-dir .

# Or use the full path from anywhere
claude --plugin-dir "/Users/priyranjan/Documents/Lifecycle Skills"
```

### Option B: Create a symlink (for easier testing)

```bash
# Create symlink in Claude Code's plugin directory
ln -s "/Users/priyranjan/Documents/Lifecycle Skills" ~/.claude/plugins/lifecycle-marketing-skills

# Then just launch Claude Code normally
claude
```

### Test Each Skill

Once Claude Code is running:

```bash
# List available skills (verify your skills appear)
/skills

# Test the Jira skill (requires Atlassian MCP configured)
/lifecycle-marketing-skills:jira-lifecycle-ideas

# Test the Customer.io skill (requires Customer.io MCP configured)
/lifecycle-marketing-skills:cio-analytics
```

**Note:** The skills will be prefixed with your plugin name: `lifecycle-marketing-skills:`

### Reload After Making Changes

If you make changes while testing:

```bash
/reload-plugins
```

---

## Step 2: Clean Up Old Directories (Optional)

You now have duplicate directories:
- `jira-lifecycle-ideas/` (original)
- `reporting-customerio/` (original)
- `skills/` (new plugin structure)

Once you've verified the plugin works, you can remove the old directories:

```bash
# ONLY do this after verifying the plugin works!
rm -rf jira-lifecycle-ideas/
rm -rf reporting-customerio/

# Also remove these if not needed:
rm -rf .claude/
rm test_customerio_mcp.js
rm Claude.md
```

This will leave you with a clean plugin structure:

```
lifecycle-marketing-skills/
├── .claude-plugin/
├── skills/
├── .git/
├── README.md
├── LICENSE
└── PUBLISHING.md (this file)
```

---

## Step 3: Publish to GitHub

### Create GitHub Repository

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `lifecycle-marketing-skills`
   - Description: "Claude Code skills for lifecycle marketing teams using Customer.io and Jira"
   - Make it **Public** (required for installation via `claude plugin install`)
   - Don't initialize with README (you already have one)

2. **Update the repository URL in your files:**

Edit `.claude-plugin/plugin.json` and replace:
```json
"repository": "https://github.com/YOUR-USERNAME/lifecycle-marketing-skills",
"homepage": "https://github.com/YOUR-USERNAME/lifecycle-marketing-skills",
```

With your actual GitHub username:
```json
"repository": "https://github.com/yourusername/lifecycle-marketing-skills",
"homepage": "https://github.com/yourusername/lifecycle-marketing-skills",
```

Also update README.md installation instructions with your actual username.

### Push to GitHub

```bash
# Initialize git (if not already done - you already have .git/)
git init

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/lifecycle-marketing-skills.git

# Stage all plugin files
git add .claude-plugin/ skills/ README.md LICENSE PUBLISHING.md

# Create commit
git commit -m "Initial release of lifecycle marketing skills plugin

- Added jira-lifecycle-ideas skill for campaign generation
- Added cio-analytics skill for Customer.io reporting
- Includes full documentation and setup instructions"

# Push to GitHub
git push -u origin master
```

### Create a Release (Recommended)

Creating releases helps users track versions:

```bash
# Tag version 1.0.0
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"
git push origin v1.0.0
```

Or create a release via GitHub UI:
- Go to your repo → Releases → "Create a new release"
- Tag: `v1.0.0`
- Title: `v1.0.0 - Initial Release`
- Description: Summarize what's included

---

## Step 4: Installation by Others

Once published, anyone can install your plugin:

### Installation Command

```bash
# Replace YOUR-USERNAME with your actual GitHub username
claude plugin install github:YOUR-USERNAME/lifecycle-marketing-skills
```

### Verification

Users can verify installation:

```bash
# List installed plugins
claude plugin list

# See available skills
/skills
```

Your skills will appear as:
- `/lifecycle-marketing-skills:jira-lifecycle-ideas`
- `/lifecycle-marketing-skills:cio-analytics`

---

## Step 5: (Optional) Submit to Official Marketplace

For maximum discoverability, submit your plugin to the official Claude plugin marketplace:

### Submission Options

**Option 1: Via Platform**
- Visit: https://platform.claude.com/plugins/submit
- Fill out the submission form
- Provide your GitHub repository URL

**Option 2: Via Claude.ai**
- Visit: https://claude.ai/settings/plugins/submit
- Follow the submission workflow

### What to Include in Submission

- **Plugin Name:** Lifecycle Marketing Skills
- **Description:** Claude Code skills for lifecycle marketing teams using Customer.io and Jira
- **Category:** Marketing / Analytics / Developer Tools
- **Repository:** Your GitHub URL
- **Keywords:** customer.io, jira, lifecycle-marketing, analytics, campaigns
- **Prerequisites:** Atlassian Jira MCP, Customer.io MCP

### Review Process

- Anthropic reviews submissions for quality and security
- Review typically takes 1-2 weeks
- You'll be notified via email when approved

---

## Step 6: Maintain and Update

### Making Updates

When you improve your skills:

```bash
# Make your changes
# ...

# Update version in .claude-plugin/plugin.json
# Bump version: 1.0.0 → 1.1.0 (for minor changes)
#              1.0.0 → 2.0.0 (for breaking changes)

# Commit and tag
git add .
git commit -m "Version 1.1.0: Added X feature"
git tag -a v1.1.0 -m "Version 1.1.0"
git push origin master v1.1.0
```

### Users Update With

```bash
claude plugin update lifecycle-marketing-skills
```

---

## Directory Structure After Publishing

Your final published structure should look like:

```
lifecycle-marketing-skills/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── jira-lifecycle-ideas/
│   │   ├── SKILL.md
│   │   ├── CAMPAIGN_TEMPLATES.md
│   │   ├── LIFECYCLE_FRAMEWORK.md
│   │   └── JIRA_SETUP.md
│   └── cio-analytics/
│       ├── SKILL.md
│       ├── README.md
│       ├── lib/
│       └── templates/
├── .git/
├── README.md
├── LICENSE
└── PUBLISHING.md
```

---

## Troubleshooting

### Plugin not loading

**Check:**
- `.claude-plugin/plugin.json` exists and is valid JSON
- `skills/` directory exists at root level
- Each skill has a `SKILL.md` file

**Test:**
```bash
# Validate JSON
cat .claude-plugin/plugin.json | python3 -m json.tool
```

### Skills not appearing

**Check:**
- Each SKILL.md has proper frontmatter (YAML between `---` markers)
- Frontmatter includes `name:` and `description:` fields

**Example SKILL.md frontmatter:**
```yaml
---
name: skill-name
description: What this skill does
---
```

### Installation fails for others

**Check:**
- GitHub repository is **Public** (not private)
- Repository URL in plugin.json matches actual GitHub URL
- All files are committed and pushed

---

## Support and Community

Once published:
- Enable GitHub Issues for user support
- Consider adding a CONTRIBUTING.md for contributions
- Create GitHub Discussions for community Q&A
- Add badges to README (stars, issues, license)

---

## Next Steps

1. ✅ Test locally with `claude --plugin-dir .`
2. ✅ Clean up old directories (optional)
3. 🔲 Create GitHub repository
4. 🔲 Update URLs in plugin.json and README.md
5. 🔲 Push to GitHub
6. 🔲 Create v1.0.0 release tag
7. 🔲 Share installation command with your team
8. 🔲 (Optional) Submit to official marketplace

---

**You're ready to publish! 🚀**

Your plugin is properly structured according to Claude Code's official plugin specification. Just follow the steps above to make it publicly available.
