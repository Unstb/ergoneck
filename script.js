const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

const mediaModal = document.querySelector('#media-modal');
const modalStage = document.querySelector('#modal-stage');
const modalTitle = document.querySelector('#modal-title');
const modalKicker = document.querySelector('#modal-kicker');
const modalHelp = document.querySelector('#modal-help');
const modalClose = document.querySelector('.modal-close');
const modelSource = window.ERGONECK_MODEL_DATA || 'ergoneck-model.glb';

function enhanceModelViewer(viewer) {
  const applyMaterials = () => {
    const materials = viewer.model?.materials || [];
    materials.forEach(material => {
      const surface = material.pbrMetallicRoughness;
      if (!surface) return;
      surface.setBaseColorFactor([0.68, 0.76, 0.82, 1]);
      surface.setMetallicFactor(0.06);
      surface.setRoughnessFactor(0.74);
    });
  };

  viewer.addEventListener('load', applyMaterials, { once: true });
  if (viewer.loaded) applyMaterials();
}

document.querySelectorAll('model-viewer').forEach(viewer => {
  viewer.setAttribute('src', modelSource);
  enhanceModelViewer(viewer);
});

function openMediaModal(type) {
  modalStage.replaceChildren();
  modalStage.className = `modal-stage modal-stage-${type}`;

  if (type === 'model') {
    const viewer = document.createElement('model-viewer');
    viewer.setAttribute('src', modelSource);
    viewer.setAttribute('alt', 'Интерактивная 3D-модель шейного ортеза ErgoNeck');
    viewer.setAttribute('camera-controls', '');
    viewer.setAttribute('auto-rotate', '');
    viewer.setAttribute('rotation-per-second', '12deg');
    viewer.setAttribute('camera-orbit', '28deg 68deg 128%');
    viewer.setAttribute('field-of-view', '31deg');
    viewer.setAttribute('interaction-prompt', 'auto');
    viewer.setAttribute('environment-image', 'neutral');
    viewer.setAttribute('shadow-intensity', '1.5');
    viewer.setAttribute('exposure', '0.56');
    enhanceModelViewer(viewer);
    modalStage.append(viewer);
    modalKicker.textContent = '3D MODEL / INTERACTIVE';
    modalTitle.textContent = 'Объёмная модель ErgoNeck';
    modalHelp.textContent = 'Зажмите и перемещайте, чтобы вращать · колесо или жест — масштаб';
  } else {
    const image = document.createElement('img');
    image.src = 'ergoneck-blueprint.jpg';
    image.alt = 'Технический чертёж ErgoNeck с размерами и обозначениями';
    modalStage.append(image);
    modalKicker.textContent = 'BLUEPRINT / V4.1';
    modalTitle.textContent = 'Технический чертёж ErgoNeck';
    modalHelp.textContent = 'Нажмите Esc или кнопку закрытия, чтобы вернуться на сайт';
  }

  document.body.classList.add('modal-open');
  mediaModal.showModal();
}

document.querySelectorAll('[data-modal-type]').forEach(view => {
  view.addEventListener('click', () => openMediaModal(view.dataset.modalType));
  view.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMediaModal(view.dataset.modalType);
    }
  });
});

modalClose.addEventListener('pointerdown', event => event.stopPropagation());
modalClose.addEventListener('click', event => {
  event.stopPropagation();
  mediaModal.close();
});
mediaModal.addEventListener('click', event => {
  if (event.target === mediaModal) mediaModal.close();
});
mediaModal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  modalStage.replaceChildren();
  modalStage.className = 'modal-stage';
});

const purchaseButton = document.querySelector('#purchase-button');
const purchaseStatus = document.querySelector('#purchase-status');
purchaseButton.addEventListener('click', () => {
  purchaseButton.classList.add('is-ready');
  purchaseButton.innerHTML = 'Предзаказ скоро <span>✓</span>';
  purchaseStatus.textContent = 'Продажи откроются после финальных испытаний ErgoNeck.';
});
