# Coding with AI Support

This repository is maintained with extensive AI assistance using **GitHub Copilot** in agent mode and **Google Gemini 2.5 Flash**. This document explains the tools, workflows, and best practices for AI-assisted development in this project.

## Why AI-Assisted Development?

The project maintainer is not a professional software engineer, so AI coding assistants handle most of the technical implementation while the maintainer focuses on:

- Defining learning objectives and content structure
- Creating and curating educational content
- Testing and providing feedback on features
- Making product and UX decisions

## AI Tools Used

### 1. GitHub Copilot (with Agent Mode)

**Primary use:** Real-time code suggestions, inline completions, and automated refactoring

**VS Code Extension:** `GitHub.copilot` + `GitHub.copilot-chat`

**Capabilities:**

- Inline code suggestions as you type
- Multi-line completions based on context
- Agent mode for autonomous task completion
- Chat interface for explaining code and debugging

**Usage Examples:**

- Type a comment describing what you need, get complete function implementations
- Highlight code and ask "Explain this" or "Optimize this"
- Use `/fix` command to automatically fix errors
- Use agent mode to implement entire features: "@workspace implement a progress dashboard"

### 2. Google Gemini 2.5 Flash

**Primary use:** Complex architectural decisions, content generation, and multi-file refactoring

**Access Methods:**

