document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');

  // Load saved state (default: open on desktop, closed on mobile)
  const isMobile = window.innerWidth <= 900;
  const savedCollapsed = localStorage.getItem('sidebarCollapsed');
  const startCollapsed = savedCollapsed !== null ? savedCollapsed === 'true' : isMobile;

  function setSidebar(collapsed) {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
      sidebar.classList.add('collapsed');
      sidebar.classList.remove('open');
    } else {
      document.body.classList.remove('sidebar-collapsed');
      sidebar.classList.remove('collapsed');
      if (isMobile || window.innerWidth <= 900) sidebar.classList.add('open');
    }
    localStorage.setItem('sidebarCollapsed', String(collapsed));
  }

  setSidebar(startCollapsed);

  if (toggle && sidebar) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyCollapsed = document.body.classList.contains('sidebar-collapsed') ||
        sidebar.classList.contains('collapsed') && !sidebar.classList.contains('open');
      setSidebar(!isCurrentlyCollapsed);
    });

    // Mobile: close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 &&
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !toggle.contains(e.target)) {
        setSidebar(true);
      }
    });
  }

  // Submenu accordion
  document.querySelectorAll('.nav-has-sub > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = link.closest('.nav-has-sub');
      const isOpen = parent.classList.contains('open');
      parent.closest('ul, .nav-submenu')?.querySelectorAll('.nav-has-sub.open')
        .forEach(el => el !== parent && el.classList.remove('open'));
      parent.classList.toggle('open', !isOpen);
    });
  });

  // Mark active link
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href !== '#' && (href === current || href.split('#')[0] === current)) {
      a.classList.add('active');
      let par = a.closest('.nav-has-sub');
      while (par) { par.classList.add('open'); par = par.parentElement?.closest('.nav-has-sub'); }
    }
  });
});
