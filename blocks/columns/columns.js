/**
 * Columns Block - Two-column layout (reference / boilerplate style)
 * Splits content into left and right column (first half / second half of rows).
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'columns-container';

  const mid = Math.ceil(rows.length / 2);
  const leftRows = rows.slice(0, mid);
  const rightRows = rows.slice(mid);

  const col1 = document.createElement('div');
  col1.className = 'columns-col';
  leftRows.forEach((row) => col1.appendChild(row.cloneNode(true)));
  container.appendChild(col1);

  const col2 = document.createElement('div');
  col2.className = 'columns-col';
  rightRows.forEach((row) => col2.appendChild(row.cloneNode(true)));
  container.appendChild(col2);

  block.appendChild(container);
}
