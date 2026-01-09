// Theme management

function initializeTheme() {
  // Check for saved theme preference or default to 'light' mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  updateThemeIcons();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');

  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }

  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  const lightIcons = document.querySelectorAll('.theme-toggle-light-icon');
  const darkIcons = document.querySelectorAll('.theme-toggle-dark-icon');

  lightIcons.forEach((icon) => {
    icon.classList.toggle('hidden', !isDark);
  });

  darkIcons.forEach((icon) => {
    icon.classList.toggle('hidden', isDark);
  });
}

// Expose to global scope
window.initializeTheme = initializeTheme;
window.toggleTheme = toggleTheme;
window.updateThemeIcons = updateThemeIcons;
