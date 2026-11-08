const all = <T extends Element = HTMLElement>(selector: string, parent: ParentNode = document) => [...parent.querySelectorAll<T>(selector)];
const one = <T extends Element = HTMLElement>(selector: string, parent: ParentNode = document) => parent.querySelector<T>(selector)!;

// Native navigation and scrolling remain available without JavaScript.
const menu = one<HTMLButtonElement>('.menu-button');
const nav = one('#main-nav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menú');
  nav.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav.classList.toggle('is-open', open);
});
all<HTMLAnchorElement>('a', nav).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (event.target instanceof Node && !one('.site-header').contains(event.target)) closeMenu();
});

// Observers do the work only at section boundaries, without scroll listeners.
const sections = all<HTMLElement>('.journey-section');
const guideLabel = one('#guide-label');
const guideLink = one<HTMLAnchorElement>('#guide-link');
const guideProgress = one('.guide-progress i');
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const section = entry.target as HTMLElement;
    guideLabel.textContent = section.dataset.guide!;
    one('span', guideLink).textContent = section.dataset.next!;
    guideLink.href = section.dataset.target!;
    guideProgress.style.width = `${((sections.indexOf(section) + 1) / sections.length) * 100}%`;
    all<HTMLAnchorElement>('a', nav).forEach(link => {
      if (link.hash === `#${section.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-15% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        revealObserver.unobserve(entry.target);
      } else if (entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? window.innerHeight)) {
        entry.target.classList.add('reveal-pending');
      }
    });
  }, { threshold: 0.06 });
  all('[data-reveal]').forEach(element => revealObserver.observe(element));
}

const serviceDetails = all<HTMLDetailsElement>('.service-detail');
const expandServices = one<HTMLButtonElement>('#expand-services');
function syncServicesButton() {
  const expanded = serviceDetails.every(detail => detail.open);
  expandServices.firstChild!.textContent = expanded ? 'Ocultar detalles de servicios ' : 'Descubrir todos los servicios ';
  expandServices.setAttribute('aria-expanded', String(expanded));
}
expandServices.addEventListener('click', () => {
  const expanded = serviceDetails.every(detail => detail.open);
  serviceDetails.forEach(detail => { detail.open = !expanded; });
  syncServicesButton();
});
serviceDetails.forEach(detail => detail.addEventListener('toggle', syncServicesButton));
expandServices.setAttribute('aria-expanded', 'false');

// A native dialog handles focus containment, Escape and returning focus.
const requestDialog = one<HTMLDialogElement>('#request-dialog');
const requestForm = one<HTMLFormElement>('#request-form');
all<HTMLButtonElement>('[data-open-request]').forEach(button => button.addEventListener('click', () => {
  all<HTMLDialogElement>('dialog[open]').forEach(dialog => dialog.close());
  if (button.dataset.service) {
    all<HTMLInputElement>('[name="services"]', requestForm).forEach(input => {
      if (input.value === button.dataset.service) input.checked = true;
    });
  }
  requestDialog.showModal();
}));
all<HTMLDialogElement>('dialog').forEach(dialog => {
  all<HTMLButtonElement>('[data-close]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
all<HTMLAnchorElement>('[data-whatsapp="pending"]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  one<HTMLDialogElement>('#whatsapp-dialog').showModal();
}));
one('[data-open-privacy]').addEventListener('click', () => one<HTMLDialogElement>('#privacy-dialog').showModal());

function announce(form: HTMLFormElement, message: string) {
  const status = one('.form-status', form);
  status.textContent = message;
  status.hidden = false;
  status.focus();
}

// The audit is intentionally a front-end preview: no endpoint, storage or AI call.
const audit = one<HTMLFormElement>('#audit-form');
const steps = all<HTMLFieldSetElement>('[data-step]', audit);
const stepIndicators = all<HTMLLIElement>('.form-steps li');
const previous = one<HTMLButtonElement>('[data-back]', audit);
const titles = ['Empecemos por conocerte.', 'Miremos tu presencia digital.', 'Pongámosle nombre a la idea.'];
const descriptions = ['Cuéntanos un poco de tu negocio. Vamos paso a paso.', 'Comparte tus canales. No necesitas tenerlos todos.', 'Solo falta saber cómo podemos hablar contigo.'];
let currentStep = 0;
function showStep(index: number, focus = true) {
  currentStep = index;
  steps.forEach((step, i) => { step.hidden = i !== index; });
  stepIndicators.forEach((indicator, i) => {
    if (i === index) indicator.setAttribute('aria-current', 'step');
    else indicator.removeAttribute('aria-current');
  });
  previous.hidden = index === 0;
  one('[data-next-label]', audit).textContent = index === steps.length - 1 ? 'Solicitar análisis' : 'Continuar';
  one('.audit-panel h3').textContent = titles[index];
  one('.panel-description').textContent = descriptions[index];
  one('.panel-topline > span:last-child').textContent = `0${index + 1} — 03`;
  one('.form-status', audit).hidden = true;
  if (focus) one<HTMLInputElement>('input', steps[index]).focus({ preventScroll: true });
}
function validateStep() {
  for (const input of all<HTMLInputElement | HTMLTextAreaElement>('input, textarea', steps[currentStep])) {
    if (!input.reportValidity()) return false;
  }
  return true;
}
showStep(0, false);
previous.addEventListener('click', () => showStep(currentStep - 1));
audit.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateStep()) return;
  if (currentStep < steps.length - 1) { showStep(currentStep + 1); return; }
  announce(audit, 'Gracias por explorar el formulario. La solicitud de análisis estará disponible próximamente. Tus datos no se han enviado ni guardado.');
});

const serviceInputs = all<HTMLInputElement>('[name="services"]', requestForm);
serviceInputs.forEach(input => input.addEventListener('change', () => serviceInputs[0].setCustomValidity('')));
requestForm.addEventListener('submit', event => {
  event.preventDefault();
  const selected = serviceInputs.filter(input => input.checked);
  serviceInputs[0].setCustomValidity(selected.length ? '' : 'Selecciona al menos un servicio.');
  if (!requestForm.reportValidity()) return;
  const email = requestDialog.dataset.email;
  const whatsapp = requestDialog.dataset.whatsapp;
  if (!email && !whatsapp) {
    announce(requestForm, 'Tu selección: ' + selected.map(input => input.value).join(', ') + '. El envío estará disponible próximamente. Tus datos no se han enviado ni guardado.');
    return;
  }
  const data = new FormData(requestForm);
  const message = `Hola, ZETA LAB.\n\nSoy ${data.get('name')}.\nCorreo: ${data.get('email')}\nMe interesa: ${selected.map(input => input.value).join(', ')}.\n\n${data.get('message') || ''}`;
  window.location.href = email
    ? `mailto:${email}?subject=${encodeURIComponent('Nuevo proyecto · ZETA LAB')}&body=${encodeURIComponent(message)}`
    : `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  announce(requestForm, 'Hemos preparado el mensaje. Revisa y envía la solicitud desde tu aplicación de contacto.');
});
