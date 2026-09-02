(() => {
    const body = document.body;
    const searchToggle = document.querySelector('.lhc-search-toggle');
    const searchDropdown = document.querySelector('#lhcSearchDropdown');
    const mobileToggle = document.querySelector('.lhc-mobile-toggle');
    const mobileMenu = document.querySelector('#lhcMobileMenu');

    const setExpanded = (control, expanded) => {
        if (control) control.setAttribute('aria-expanded', String(expanded));
    };

    const closeMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.setAttribute('aria-hidden', 'true');
        setExpanded(mobileToggle, false);
        body.classList.remove('lhc-menu-open');
    };

    if (searchToggle && searchDropdown) {
        searchDropdown.setAttribute('aria-hidden', 'true');
        searchToggle.addEventListener('click', () => {
            const isOpen = searchDropdown.getAttribute('aria-hidden') !== 'true';
            searchDropdown.setAttribute('aria-hidden', String(isOpen));
            setExpanded(searchToggle, !isOpen);
            if (!isOpen) searchDropdown.querySelector('input')?.focus();
        });
    }

    if (mobileToggle && mobileMenu) {
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.getAttribute('aria-hidden') !== 'true';
            mobileMenu.setAttribute('aria-hidden', String(isOpen));
            setExpanded(mobileToggle, !isOpen);
            body.classList.toggle('lhc-menu-open', !isOpen);
        });
        mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMobileMenu();
            if (searchDropdown) searchDropdown.setAttribute('aria-hidden', 'true');
            setExpanded(searchToggle, false);
        }
    });
})();
