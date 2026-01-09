# Development Setup Guide

This guide provides opinionated instructions for setting up a development environment for this project on **macOS**.

## Prerequisites

### 1. Homebrew

Install Homebrew (macOS package manager) if you haven't already:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Node.js and npm

Install Node.js (includes npm):

```bash
brew install node
```

Verify installation:

```bash
node --version
npm --version
```

**Note:** `npx` comes bundled with npm, so you don't need to install it separately.

## Code Editor: Visual Studio Code

### Install VS Code

```bash
brew install --cask visual-studio-code
```

Or download directly from [code.visualstudio.com](https://code.visualstudio.com/)

### Recommended Extensions

Install these extensions for an optimal development experience:

#### Essential Extensions

1. **Live Server** (`ritwickdey.LiveServer`)
   - Run a local development server with live reload
   - Right-click `index.html` → "Open with Live Server"

   ```bash
   code --install-extension ritwickdey.LiveServer
   ```

2. **Markdown All in One** (`yzhang.markdown-all-in-one`)
   - Keyboard shortcuts, auto-preview, and formatting for Markdown

   ```bash
   code --install-extension yzhang.markdown-all-in-one
   ```

3. **markdownlint** (`DavidAnson.vscode-markdownlint`)
   - Markdown linting and style checking

   ```bash
   code --install-extension DavidAnson.vscode-markdownlint
   ```

4. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Autocomplete, syntax highlighting for Tailwind classes

   ```bash
   code --install-extension bradlc.vscode-tailwindcss
   ```

5. **ESLint** (`dbaeumer.vscode-eslint`)
   - JavaScript/TypeScript linting

   ```bash
   code --install-extension dbaeumer.vscode-eslint
   ```

6. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
   - Automatic code formatting

   ```bash
   code --install-extension esbenp.prettier-vscode
   ```

#### GitHub Integration

1. **GitHub Copilot** (`GitHub.copilot`)
   - AI-powered code completion (requires GitHub Copilot subscription)

   ```bash
   code --install-extension GitHub.copilot
   ```

2. **GitHub Copilot Chat** (`GitHub.copilot-chat`)
   - Interactive AI assistant for coding

   ```bash
   code --install-extension GitHub.copilot-chat
   ```

#### Optional but Useful

1. **GitLens** (`eamodio.gitlens`)
   - Enhanced Git integration and history visualization

   ```bash
   code --install-extension eamodio.gitlens
   ```

2. **Path Intellisense** (`christian-kohler.path-intellisense`)
    - Autocomplete for file paths

    ```bash
    code --install-extension christian-kohler.path-intellisense
    ```

### Install All Extensions at Once

```bash
code --install-extension ritwickdey.LiveServer \
     --install-extension yzhang.markdown-all-in-one \
     --install-extension DavidAnson.vscode-markdownlint \
     --install-extension bradlc.vscode-tailwindcss \
     --install-extension dbaeumer.vscode-eslint \
     --install-extension esbenp.prettier-vscode \
     --install-extension GitHub.copilot \
     --install-extension GitHub.copilot-chat \
     --install-extension eamodio.gitlens \
     --install-extension christian-kohler.path-intellisense
```

## AI Coding Assistant: Gemini Code Assist

### Setting Up Gemini in VS Code

1. **Get API Key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key for Gemini Pro

2. **Configure in VS Code:**

   Option A: Using Copilot Chat (if you have access)
   - Copilot Chat can be configured to use different models
   - Follow the prompts in the Copilot Chat settings

   Option B: Using a Gemini-specific Extension
   - Search for "Gemini" in VS Code Extensions marketplace
   - Install an extension like "Gemini Code Assist" or "Google Cloud Code"
   - Configure with your API key through extension settings

3. **Store API Key Securely:**

   **Option 1: Environment Variable (Recommended)**

   Add to your `~/.zshrc` or `~/.bash_profile`:

   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```

   Reload shell:

   ```bash
   source ~/.zshrc
   ```

   **Option 2: VS Code Settings (User Settings)**

   - Open VS Code Settings (`Cmd + ,`)
   - Search for "Gemini" or the specific extension name
   - Add your API key in the extension's settings
   - These are stored in `~/Library/Application Support/Code/User/settings.json`

   **⚠️ Security Note:** Never commit API keys to version control. Make sure your `.gitignore` includes any local configuration files.

## Project Setup

### Clone the Repository

```bash
git clone https://github.com/rrust/ew-bachelor.git
cd ew-bachelor
```

### Open in VS Code

```bash
code .
```

### Start Development Server

1. Open `index.html` in VS Code
2. Right-click anywhere in the file
3. Select "Open with Live Server"
4. Your default browser will open at `http://127.0.0.1:5500/`

The page will automatically reload when you make changes to any files.

## Development Workflow

### Editing Content

Content is stored in `content/` directory with a hierarchical structure:

```text
content/
  modules.json                          # Module metadata
  01-ernaehrungslehre-grundlagen/      # Module folder
    01-grundlagen-zellbiologie/        # Lecture folder
      lecture.md                       # Lecture content
      quiz.md                          # Quiz questions
```

When editing Markdown files:

1. Use the Markdown preview in VS Code (`Cmd + Shift + V`)
2. Lint files with: `npx markdownlint-cli2 "content/**/*.md"`
3. Auto-fix issues: `npx markdownlint-cli2 --fix "content/**/*.md"`

### JavaScript Development

- Main app logic: `app.js`
- Utilities: `js/parser.js`, `js/progress.js`
- Use browser DevTools (`Cmd + Option + I`) for debugging

### Testing Changes

1. Make your changes
2. Check the browser (Live Server auto-reloads)
3. Open DevTools Console to check for errors
4. Test all affected functionality manually

### Version Control

```bash
# Check status
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add feature X"

# Push to GitHub (auto-deploys to GitHub Pages)
git push origin main
```

## Useful Commands

```bash
# Lint all Markdown files
npx markdownlint-cli2 "**/*.md"

# Fix Markdown linting issues
npx markdownlint-cli2 --fix "**/*.md"

# Check for broken links in Markdown (requires markdown-link-check)
npx markdown-link-check content/**/*.md

# Serve locally with a simple HTTP server (alternative to Live Server)
npx http-server -p 8080
```

## Troubleshooting

### Issue: CORS errors when opening index.html directly

**Solution:** Use Live Server extension or run a local web server. Opening the file directly with `file://` protocol causes CORS issues when fetching content.

### Issue: Changes not reflecting in browser

**Solution:**

1. Hard refresh: `Cmd + Shift + R`
2. Clear browser cache
3. Restart Live Server

### Issue: Markdown not rendering correctly

**Solution:**

1. Check console for parsing errors
2. Validate YAML frontmatter syntax
3. Ensure proper `---` separators between sections
4. Run markdown linter: `npx markdownlint-cli2 "content/**/*.md"`

### Issue: GitHub Pages not updating

**Solution:**

1. Check the Actions tab on GitHub for deployment status
2. Wait 1-2 minutes after pushing
3. Hard refresh the deployed site: `Cmd + Shift + R`
4. Check that `.nojekyll` file exists in the root

## Additional Resources

- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Google Gemini API Documentation](https://ai.google.dev/docs)

## Getting Help

- Check `GEMINI.md` for AI coding agent instructions
- Review `WIP/Learning_Flow_Concept.md` for feature planning
- See `WIP/Nice_To_Have_Features.md` for enhancement ideas
- Open an issue on GitHub if you encounter problems
