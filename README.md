# Nutritional Science Learning App

A simple, client-side web application for learning nutritional science, built with vanilla HTML, CSS, and JavaScript.

## 🌐 Live Demo

The app is deployed and accessible at: **[https://rrust.github.io/ew-bachelor/](https://rrust.github.io/ew-bachelor/)**

## Overview

This project is a single-page application designed to provide a gamified learning experience for students of nutritional science. All content is rendered from local Markdown files, and user progress is stored in the browser's `localStorage`.

## Technology Stack

- **HTML**
- **Tailwind CSS** (via CDN)
- **Vanilla JavaScript**
- **GitHub Pages** (deployment)

There is no backend or build step required.

## Development Setup

For detailed instructions on setting up your development environment on macOS, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

Quick start:

1. Install [VS Code](https://code.visualstudio.com/) and the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clone this repository
3. Open the project in VS Code
4. Right-click `index.html` and select "Open with Live Server"

## How to Run Locally

1. Clone the repository.
2. Use a local web server extension (like VS Code's **Live Server**) to open `index.html`. This is necessary to avoid browser CORS errors when fetching content files.
3. Right-click `index.html` and select "Open with Live Server".

## Content Development

For creating and maintaining learning content (lectures, quizzes), see the comprehensive guide:
→ **[docs/CONTENT_DEVELOPMENT.md](docs/CONTENT_DEVELOPMENT.md)**

This includes:

- Content structure and formats
- YAML syntax rules and common mistakes  
- Validation workflow
- Templates and best practices
- Step-by-step workflows

## Deployment

The app is automatically deployed to GitHub Pages whenever changes are pushed to the `main` branch. The deployment typically takes 1-2 minutes to complete.

## Project Documentation

### For App Developers

- **[GEMINI.md](GEMINI.md)** - Instructions for AI coding agents (required in root)
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Complete development environment setup guide
- **[docs/AI_CODING.md](docs/AI_CODING.md)** - Guide to AI-assisted development workflow

### For Content Creators

- **[docs/CONTENT_DEVELOPMENT.md](docs/CONTENT_DEVELOPMENT.md)** - Complete guide to creating and maintaining learning content
- **[docs/CONTENT_TEMPLATES.md](docs/CONTENT_TEMPLATES.md)** - Copy-paste templates for lectures and quizzes
- **[studium/](studium/)** - Reference materials (curriculum overview)

### Planning & Features

- **[WIP/Learning_Flow_Concept.md](WIP/Learning_Flow_Concept.md)** - Feature planning and implementation roadmap
- **[WIP/Nice_To_Have_Features.md](WIP/Nice_To_Have_Features.md)** - Enhancement ideas and future features

## AI-Assisted Development

This project is developed using **GitHub Copilot Agent Mode** with **Gemini 2.0 Flash Experimental**. The AI handles implementation while the human maintainer focuses on content, UX, and testing. See [docs/AI_CODING.md](docs/AI_CODING.md) for details on this workflow.
