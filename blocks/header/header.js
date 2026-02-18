/**
 * Header block for AEM EDS
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Add header content here
  block.innerHTML = `
    <div class="header-wrapper">
      <div class="header-brand">
        <a href="/">AEM Web Push Demo</a>
      </div>
      <nav class="header-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/push-demo">Push Demo</a></li>
        </ul>
      </nav>
    </div>
  `;
}
