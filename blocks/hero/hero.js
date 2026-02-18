/**
 * Hero Block - Full-width hero section with image and text
 */
export default function decorate(block) {
  const [imageRow, titleRow, descriptionRow, ctaRow] = block.children;

  // Create hero structure
  block.innerHTML = '';
  
  const heroContainer = document.createElement('div');
  heroContainer.className = 'hero-container';
  
  // Background image
  if (imageRow) {
    const img = imageRow.querySelector('img');
    if (img) {
      heroContainer.style.backgroundImage = `url(${img.src})`;
    }
  }
  
  // Content overlay
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';
  
  // Title
  if (titleRow) {
    const title = document.createElement('h1');
    title.className = 'hero-title';
    title.textContent = titleRow.textContent;
    heroContent.appendChild(title);
  }
  
  // Description
  if (descriptionRow) {
    const description = document.createElement('p');
    description.className = 'hero-description';
    description.textContent = descriptionRow.textContent;
    heroContent.appendChild(description);
  }
  
  // CTA Button
  if (ctaRow) {
    const ctaLink = ctaRow.querySelector('a');
    if (ctaLink) {
      ctaLink.className = 'hero-cta button primary';
      heroContent.appendChild(ctaLink);
    }
  }
  
  heroContainer.appendChild(heroContent);
  block.appendChild(heroContainer);
}
