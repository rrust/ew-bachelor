#!/usr/bin/env node
/**
 * View Registration Validator
 *
 * Checks that all views defined in index.html are properly registered in app.js
 * Run with: node validate-views.js
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const appPath = path.join(__dirname, 'app.js');

const indexContent = fs.readFileSync(indexPath, 'utf-8');
const appContent = fs.readFileSync(appPath, 'utf-8');

// Find all view IDs in index.html (pattern: id="xxx-view")
const viewIdRegex = /id="([a-z-]+)-view"/g;
const htmlViews = [];
let match;
while ((match = viewIdRegex.exec(indexContent)) !== null) {
  htmlViews.push(match[1]);
}

// Exclude special views that don't need routing
const excludedViews = ['welcome', 'study-selection', 'quiz-results'];

// Internal views that are accessed via parent routes (e.g., /module/X/lecture/Y)
const internalViews = ['lecture', 'quiz'];

// Find views object in app.js
const viewsObjectMatch = appContent.match(/const views = \{[\s\S]*?\};/);

let errors = [];

console.log('🔍 View Registration Validator\n');
console.log(`Found ${htmlViews.length} views in index.html:\n`);

htmlViews.forEach((viewId) => {
  // Convert kebab-case to camelCase for app.js
  const camelCase = viewId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const isExcluded = excludedViews.includes(viewId);
  const isInternal = internalViews.includes(viewId);

  // The route name is the camelCase version
  const routeName = camelCase;

  // Check 1: Is it in the views object?
  const inViewsObject =
    viewsObjectMatch && viewsObjectMatch[0].includes(`${camelCase}:`);

  // Check 2: Is it in route parsing? Check for patterns like:
  // route.view === 'progress' or parts[offset] === 'progress'
  const hasRoute =
    appContent.includes(`route.view === '${routeName}'`) ||
    appContent.includes(`parts[offset] === '${routeName}'`) ||
    appContent.includes(`parts[offset] === '${viewId.split('-')[0]}'`);

  // Determine status
  let status;
  if (isExcluded) {
    status = '⏭️  SKIP';
  } else if (isInternal && inViewsObject) {
    status = '✅ INTERN';
  } else if (inViewsObject && hasRoute) {
    status = '✅ OK';
  } else if (!inViewsObject && !hasRoute) {
    status = '❌ MISSING';
    errors.push(`${viewId}-view: Not in views object AND no route`);
  } else if (!inViewsObject) {
    status = '❌ NO VIEWS';
    errors.push(
      `${viewId}-view: Has route but MISSING from views object in app.js`
    );
  } else {
    status = '❌ NO ROUTE';
    errors.push(`${viewId}-view: In views object but no route parsing`);
  }

  console.log(`  ${status}  ${viewId}-view`);
  if (isInternal) {
    console.log(
      `         └─ views object: ${
        inViewsObject ? '✓' : '✗'
      }  (accessed via parent route)`
    );
  } else if (!isExcluded) {
    console.log(
      `         └─ views object: ${inViewsObject ? '✓' : '✗'}  route: ${
        hasRoute ? '✓' : '✗'
      }`
    );
  }
});

console.log('\n' + '─'.repeat(50));

if (errors.length > 0) {
  console.log('\n❌ ERRORS:');
  errors.forEach((e) => console.log(`   • ${e}`));
}

if (errors.length === 0) {
  console.log('\n✅ All views are properly registered!\n');
  process.exit(0);
} else {
  console.log(
    '\n💡 See GEMINI.md "Adding New Views" section for required steps.\n'
  );
  process.exit(1);
}