1. **VS Code Extension:** "Gemini Code Assist" or similar extensions
2. **Web Interface:** [Google AI Studio](https://aistudio.google.com/)
3. **API Integration:** Direct API calls via custom scripts

**Why Gemini 2.5 Flash:**

- Long context window (1M+ tokens) - can process entire codebase
- Strong reasoning capabilities for architectural decisions
- Excellent at understanding project structure and conventions
- Fast response times for iterative development

**Typical Workflow with Gemini:**

1. Share the entire project structure and relevant files
2. Reference `docs/GEMINI.md` for project conventions
3. Ask Gemini to implement features, refactor code, or solve complex problems
4. Copy generated code back to VS Code
5. Test and iterate

## Setup Instructions

### GitHub Copilot Setup

1. **Subscribe to GitHub Copilot:**
   - Personal account: [github.com/features/copilot](https://github.com/features/copilot)
   - Or through your organization

2. **Install VS Code Extensions:**

   ```bash
   code --install-extension GitHub.copilot
   code --install-extension GitHub.copilot-chat
   ```

3. **Sign in:**
   - Open VS Code
   - Click on the Copilot icon in the status bar
   - Sign in with your GitHub account

4. **Enable Agent Mode:**
   - Open Copilot Chat (`Cmd + Shift + I`)
   - Use `@workspace` mentions to enable agent capabilities
   - Agent can autonomously browse files, make edits, and run commands

### Gemini Setup

#### Option 1: Using Gemini Code Assist Extension

1. **Get API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key for Gemini 2.5 Flash

2. **Install Extension:**
   - Search for "Gemini" in VS Code Extensions marketplace
   - Install an extension like "Gemini Code Assist" or "Google AI Code Assist"

3. **Configure API Key:**
   - Add to environment variable (recommended):

     ```bash
     export GEMINI_API_KEY="your-api-key-here"
     ```

   - Or add to VS Code settings (less secure)

#### Option 2: Using Web Interface

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Select "Gemini 2.5 Flash" model
3. Paste project files and context
4. Use the chat interface for assistance

## Development Workflow with AI

### For Small Changes (Use Copilot)

1. Open the file you want to edit
2. Write a comment describing what you need
3. Press `Tab` to accept Copilot's suggestion
4. Test the change

**Example:**

```javascript
// Function to calculate average quiz score for a module
// [Copilot generates the complete function]
```

### For Medium Tasks (Use Copilot Chat)

1. Open Copilot Chat (`Cmd + Shift + I`)
2. Describe your task with `@workspace` context
3. Review and accept suggested changes
4. Test the implementation

**Example:**

```text
@workspace Add a badge placeholder for lectures without scores
```

### For Large Features (Use Gemini Agent Mode)

1. Document the feature requirements clearly
2. Share relevant context with Gemini:
   - Project structure
   - `docs/GEMINI.md` conventions
   - Related files
3. Ask Gemini to implement the feature
4. Copy generated code to your project
5. Test and iterate

**Example prompt for Gemini:**

```text
I need to implement a progress dashboard that shows:
- Overall completion percentage
- Module-by-module breakdown
- Study time statistics
- Recent achievements

Please implement this following the conventions in GEMINI.md.
Current project structure: [paste structure]
Relevant files: [paste app.js sections]
```

## Best Practices

### 1. Provide Clear Context

AI assistants work best with clear, specific instructions:

- ❌ "Fix the bug"
- ✅ "The module cards show incorrect badge colors. Badge should be gold (≥90%), silver (≥70%), bronze (≥50%)"

### 2. Reference Project Conventions

Always point AI to the project documentation:

- "Follow the naming conventions in GEMINI.md"
- "Use the content structure defined in docs/"
- "Match the existing code style in app.js"

### 3. Test AI-Generated Code

AI assistants can make mistakes. Always:

- Read generated code before accepting
- Test functionality manually
- Check browser console for errors
- Verify edge cases

### 4. Iterate Incrementally

Break large tasks into smaller steps:

- ❌ "Build a complete exam system"
- ✅ "First, create exam question structure. Then, add timer functionality. Finally, implement grading."

### 5. Use AI for Documentation

AI is excellent at:

- Generating code comments
- Writing README sections
- Creating API documentation
- Explaining complex code

### 6. Leverage Long Context (Gemini)

When using Gemini 2.5 Flash:

- Share the entire codebase for better understanding
- Reference multiple files in a single conversation
- Ask for refactoring across multiple files
- Request consistency checks

## Common AI Prompts for This Project

### Content Creation

```text
Generate a lecture on [topic] following the structure in 
content/01-ernaehrungslehre-grundlagen/01-grundlagen-zellbiologie/lecture.md
Include 3 self-assessment questions and a 7-question quiz.
```

### Feature Implementation

```text
@workspace Implement a feature to [description].
Follow the coding style in app.js and update GEMINI.md if needed.
```

### Debugging

```text
The quiz score calculation is incorrect. Here's the relevant code: [paste code]
Expected: [describe expected behavior]
Actual: [describe what happens]
```

### Refactoring

```text
Refactor the module card creation to use a card header/content/footer structure.
Header: status, ECTS, badge
Content: title and description
Footer: action buttons (right-aligned)
```

### Code Review

```text
Review this code for:
- Potential bugs
- Performance issues
- Code style consistency
- Accessibility concerns
[paste code]
```

## Limitations and Considerations

### When AI Struggles

- Complex state management across multiple files
- Subtle race conditions or timing issues
- Browser-specific quirks
- Performance optimization for large datasets

**Solution:** Break down the problem, provide more context, or handle manually

### Security Considerations

- Never share API keys in prompts or code
- Review AI-generated code for security issues
- Be cautious with localStorage and user data handling
- Validate all user inputs, even in AI-generated code

### Quality Assurance

AI-generated code should be treated like any other code:

- Manual testing is essential
- Code review best practices still apply
- Maintain consistent coding standards
- Document non-obvious decisions

## Tips for Effective AI Collaboration

1. **Be Specific:** Vague requests get vague results
2. **Provide Examples:** Show AI what you want with concrete examples
3. **Iterate:** Don't expect perfection on the first try
4. **Learn from AI:** Study generated code to improve your understanding
5. **Keep Context Fresh:** Remind AI of project conventions regularly
6. **Use Comments:** Well-commented code helps AI understand intent
7. **Maintain GEMINI.md:** Keep AI instructions up-to-date as the project evolves

## Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [VS Code AI Extensions](https://marketplace.visualstudio.com/search?term=AI&target=VSCode)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

## Project-Specific AI Instructions

For detailed AI coding agent instructions specific to this project, see [GEMINI.md](GEMINI.md).

This includes:

- Architecture overview
- Content format specifications
- Code structure conventions
- Progress tracking patterns
- UI component guidelines
- Agent behavior expectations
