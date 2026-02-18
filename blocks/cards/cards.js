/**
 * Cards Block - Displays cards in a responsive grid.
 * Supports both table format (2 cells per row: image, content) and paragraph format (4 rows per card: image URL, title, description, link).
 */
export default function decorate(block) {
  let cards = [...block.children];
  const first = cards[0];
  const isParagraphFormat = first && first.children.length <= 1 && cards.length > 4;
  if (isParagraphFormat) {
    const grouped = [];
    for (let i = 0; i < cards.length; i += 4) {
      const row = document.createElement('div');
      if (cards[i]) row.appendChild(cards[i].cloneNode(true));
      const content = document.createElement('div');
      for (let j = 1; j <= 3 && cards[i + j]; j += 1) content.appendChild(cards[i + j].cloneNode(true));
      row.appendChild(content);
      grouped.push(row);
    }
    cards = grouped;
  }
  block.innerHTML = '';

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-container';

  cards.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    const imageCell = card.children[0];
    const contentCell = card.children[1] || card.children[0];

    if (imageCell && imageCell !== contentCell) {
      const img = imageCell.querySelector('img');
      const url = (imageCell.textContent || '').trim();
      if (img) {
        const cardImage = document.createElement('div');
        cardImage.className = 'card-image';
        cardImage.appendChild(img);
        cardEl.appendChild(cardImage);
      } else if (url && (url.startsWith('http') || url.startsWith('//'))) {
        const cardImage = document.createElement('div');
        cardImage.className = 'card-image';
        const im = document.createElement('img');
        im.src = url;
        im.alt = '';
        cardImage.appendChild(im);
        cardEl.appendChild(cardImage);
      }
    }

    if (contentCell) {
      const cardContent = document.createElement('div');
      cardContent.className = 'card-content';
      const title = contentCell.querySelector('strong, b, h1, h2, h3, h4');
      if (title) {
        const cardTitle = document.createElement('h3');
        cardTitle.className = 'card-title';
        cardTitle.textContent = title.textContent;
        cardContent.appendChild(cardTitle);
      }
      contentCell.querySelectorAll('p').forEach((p) => {
        if (!p.querySelector('strong, b')) {
          const cardText = document.createElement('p');
          cardText.className = 'card-text';
          cardText.textContent = p.textContent;
          cardContent.appendChild(cardText);
        }
      });
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
