(() => {
  const grid = document.getElementById('grid');
  const tooltip = document.getElementById('tooltip');
  const overlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const litCount = document.getElementById('lit-count');
  const statsBarFill = document.getElementById('stats-bar-fill');

  const TOTAL = 100;
  let cellDataMap = {}; // position -> cell data

  // Fetch data and render
  fetch('data.json')
    .then(r => r.json())
    .then(data => {
      // Build lookup map
      data.cells.forEach(cell => {
        cellDataMap[cell.position] = cell;
      });

      // Update header if provided
      if (data.title) document.querySelector('.title').textContent = data.title;
      if (data.subtitle) document.querySelector('.subtitle').textContent = data.subtitle;

      renderGrid();
      updateStats();
    })
    .catch(() => {
      // If data.json fails, render empty grid
      renderGrid();
    });

  function renderGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;

      const data = cellDataMap[i];
      if (data) {
        cell.classList.add('lit');
        cell.style.background = data.color;
        cell.style.boxShadow = `0 0 12px ${data.color}66, 0 0 4px ${data.color}33`;
        cell.style.setProperty('--delay', `${(i * 0.15) % 4}s`);
        cell.style.border = 'none';

        // Hover tooltip
        cell.addEventListener('mouseenter', e => showTooltip(e, data.name));
        cell.addEventListener('mousemove', e => moveTooltip(e));
        cell.addEventListener('mouseleave', hideTooltip);

        // Click modal
        cell.addEventListener('click', () => openModal(data));
      }

      grid.appendChild(cell);
    }
  }

  function updateStats() {
    const count = Object.keys(cellDataMap).length;
    litCount.textContent = count;
    statsBarFill.style.width = `${(count / TOTAL) * 100}%`;
  }

  // --- Tooltip ---
  function showTooltip(e, text) {
    tooltip.textContent = text;
    tooltip.classList.add('visible');
    moveTooltip(e);
  }

  function moveTooltip(e) {
    tooltip.style.left = `${e.clientX + 12}px`;
    tooltip.style.top = `${e.clientY - 32}px`;
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  // --- Modal ---
  function openModal(data) {
    document.getElementById('modal-title').textContent = data.name;
    document.getElementById('modal-description').textContent = data.description || '';

    // Badge
    const badge = document.getElementById('modal-badge');
    const isWebsite = data.category === 'website';
    badge.textContent = isWebsite ? 'Website' : 'Project';
    badge.style.background = isWebsite ? '#1a3a2a' : '#1a2a3a';
    badge.style.color = isWebsite ? '#4ade80' : '#58a6ff';

    // Tech tags
    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = '';
    if (data.tech && data.tech.length) {
      data.tech.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = t;
        techContainer.appendChild(tag);
      });
    }

    // Date
    document.getElementById('modal-date').textContent = data.completed || '';

    // Link
    const link = document.getElementById('modal-link');
    if (data.url && !data.linkDisabled) {
      link.href = data.url;
      link.classList.remove('hidden', 'disabled');
      link.style.pointerEvents = '';
      link.style.opacity = '';
      link.style.color = '';
    } else if (data.url && data.linkDisabled) {
      link.href = '#';
      link.classList.remove('hidden');
      link.classList.add('disabled');
      link.style.pointerEvents = 'none';
      link.style.opacity = '0.4';
      link.style.color = '#666';
    } else {
      link.classList.add('hidden');
    }

    // Color accent on title
    document.getElementById('modal-title').style.color = data.color;

    // Show
    overlay.classList.add('active');
  }

  function closeModal() {
    overlay.classList.remove('active');
  }

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();
