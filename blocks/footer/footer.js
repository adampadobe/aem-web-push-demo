/**
 * Footer block for AEM EDS
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Add footer content here
  block.innerHTML = `
    <div class="footer-wrapper">
      <p>Copyright © 2023 Adobe. All rights reserved.</p>
      <p class="footer-links">
        <a href="#">Privacy</a> / <a href="#">Terms of Use</a> / <a href="#">Cookie preferences</a> / <a href="#">Do not sell my personal information</a> / <a href="#">AdChoices</a>
      </p>
    </div>
  `;
}
