/**
 * ARIA tab widget for the broken/fixed demo toggle.
 * Implements the APG Tabs Pattern with arrow key navigation.
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * On desktop (≥ 56em), CSS hides the tablist and shows both panels
 * simultaneously — this module only manages the mobile tab interaction.
 */

/**
 * Initializes the broken/fixed tab toggle for a single demo section.
 * @param {HTMLElement} sectionEl - The .demo-section element
 */
export function initDemoToggle(sectionEl) {
  const tablist = sectionEl.querySelector('[role="tablist"]');
  if (!tablist) return;

  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  if (tabs.length === 0) return;

  // Click: activate the clicked tab
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab, sectionEl));
  });

  // Keyboard: arrow keys, Home, End within the tablist
  tablist.addEventListener('keydown', (e) => {
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    activateTab(tabs[nextIndex], sectionEl);
  });
}

/**
 * Activates a tab and shows its associated panel.
 * @param {HTMLElement} selectedTab
 * @param {HTMLElement} sectionEl
 */
function activateTab(selectedTab, sectionEl) {
  const tabs = [...sectionEl.querySelectorAll('[role="tab"]')];
  const panels = [...sectionEl.querySelectorAll('[role="tabpanel"]')];

  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    tab.tabIndex = isSelected ? 0 : -1;
  });

  panels.forEach((panel) => {
    panel.hidden = panel.id !== selectedTab.getAttribute('aria-controls');
  });

  selectedTab.focus();
}
