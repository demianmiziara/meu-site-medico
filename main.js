document.addEventListener('DOMContentLoaded', () => {
  // ── SCROLL ANIMATIONS (HEADER & FLOATING CTA) ──
  const header = document.querySelector('header');
  const floatingCta = document.querySelector('.floating-cta');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Estilo do Header
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        // Botão flutuante do WhatsApp
        if (floatingCta) {
          if (window.scrollY > 300) {
            floatingCta.classList.add('visible');
          } else {
            floatingCta.classList.remove('visible');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ── SCROLL REVEAL EFFECT ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Add subtle staggered delays for items revealing simultaneously
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // ── MOBILE MENU DRAWERS ──
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (menuToggle && mobileNav) {
    const toggleMenu = () => {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── FAQ ACCORDION ──
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other active items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          // Smooth transition calculation
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // ── FLOATING CALL-TO-ACTION (WHATSAPP INITIAL STATE) ──
  // (Controlada pelo listener unificado e otimizado no topo da página)

  // ── NOVIDADES ──
  const grid = document.getElementById('novidades-grid');
  if (grid) {
    const tipoLabel = { curiosidade: 'Curiosidade', artigo: 'Artigo', foto: 'Foto' };
    const formatData = (iso) => {
      const [y, m, d] = iso.split('-');
      return `${d}/${m}/${y}`;
    };
    fetch('/noticias.json')
      .then(r => r.json())
      .then(items => {
        if (!items.length) return;
        grid.innerHTML = items.map(n => `
          <article class="novidade-card">
            ${n.imagem ? `<img src="${n.imagem}" alt="${n.titulo}" loading="lazy">` : ''}
            <div class="novidade-body">
              <p class="novidade-tipo">${tipoLabel[n.tipo] || n.tipo}</p>
              <p class="novidade-data">${formatData(n.data)}</p>
              <h3 class="novidade-titulo">${n.titulo}</h3>
              <p class="novidade-resumo">${n.resumo}</p>
            </div>
          </article>
        `).join('');
      })
      .catch(() => { grid.innerHTML = ''; });
  }
});
