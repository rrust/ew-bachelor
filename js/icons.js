/**
 * Central SVG Icon Module
 * All UI icons are defined here to avoid duplication and ensure consistency.
 *
 * Usage:
 *   Icons.get('search')                    // Returns SVG string with default classes
 *   Icons.get('search', 'w-6 h-6')         // Returns SVG string with custom classes
 *   Icons.get('search', 'w-6 h-6', 'text-red-500')  // With custom color class
 */

const Icons = (function () {
  // SVG path definitions (just the path data, no wrapper)
  const paths = {
    // Navigation icons
    search:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>',

    menuDots:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>',

    sun: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>',

    moon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>',

    close:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>',

    modules:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>',

    chart:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>',

    cog: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>',

    map: `<rect x="2" y="2" width="6" height="4" rx="1" stroke-width="1.5"/>
          <rect x="14" y="7" width="6" height="4" rx="1" stroke-width="1.5"/>
          <rect x="14" y="15" width="6" height="4" rx="1" stroke-width="1.5"/>
          <path stroke-width="1.5" d="M5 6v13M5 9h9M5 17h9"/>`,

    trophy: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3h14v4a7 7 0 01-14 0V3z"/>
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5H3a2 2 0 000 4h2M19 5h2a2 2 0 010 4h-2"/>
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14v3M8 21h8M10 17h4"/>`,

    // Tools icons
    phone:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>',

    phoneDownload: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11V7m0 4l-2-2m2 2l2-2"></path>`,

    checkCircle:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',

    book: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>',

    // Map zoom controls
    zoomIn:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>',

    zoomOut:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>',

    reset:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>',

    // External link
    externalLink:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>',

    // Achievement status icons
    lock: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>',

    unlock:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>',

    clock:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>',

    hourglass:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v4m-4-8l4-4 4 4m-8 4l4 4 4-4M6 4h12v2a6 6 0 01-6 6 6 6 0 01-6-6V4zm0 16h12v-2a6 6 0 00-6-6 6 6 0 00-6 6v2z"></path>',

    // Achievement card icons (cheat sheets, summaries)
    document:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',

    clipboard:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>',

    // Study program icons (apple is in customViewBoxIcons)
    beaker: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3h6v5l4 10a1 1 0 01-1 1H6a1 1 0 01-1-1l4-10V3z"/>
             <path stroke-linecap="round" stroke-width="1.5" d="M7 14h10"/>
             <path stroke-linecap="round" stroke-width="1.5" d="M9 3h6"/>`,

    graduationCap:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7"></path>',

    // Progress page icons
    download:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>',

    upload:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>',

    hourglassEmpty:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h12M6 20h12M8 4v4a4 4 0 004 4 4 4 0 004-4V4M8 20v-4a4 4 0 014-4 4 4 0 014 4v4"></path>',

    check:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',

    // Milestone icons
    rocket:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>',

    fire: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>',

    muscle:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>',

    star: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>',

    wave: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>',

    // Snapshot icons
    save: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>',

    pin: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>',

    pinOutline:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>',

    pinFilled:
      '<path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>',

    trash:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>',

    plus: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>',

    lightbulb:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>',

    inbox:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>',

    medal:
      '<circle cx="12" cy="8" r="6" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',

    // Alert icons
    bell: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>',

    refresh:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>',

    exclamation:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>',

    questionCircle:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',

    close:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>',

    // Edit/Write icons
    pencil:
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>'
  };

  // Icons with custom viewBox (different from default 24x24)
  const customViewBoxIcons = {
    apple: {
      viewBox: '0 0 490 490',
      path: '<path fill="currentColor" d="M348.399,104.848c-1.257,0-2.489,0.022-3.707,0.066c-45.669,1.659-74.383,25.793-91.667,32.88c-4.223-22.172-5.759-69.433,40.609-116.225L271.891,0.006c-25.597,25.826-39.003,51.986-45.658,75.607C173.742,6.109,104.742,15.819,104.742,15.819c48.35,91.049,106.284,70.783,120.351,64.088c-4.731,18.899-5.271,36.013-4.053,49.641c-17.489-9.865-41.998-23.41-75.732-24.635c-1.215-0.044-2.454-0.066-3.708-0.066C87.663,104.846,0,146.111,0,267.252c0,123.954,99.709,222.741,150.78,222.741c51.07,0,68.821-14.472,94.22-14.472c25.399,0,43.149,14.472,94.22,14.472c51.07,0,150.78-98.787,150.78-222.741C490,146.119,402.337,104.848,348.399,104.848z M339.22,459.369c-25.901,0-41.088-4.088-55.775-8.041c-11.746-3.162-23.891-6.431-38.445-6.431c-14.554,0-26.7,3.269-38.446,6.431c-14.687,3.953-29.875,8.041-55.774,8.041c-29.042,0-120.155-79.717-120.155-192.116c0-45.085,13.554-79.987,40.288-103.736c23.276-20.677,51.776-28.045,70.688-28.044c0.878,0,1.746,0.016,2.595,0.047c26.826,0.974,46.696,12.186,62.66,21.195c13.104,7.395,24.421,13.781,38.144,13.781c13.723,0,25.04-6.386,38.143-13.781c15.965-9.009,35.834-20.221,62.659-21.195c0.853-0.031,1.716-0.047,2.596-0.047c18.911,0,47.41,7.368,70.688,28.047c26.733,23.75,40.289,58.65,40.289,103.732C459.375,379.652,368.262,459.369,339.22,459.369z"/>'
    }
  };

  /**
   * Get an SVG icon
   * @param {string} name - Icon name from the paths object
   * @param {string} sizeClass - Tailwind size classes (default: 'w-5 h-5')
   * @param {string} colorClass - Tailwind color classes (default: '')
   * @returns {string} Complete SVG element as string
   */
  function get(name, sizeClass = 'w-5 h-5', colorClass = '') {
    // Check for custom viewBox icons first
    if (customViewBoxIcons[name]) {
      const icon = customViewBoxIcons[name];
      const classes = [sizeClass, colorClass].filter(Boolean).join(' ');
      return `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="${icon.viewBox}">${icon.path}</svg>`;
    }

    const path = paths[name];
    if (!path) {
      console.warn(`Icon "${name}" not found`);
      return '';
    }

    const classes = [sizeClass, colorClass].filter(Boolean).join(' ');
    return `<svg class="${classes}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${path}</svg>`;
  }

  /**
   * Get list of available icon names
   * @returns {string[]} Array of icon names
   */
  function list() {
    return Object.keys(paths);
  }

  /**
   * Inject icons into all elements with data-icon attribute
   * Usage in HTML: <span data-icon="search" data-icon-class="w-6 h-6 text-gray-400"></span>
   */
  function injectAll() {
    document.querySelectorAll('[data-icon]').forEach((el) => {
      const iconName = el.dataset.icon;
      const iconClass = el.dataset.iconClass || 'w-5 h-5';
      const svg = get(iconName, iconClass);
      if (svg) {
        el.innerHTML = svg;
      }
    });
  }

  // Public API
  return {
    get,
    list,
    injectAll
  };
})();

// Export for use in other modules
window.Icons = Icons;

// Auto-inject icons when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Icons.injectAll());
} else {
  Icons.injectAll();
}
