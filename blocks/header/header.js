/**
 * Header block for AEM EDS
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Add header content here
  block.innerHTML = `
    <div class="header-wrapper">
      <div class="header-brand">
        <a href="/">Boilerplate</a>
      </div>
      <nav class="header-nav">
        <ul>
          <li><a href="/">Example Content</a></li>
          <li><a href="/#getting-started">Getting Started</a></li>
          <li><a href="https://www.aem.live/developer/tutorial">Documentation</a></li>
        </ul>
      </nav>
      <div class="header-search" aria-label="Search">
        <span class="header-search-icon">⌕</span>
      </div>
    </div>
  `;
}
