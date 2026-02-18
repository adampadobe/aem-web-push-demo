/**
 * Footer block for AEM EDS
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Add footer content here
  block.innerHTML = `
    <div class="footer-wrapper">
      <p>&copy; 2026 Adobe Experience Manager - Web Push Demo</p>
    </div>
  `;
}
