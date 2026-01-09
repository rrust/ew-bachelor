# Content Structure Quick Reference

This document provides a quick overview of the modular content structure used in this project.

## Directory Structure

```text
content/
  modules.json                  # Module definitions
  content-list.json             # Registry of all files
  NN-module-name/              # Module folder
    NN-lecture-topic/          # Lecture folder
      lecture.md               # Lecture metadata
      lecture-items/           # Learning content
        NN-name.md            # Individual items
      quiz.md                  # Quiz metadata  
      questions/               # Quiz questions
        NN-topic.md           # Individual questions
```

## File Purposes

| File                    | Contains                           | Example                         |
| ----------------------- | ---------------------------------- | ------------------------------- |
| `lecture.md`            | Topic, description (metadata only) | Lecture title and intro         |
| `lecture-items/NN-*.md` | One learning item each             | Text, video, diagram, self-test |
| `quiz.md`               | Quiz description (metadata only)   | Quiz title and intro            |
| `questions/NN-*.md`     | One quiz question each             | Multiple-choice question        |

## Numbering System

- Files prefixed with `NN-` where NN = 01, 02, 03, etc.
- Numbers determine display order
- Gaps allowed (01, 02, 05, 10...) for future insertions
- To reorder: rename files with new numbers

## Key Principles

✅ **One file = one thing** (one concept, one question)  
✅ **Metadata separate from content** (lecture.md, quiz.md)  
✅ **Numbers determine order** (not file creation time)  
✅ **All files registered** (in content-list.json)

## Quick Actions

### Add new lecture item

1. Create `lecture-items/NN-name.md`
2. Add path to `content-list.json`
3. Validate with `validate-content.html`

### Add new quiz question

1. Create `questions/NN-topic.md`
2. Add path to `content-list.json`
3. Validate with `validate-content.html`

### Reorder content

1. Rename files with new numbers
2. Update paths in `content-list.json`

## More Information

- **For content creators:** [docs/CONTENT_DEVELOPMENT.md](docs/CONTENT_DEVELOPMENT.md)
- **For AI agents:** [GEMINI.md](GEMINI.md)
- **Templates:** [docs/CONTENT_TEMPLATES.md](docs/CONTENT_TEMPLATES.md)
