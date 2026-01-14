#!/usr/bin/env python3
"""
Clean up cheat-sheet content in achievements.json files.
Removes unnecessary text like congratulations, tips, and validity info.
"""

import json
import re
import sys
from pathlib import Path


def clean_cheatsheet_content(content):
    """Remove unnecessary text from cheat-sheet markdown content."""
    
    # Remove congratulation text after title
    # Pattern: # Title\n\nHerzlichen Glückwunsch! ... \n\n***
    content = re.sub(
        r'(^# [^\n]+\n)\n*Herzlichen Glückwunsch![^\n]*\n[^\n]*\n*(\*{3}\n)?',
        r'\1\n',
        content,
        flags=re.MULTILINE
    )
    
    # Remove tip section at the end
    content = re.sub(r'\n+\*\*💡 Tipp\*\*:[^\n]*', '', content)
    
    # Remove validity info
    content = re.sub(r'\n+\*\*🔄 Gültig für\*\*:[^\n]*', '', content)
    
    # Remove next steps section
    content = re.sub(
        r'\n+\*\*📌 Nächste Schritte\*\*:\n+(?:- [^\n]*\n*)*',
        '',
        content
    )
    
    # Clean up trailing whitespace/newlines
    content = content.rstrip()
    
    return content


def process_achievements_file(file_path):
    """Process a single achievements.json file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes = 0
    for key, achievement in data.items():
        if 'contentMarkdown' in achievement:
            original = achievement['contentMarkdown']
            cleaned = clean_cheatsheet_content(original)
            if original != cleaned:
                print(f"  Cleaned: {key}")
                achievement['contentMarkdown'] = cleaned
                changes += 1
    
    if changes > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  -> {changes} cheat-sheets cleaned")
    else:
        print("  -> No changes needed")
    
    return changes


def main():
    """Find and clean all achievements.json files."""
    content_dir = Path(__file__).parent.parent / 'content'
    
    total_changes = 0
    for study_dir in content_dir.iterdir():
        if study_dir.is_dir():
            achievements_file = study_dir / 'achievements.json'
            if achievements_file.exists():
                print(f"\nProcessing {achievements_file.relative_to(content_dir.parent)}...")
                total_changes += process_achievements_file(achievements_file)
    
    print(f"\nTotal: {total_changes} cheat-sheets cleaned")
    return 0 if total_changes >= 0 else 1


if __name__ == '__main__':
    sys.exit(main())
