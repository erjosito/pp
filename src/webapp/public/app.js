/* =========================================================
   P&P Lernhelfer – App Logic
   Vanilla JavaScript, no build step
   ========================================================= */

(() => {
  'use strict';

  // ===== State =====
  const state = {
    cards: [],
    topics: [],
    activeTopics: new Set(),
    deck: [],
    deckIndex: 0,
    currentView: 'cards',
  };

  // ===== Summaries config =====
  const SUMMARIES = [
    { file: '00-README.md',                          title: '🏠 Übersicht & Lernanleitung' },
    { file: '01-Stroemungen-und-Zeitstrahl.md',      title: '01 · Strömungen & Zeitstrahl' },
    { file: '02-Lerntheorien.md',                    title: '02 · Lerntheorien' },
    { file: '03-Persoenlichkeit.md',                 title: '03 · Persönlichkeit' },
    { file: '04-Motivation.md',                      title: '04 · Motivation' },
    { file: '05-Kommunikation.md',                   title: '05 · Kommunikation' },
    { file: '06-Erziehung.md',                       title: '06 · Erziehung' },
    { file: '07-Entwicklung.md',                     title: '07 · Entwicklung' },
    { file: '08-Verbindungen-und-Anwendung.md',      title: '08 · Verbindungen & Anwendung' },
  ];

  // ===== DOM helpers =====
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ===== Init =====
  async function init() {
    setupTabs();
    setupSummaryList();
    await loadFlashcards();
    setupCardControls();
    renderTopicChips();
    rebuildDeck();
    renderCard();
  }

  // ===== Tab navigation =====
  function setupTabs() {
    $$('.tab').forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
  }

  function switchView(view) {
    state.currentView = view;
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  }

  // ===== Flashcards =====
  async function loadFlashcards() {
    try {
      const res = await fetch('data/flashcards.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.cards = data.cards || [];
      state.topics = data.topics || [];
      state.activeTopics = new Set(state.topics.map(t => t.id));
    } catch (err) {
      console.error('Failed to load flashcards:', err);
      $('card-question').textContent = 'Fehler beim Laden der Karten.';
    }
  }

  function renderTopicChips() {
    const container = $('topic-filter');
    container.innerHTML = '';

    // "Alle" toggle
    const allChip = document.createElement('span');
    allChip.className = 'topic-chip active';
    allChip.textContent = '✨ Alle';
    allChip.style.background = '#475569';
    allChip.addEventListener('click', () => {
      const allActive = state.activeTopics.size === state.topics.length;
      if (allActive) {
        state.activeTopics.clear();
      } else {
        state.activeTopics = new Set(state.topics.map(t => t.id));
      }
      renderTopicChips();
      rebuildDeck();
      renderCard();
    });
    container.appendChild(allChip);

    state.topics.forEach(topic => {
      const chip = document.createElement('span');
      chip.className = 'topic-chip' + (state.activeTopics.has(topic.id) ? ' active' : '');
      chip.textContent = topic.name;
      if (state.activeTopics.has(topic.id)) {
        chip.style.background = topic.color;
      } else {
        chip.style.background = '';
      }
      chip.addEventListener('click', () => {
        if (state.activeTopics.has(topic.id)) {
          state.activeTopics.delete(topic.id);
        } else {
          state.activeTopics.add(topic.id);
        }
        renderTopicChips();
        rebuildDeck();
        renderCard();
      });
      container.appendChild(chip);
    });

    // Update "Alle" appearance based on state
    if (state.activeTopics.size === state.topics.length) {
      allChip.classList.add('active');
    } else {
      allChip.classList.remove('active');
    }
  }

  function rebuildDeck() {
    const filtered = state.cards.filter(c => state.activeTopics.has(c.topic));
    state.deck = shuffle([...filtered]);
    state.deckIndex = 0;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderCard() {
    const flashcard = $('flashcard');
    flashcard.classList.remove('flipped');

    if (state.deck.length === 0) {
      $('card-topic-front').textContent = '';
      $('card-subtopic-front').textContent = '';
      $('card-question').textContent = 'Wähle mindestens ein Thema, um Karten zu sehen.';
      $('card-topic-back').textContent = '';
      $('card-subtopic-back').textContent = '';
      $('card-answer').textContent = '';
      $('progress-text').textContent = 'Karte 0 / 0';
      $('progress-fill').style.width = '0%';
      return;
    }

    const card = state.deck[state.deckIndex];
    const topic = state.topics.find(t => t.id === card.topic);
    const topicName = topic ? topic.name : card.topic;
    const topicColor = topic ? topic.color : '#475569';

    // Front
    $('card-topic-front').textContent = topicName;
    $('card-topic-front').style.background = topicColor;
    $('card-topic-front').style.color = 'white';
    $('card-subtopic-front').textContent = card.subtopic || '';
    $('card-question').textContent = card.question;

    // Back
    $('card-topic-back').textContent = topicName;
    $('card-topic-back').style.background = topicColor;
    $('card-topic-back').style.color = 'white';
    $('card-subtopic-back').textContent = card.subtopic || '';
    $('card-answer').textContent = card.answer;

    // Progress
    const total = state.deck.length;
    const current = state.deckIndex + 1;
    $('progress-text').textContent = `Karte ${current} / ${total}`;
    $('progress-fill').style.width = `${(current / total) * 100}%`;
  }

  function setupCardControls() {
    const flashcard = $('flashcard');

    flashcard.addEventListener('click', () => {
      flashcard.classList.toggle('flipped');
    });

    flashcard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flashcard.classList.toggle('flipped');
      }
    });

    $('btn-next').addEventListener('click', nextCard);
    $('btn-prev').addEventListener('click', prevCard);
    $('btn-shuffle').addEventListener('click', () => {
      rebuildDeck();
      renderCard();
    });

    // Keyboard shortcuts (only when on cards view)
    document.addEventListener('keydown', (e) => {
      if (state.currentView !== 'cards') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') nextCard();
      else if (e.key === 'ArrowLeft') prevCard();
      else if (e.key === 's' || e.key === 'S') {
        rebuildDeck();
        renderCard();
      }
    });
  }

  function nextCard() {
    if (state.deck.length === 0) return;
    state.deckIndex = (state.deckIndex + 1) % state.deck.length;
    renderCard();
  }

  function prevCard() {
    if (state.deck.length === 0) return;
    state.deckIndex = (state.deckIndex - 1 + state.deck.length) % state.deck.length;
    renderCard();
  }

  // ===== Summaries =====
  function setupSummaryList() {
    const list = $('summary-list');
    list.innerHTML = '';
    SUMMARIES.forEach((entry, idx) => {
      const li = document.createElement('li');
      li.textContent = entry.title;
      li.addEventListener('click', () => loadSummary(idx));
      list.appendChild(li);
    });
  }

  async function loadSummary(idx) {
    const entry = SUMMARIES[idx];
    if (!entry) return;
    const items = $$('#summary-list li');
    items.forEach((li, i) => li.classList.toggle('active', i === idx));

    const content = $('summary-content');
    content.innerHTML = '<div class="placeholder"><h2>⏳ Lade...</h2></div>';

    try {
      const res = await fetch(`summaries/${entry.file}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const md = await res.text();
      content.innerHTML = marked.parse(md);
      rewriteSummaryLinks(content);
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error('Failed to load summary:', err);
      content.innerHTML = `<div class="placeholder"><h2>❌ Fehler</h2><p>Datei konnte nicht geladen werden: ${entry.file}</p></div>`;
    }
  }

  // Convert <a href="./xx.md"> links rendered from markdown into in-app
  // navigation that calls loadSummary() instead of letting the browser
  // navigate to the raw .md file.
  function rewriteSummaryLinks(container) {
    const anchors = container.querySelectorAll('a[href]');
    anchors.forEach(a => {
      const raw = a.getAttribute('href') || '';
      // Strip leading ./ and any query/fragment, then match against SUMMARIES
      const cleaned = raw.replace(/^\.\//, '').split(/[?#]/)[0];
      const idx = SUMMARIES.findIndex(s => s.file === cleaned);
      if (idx >= 0) {
        a.classList.add('summary-link');
        a.addEventListener('click', (e) => {
          e.preventDefault();
          loadSummary(idx);
        });
      } else if (/^https?:\/\//i.test(raw)) {
        // External link: open in a new tab for safety
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // ===== Start =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
