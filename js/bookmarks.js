// =================================
// BOOKMARKS - Sistema de notas y marcadores
// =================================

const Bookmarks = (function() {
  'use strict';

  let bookmarks = [];
  let panel = null;

  /**
   * Cargar marcadores desde localStorage
   */
  function loadBookmarks() {
    try {
      const saved = localStorage.getItem('actas_bookmarks');
      bookmarks = saved ? JSON.parse(saved) : [];
      return bookmarks;
    } catch (error) {
      console.error('Error cargando marcadores:', error);
      return [];
    }
  }

  /**
   * Guardar marcadores en localStorage
   */
  function saveBookmarks() {
    try {
      localStorage.setItem('actas_bookmarks', JSON.stringify(bookmarks));
      return true;
    } catch (error) {
      console.error('Error guardando marcadores:', error);
      return false;
    }
  }

  /**
   * Agregar marcador
   */
  function add(actaId, note = '') {
    const existing = bookmarks.find(b => b.actaId === actaId);
    
    if (existing) {
      existing.note = note;
      existing.updatedAt = new Date().toISOString();
    } else {
      bookmarks.push({
        actaId,
        note,
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    saveBookmarks();
    updateUI();
    return true;
  }

  /**
   * Eliminar marcador
   */
  function remove(actaId) {
    bookmarks = bookmarks.filter(b => b.actaId !== actaId);
    saveBookmarks();
    updateUI();
    return true;
  }

  /**
   * Toggle estrella
   */
  function toggleStar(actaId) {
    const bookmark = bookmarks.find(b => b.actaId === actaId);
    if (bookmark) {
      bookmark.starred = !bookmark.starred;
      saveBookmarks();
      updateUI();
      return bookmark.starred;
    }
    return false;
  }

  /**
   * Obtener marcador
   */
  function get(actaId) {
    return bookmarks.find(b => b.actaId === actaId);
  }

  /**
   * Obtener todos los marcadores
   */
  function getAll() {
    return bookmarks;
  }

  /**
   * Agregar botones a las actas - DESHABILITADO
   */
  function addBookmarkButtons() {
    // Botones en actas deshabilitados - funcionalidad solo por código
    return;
  }

  /**
   * Mostrar modal de nota
   */
  function showNoteModal(actaId) {
    const bookmark = get(actaId);
    const currentNote = bookmark?.note || '';

    const modal = document.createElement('div');
    modal.className = 'note-modal';
    modal.innerHTML = `
      <style>
        .note-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        .note-modal-content {
          background: rgba(15, 32, 39, 0.98);
          backdrop-filter: blur(20px);
          border: 2px solid #34d399;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
        }
        .note-modal h3 {
          color: #34d399;
          margin: 0 0 16px 0;
          font-size: 20px;
        }
        .note-modal textarea {
          width: 100%;
          min-height: 150px;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(52, 211, 153, 0.3);
          border-radius: 8px;
          color: #e5e7eb;
          padding: 12px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          margin-bottom: 16px;
        }
        .note-modal textarea:focus {
          outline: none;
          border-color: #34d399;
        }
        .note-modal-buttons {
          display: flex;
          gap: 12px;
        }
        .note-modal button {
          flex: 1;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .note-modal .save-btn {
          background: linear-gradient(135deg, #34d399, #10b981);
          border: 2px solid #34d399;
          color: white;
        }
        .note-modal .save-btn:hover {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        .note-modal .cancel-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid #ef4444;
          color: #ef4444;
        }
        .note-modal .cancel-btn:hover {
          background: rgba(239, 68, 68, 0.4);
        }
      </style>
      <div class="note-modal-content">
        <h3>📝 Nota para Acta</h3>
        <textarea id="note-textarea" placeholder="Escribe tu nota aquí...">${currentNote}</textarea>
        <div class="note-modal-buttons">
          <button class="cancel-btn">Cancelar</button>
          <button class="save-btn">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const textarea = modal.querySelector('#note-textarea');
    const saveBtn = modal.querySelector('.save-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    textarea.focus();

    saveBtn.onclick = () => {
      const note = textarea.value.trim();
      add(actaId, note);
      modal.remove();
    };

    cancelBtn.onclick = () => {
      modal.remove();
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    };

    // Cerrar con Esc
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  /**
   * Mostrar panel de marcadores
   */
  function showPanel() {
    if (panel) {
      panel.remove();
      panel = null;
      return;
    }

    panel = document.createElement('div');
    panel.id = 'bookmarks-panel';
    panel.innerHTML = `
      <style>
        #bookmarks-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 350px;
          max-width: 90vw;
          height: 100%;
          background: rgba(15, 32, 39, 0.98);
          backdrop-filter: blur(20px);
          border-left: 2px solid #34d399;
          z-index: 99999;
          overflow-y: auto;
          animation: slideInRight 0.3s ease;
          padding: 24px;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        #bookmarks-panel h2 {
          color: #34d399;
          margin: 0 0 24px 0;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        #bookmarks-panel .close-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid #ef4444;
          color: #ef4444;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }
        #bookmarks-panel .bookmark-item {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(52, 211, 153, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          transition: all 0.2s ease;
        }
        #bookmarks-panel .bookmark-item:hover {
          border-color: #34d399;
        }
        #bookmarks-panel .bookmark-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        #bookmarks-panel .bookmark-id {
          color: #34d399;
          font-weight: 600;
          font-size: 14px;
        }
        #bookmarks-panel .bookmark-actions {
          display: flex;
          gap: 8px;
        }
        #bookmarks-panel .bookmark-actions button {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 16px;
          transition: transform 0.2s ease;
        }
        #bookmarks-panel .bookmark-actions button:hover {
          transform: scale(1.2);
        }
        #bookmarks-panel .bookmark-note {
          color: #9ca3af;
          font-size: 13px;
          line-height: 1.6;
          margin-top: 8px;
          white-space: pre-wrap;
        }
        #bookmarks-panel .bookmark-date {
          color: #6b7280;
          font-size: 11px;
          margin-top: 8px;
        }
        #bookmarks-panel .no-bookmarks {
          color: #9ca3af;
          text-align: center;
          padding: 32px 0;
          font-size: 14px;
        }
        #bookmarks-panel .export-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: 2px solid #60a5fa;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          width: 100%;
          margin-top: 16px;
        }
      </style>
      <h2>
        📚 Marcadores
        <button class="close-btn" onclick="Bookmarks.closePanel()">✕</button>
      </h2>
      <div id="bookmarks-list"></div>
      <button class="export-btn" onclick="Bookmarks.exportBookmarks()">
        💾 Exportar Marcadores
      </button>
    `;

    document.body.appendChild(panel);
    updatePanelContent();

    // Cerrar con Esc
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closePanel();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  /**
   * Actualizar contenido del panel
   */
  function updatePanelContent() {
    if (!panel) return;

    const list = panel.querySelector('#bookmarks-list');
    if (!list) return;

    if (bookmarks.length === 0) {
      list.innerHTML = '<div class="no-bookmarks">No hay marcadores aún.<br>Usa ⭐ y 📝 en las actas.</div>';
      return;
    }

    // Ordenar: favoritos primero, luego por fecha
    const sorted = [...bookmarks].sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    list.innerHTML = sorted.map(bookmark => {
      const date = new Date(bookmark.updatedAt).toLocaleDateString('es-ES');
      return `
        <div class="bookmark-item">
          <div class="bookmark-header">
            <div class="bookmark-id">
              ${bookmark.starred ? '⭐ ' : ''}${bookmark.actaId}
            </div>
            <div class="bookmark-actions">
              <button onclick="Bookmarks.scrollToActa('${bookmark.actaId}')" title="Ir al acta">🔍</button>
              <button onclick="Bookmarks.removeBookmark('${bookmark.actaId}')" title="Eliminar">🗑️</button>
            </div>
          </div>
          ${bookmark.note ? `<div class="bookmark-note">${bookmark.note}</div>` : ''}
          <div class="bookmark-date">Actualizado: ${date}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Cerrar panel
   */
  function closePanel() {
    if (panel) {
      panel.remove();
      panel = null;
    }
  }

  /**
   * Scroll a acta específica
   */
  function scrollToActa(actaId) {
    const card = document.getElementById(actaId);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.animation = 'pulse 1s ease';
      setTimeout(() => {
        card.style.animation = '';
      }, 1000);
    }
  }

  /**
   * Exportar marcadores
   */
  function exportBookmarks() {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      bookmarks: bookmarks
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `actas-marcadores-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Importar marcadores
   */
  function importBookmarks(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.bookmarks && Array.isArray(data.bookmarks)) {
          bookmarks = data.bookmarks;
          saveBookmarks();
          updateUI();
          alert('Marcadores importados correctamente');
        }
      } catch (error) {
        alert('Error al importar marcadores');
        console.error(error);
      }
    };
    reader.readAsText(file);
  }

  /**
   * Actualizar UI
   */
  function updateUI() {
    addBookmarkButtons();
    updatePanelContent();
  }

  /**
   * Agregar botón al menú - DESHABILITADO
   */
  function addMenuButton() {
    // Botón deshabilitado - usar Alt+B o funcionalidad por código
    return;
  }

  /**
   * Actualizar contador de marcadores
   */
  function updateBookmarkCount() {
    const counter = document.getElementById('bookmark-count');
    if (counter) {
      counter.textContent = bookmarks.length;
    }
  }

  /**
   * Inicializar módulo
   */
  function init() {
    loadBookmarks();
    setTimeout(() => {
      addBookmarkButtons();
      addMenuButton();
    }, 500);
    console.log('📚 Sistema de marcadores listo');
  }

  return {
    init,
    add,
    remove,
    toggleStar,
    get,
    getAll,
    showPanel,
    closePanel,
    scrollToActa,
    exportBookmarks,
    importBookmarks,
    removeBookmark: remove
  };
})();

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
  Bookmarks.init();
});

window.Bookmarks = Bookmarks;
