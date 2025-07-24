// Breadcrumbs dinámico para tabs
const TAB_LABELS = {
  guia: 'Guía Rápida',
  arquitectura: 'Arquitectura',
  tecnologias: 'Tecnologías',
  uiux: 'UI/UX y Componentes',
  core: 'Funcionalidades Core',
  pantallas: 'Pantallas',
  api: 'APIs y Servicios',
  estado: 'Estado Actual',
  i18n: 'Internacionalización',
  testing: 'Testing y Calidad',
  deploy: 'Despliegue y Build',
  dev: 'Guías de Desarrollo',
  componentes: 'Componentes',
  analisis: 'Análisis'
};
function updateBreadcrumb(tab) {
  var el = document.getElementById('breadcrumb-current');
  if (el && TAB_LABELS[tab]) {
    el.textContent = TAB_LABELS[tab];
  }
}
// Hook en showTab
const origShowTab = window.showTab;
window.showTab = function(tab) {
  if (typeof origShowTab === 'function') origShowTab(tab);
  updateBreadcrumb(tab);
};
// Inicializa breadcrumb
updateBreadcrumb('guia');

// Buscador global para filtrar contenido de la documentación
(function() {
  const input = document.getElementById('globalSearch');
  if (!input) return;
  const tabContents = Array.from(document.querySelectorAll('.tab-content'));
  const noResultMsg = document.createElement('div');
  noResultMsg.textContent = 'No se encontraron resultados.';
  noResultMsg.style = 'padding:24px;text-align:center;color:#2563eb;font-weight:500;display:none;';
  tabContents.forEach(tab => tab.appendChild(noResultMsg.cloneNode(true)));

  input.addEventListener('input', function() {
    const query = input.value.trim().toLowerCase();
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    let found = false;
    // Filtra glass-cards, quick-link-cards, ul, li, p, h2-h5
    const blocks = Array.from(activeTab.querySelectorAll('.glass-card, .quick-link-card, ul, li, p, h2, h3, h4, h5'));
    blocks.forEach(el => {
      if (!query) {
        el.style.display = '';
        found = true;
        return;
      }
      const text = el.textContent.toLowerCase();
      if (text.includes(query)) {
        el.style.display = '';
        found = true;
      } else {
        el.style.display = 'none';
      }
    });
    // Mensaje de no resultados
    const msg = activeTab.querySelector('div[style*="No se encontraron resultados"]');
    if (msg) msg.style.display = found ? 'none' : 'block';
  });
  // Limpiar búsqueda al cambiar de tab
  const origShowTab2 = window.showTab;
  window.showTab = function(tab) {
    if (typeof origShowTab2 === 'function') origShowTab2(tab);
    input.value = '';
    input.dispatchEvent(new Event('input'));
  };
})();

// Índice dinámico lateral/flotante por tab
(function() {
  const toc = document.getElementById('tab-toc');
  if (!toc) return;
  function buildTOC() {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    // Solo mostrar en desktop
    if (window.innerWidth < 900) {
      toc.style.display = 'none';
      return;
    }
    toc.innerHTML = '<h4 style="margin-bottom:10px;font-size:1.1em;color:var(--primary-blue-dark);">Índice</h4>';
    const headings = Array.from(activeTab.querySelectorAll('h2, h3, h4'));
    if (!headings.length) {
      toc.innerHTML += '<div style="color:#888;font-size:0.98em;padding:12px 0 0 0;">No hay secciones en este tab.</div>';
      toc.style.display = '';
      return;
    }
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none'; ul.style.padding = '0';
    headings.forEach((h, i) => {
      if (!h.id) h.id = 'section-' + i + '-' + Date.now();
      const li = document.createElement('li');
      li.style.marginBottom = '7px';
      li.style.marginLeft = h.tagName === 'H3' ? '12px' : h.tagName === 'H4' ? '22px' : '0';
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/^[^\w]+/, '').trim();
      a.style.color = 'var(--primary-blue-dark)';
      a.style.fontWeight = h.tagName === 'H2' ? '600' : '400';
      a.style.fontSize = h.tagName === 'H2' ? '1em' : '0.97em';
      a.setAttribute('tabindex', '0');
      a.setAttribute('aria-label', 'Ir a sección ' + a.textContent);
      li.appendChild(a);
      ul.appendChild(li);
    });
    toc.appendChild(ul);
    toc.style.display = '';
  }
  // Resalta el ítem activo según el scroll
  function highlightTOC() {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    const headings = Array.from(activeTab.querySelectorAll('h2, h3, h4'));
    const links = toc.querySelectorAll('a');
    let idx = 0;
    for (let i = 0; i < headings.length; i++) {
      const rect = headings[i].getBoundingClientRect();
      if (rect.top < 120) idx = i;
    }
    links.forEach((a, i) => {
      if (i === idx) {
        a.style.background = 'var(--primary-blue-light)';
        a.style.color = '#fff';
        a.style.borderRadius = '6px';
        a.style.padding = '2px 8px';
      } else {
        a.style.background = 'none';
        a.style.color = 'var(--primary-blue-dark)';
        a.style.padding = '0';
      }
    });
  }
  // Rebuild TOC on tab change
  const origShowTab3 = window.showTab;
  window.showTab = function(tab) {
    if (typeof origShowTab3 === 'function') origShowTab3(tab);
    setTimeout(buildTOC, 80);
    setTimeout(highlightTOC, 200);
  };
  // Build TOC on load and on resize
  window.addEventListener('DOMContentLoaded', buildTOC);
  window.addEventListener('resize', buildTOC);
  document.addEventListener('scroll', function() { setTimeout(highlightTOC, 30); }, true);
})();

