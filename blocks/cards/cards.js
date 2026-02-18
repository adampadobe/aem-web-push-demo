/**
 * Cards Block - Displays cards in a responsive grid
 */
export default function decorate(block) {
  const cards = [...block.children];
  block.innerHTML = '';
  
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-container';
  
  cards.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    
    const [imageCell, contentCell] = card.children;
    
    // Card image
    if (imageCell) {
      const img = imageCell.querySelector('img');
      if (img) {
        const cardImage = document.createElement('div');
        cardImage.className = 'card-image';
        cardImage.appendChild(img);
        cardEl.appendChild(cardImage);
      }
    }
    
    // Card content
    if (contentCell) {
      const cardContent = document.createElement('div');
      cardContent.className = 'card-content';
      
      // Title
      const title = contentCell.querySelector('strong, b, h1, h2, h3, h4');
      if (title) {
        const cardTitle = document.createElement('h3');
        cardTitle.className = 'card-title';
        cardTitle.textContent = title.textContent;
        cardContent.appendChild(cardTitle);
      }
      
      // Description
      const paragraphs = contentCell.querySelectorAll('p');
      paragraphs.forEach(p => {
        if (!p.querySelector('strong, b')) {
          const cardText = document.createElement('p');
          cardText.className = 'card-text';
          cardText.textContent = p.textContent;
          cardContent.appendChild(cardText);
        }
      });
      
      // Link
      const link = contentCell.querySelector('a');
      if (link) {
        link.className = 'card-link';
        cardContent.appendChild(link);
      }
      
      cardEl.appendChild(cardContent);
    }
    
    cardsContainer.appendChild(cardEl);
  });
  
  block.appendChild(cardsContainer);
}