// Botón de copiar en bloques de código
(function() {
  function addCopyButtons() {
    const blocks = document.querySelectorAll('.code-block');
    blocks.forEach(block => {
      if (block.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copiar código');
      btn.textContent = 'Copiar';
      btn.onclick = function() {
        const code = block.querySelector('code');
        if (!code) return;
        navigator.clipboard.writeText(code.innerText).then(() => {
          btn.textContent = '¡Copiado!';
          setTimeout(() => { btn.textContent = 'Copiar'; }, 1200);
        });
      };
      block.appendChild(btn);
    });
  }
  window.addEventListener('DOMContentLoaded', addCopyButtons);
  // También al cambiar de tab
  const origShowTab4 = window.showTab;
  window.showTab = function(tab) {
    if (typeof origShowTab4 === 'function') origShowTab4(tab);
    setTimeout(addCopyButtons, 80);
  };
})();

// Actualización automática de fecha de “Última actualización”
(function() {
  function updateLastUpdated() {
    const date = new Date();
    const opts = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = date.toLocaleDateString('es-ES', opts);
    document.querySelectorAll('.last-updated').forEach(el => {
      el.textContent = 'Última actualización: ' + formatted;
    });
  }
  window.addEventListener('DOMContentLoaded', updateLastUpdated);
})();

// Carga dinámica de contenido externo en tabs
(function() {
  const TAB_FILES = {
    arquitectura: 'src/docs-arquitectura.html',
    tecnologias: 'src/docs-tecnologias.html',
    uiux: 'src/docs-uiux.html',
    core: 'src/docs-core.html',
    pantallas: 'src/docs-pantallas.html',
    api: 'src/docs-api.html',
    estado: 'src/docs-estado.html',
    i18n: 'src/docs-i18n.html',
    testing: 'src/docs-testing.html',
    deploy: 'src/docs-deploy.html',
    dev: 'src/docs-dev.html',
    componentes: 'src/docs-componentes.html',
    analisis: 'src/docs-analisis.html'
  };
  const loadedTabs = {};
  const origShowTab5 = window.showTab;
  window.showTab = function(tab) {
    if (typeof origShowTab5 === 'function') origShowTab5(tab);
    const tabDiv = document.getElementById('tab-' + tab);
    if (!tabDiv || !TAB_FILES[tab] || loadedTabs[tab]) return;
    tabDiv.innerHTML = '<div style="padding:32px;text-align:center;color:#2563eb;font-weight:500;">Cargando contenido...</div>';
    fetch(TAB_FILES[tab]).then(r => r.text()).then(html => {
      tabDiv.innerHTML = html;
      loadedTabs[tab] = true;
      // Reaplicar mejoras visuales y funcionales
      if (window.updateLastUpdated) window.updateLastUpdated();
      if (window.addCopyButtons) window.addCopyButtons();
      if (window.buildTOC) window.buildTOC();
    }).catch(() => {
      tabDiv.innerHTML = '<div style="padding:32px;text-align:center;color:#e11d48;font-weight:500;">No se pudo cargar el contenido.</div>';
    });
  };
})(); 