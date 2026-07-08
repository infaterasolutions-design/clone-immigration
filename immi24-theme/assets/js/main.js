document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.querySelector('.js-mobile-menu-toggle');
    const mobileMenu = document.querySelector('.js-mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            if (mobileMenu.classList.contains('opacity-0')) {
                // Open menu smoothly
                mobileMenu.classList.remove('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-4');
                mobileMenu.classList.add('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
                // Close search dropdown if open
                const searchDropdown = document.querySelector('.js-mobile-search-dropdown');
                if (searchDropdown && !searchDropdown.classList.contains('opacity-0')) {
                    searchDropdown.classList.add('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-4');
                    searchDropdown.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
                }

                mobileMenuToggle.classList.add('is-active');
            } else {
                // Close menu smoothly
                mobileMenu.classList.add('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-4');
                mobileMenu.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
                mobileMenuToggle.classList.remove('is-active');
            }
        });
    }

    // --- Search Toggle (Reuters Style Expansion) ---
    const searchContainer = document.querySelector('.js-search-container');
    const searchToggle = document.querySelector('.js-search-toggle');
    const searchClose = document.querySelector('.js-search-close');
    const searchInput = document.querySelector('.js-search-input');
    const header = document.getElementById('masthead');

    function openSearch() {
        if(header) header.classList.add('search-open');
        if(searchClose) searchClose.classList.add('visible');
        if(searchInput) {
            searchInput.classList.add('expanded');
            setTimeout(() => searchInput.focus(), 100);
        }
    }

    function closeSearch() {
        if(header) header.classList.remove('search-open');
        if(searchClose) searchClose.classList.remove('visible');
        if(searchInput) {
            searchInput.classList.remove('expanded');
            searchInput.value = '';
            searchInput.blur();
        }
    }

    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            // If already open, clicking the icon submits the form
            if (header && header.classList.contains('search-open')) {
                const form = searchToggle.closest('form');
                if (form && searchInput && searchInput.value.trim() !== '') {
                    form.submit();
                }
            } else {
                e.preventDefault();
                openSearch();
            }
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeSearch();
        });
    }

    // Mobile specific search toggle logic
    const mobileSearchToggle = document.querySelector('.js-mobile-search-toggle');
    const mobileSearchDropdown = document.querySelector('.js-mobile-search-dropdown');
    
    if (mobileSearchToggle && mobileSearchDropdown) {
        mobileSearchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('opacity-0')) {
                if (mobileMenuToggle) mobileMenuToggle.click();
            }

            if (mobileSearchDropdown.classList.contains('opacity-0')) {
                // Open search dropdown smoothly
                mobileSearchDropdown.classList.remove('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-4');
                mobileSearchDropdown.classList.add('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
                setTimeout(() => {
                    const mobileInput = mobileSearchDropdown.querySelector('input[type="search"]');
                    if (mobileInput) mobileInput.focus();
                }, 100);
            } else {
                // Close search dropdown smoothly
                mobileSearchDropdown.classList.add('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-4');
                mobileSearchDropdown.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
            }
        });
    }

    // Close search on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearch();
            // Also close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('opacity-0')) {
                if (mobileMenuToggle) mobileMenuToggle.click();
            }
            // Also close mobile search dropdown if open
            const searchDropdown = document.querySelector('.js-mobile-search-dropdown');
            if (searchDropdown && !searchDropdown.classList.contains('opacity-0')) {
                searchDropdown.classList.add('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-4');
                searchDropdown.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
            }
        }
    });

    // Close search when clicking outside
    document.addEventListener('mousedown', function(e) {
        if (header && header.classList.contains('search-open')) {
            if (!header.contains(e.target)) {
                closeSearch();
            }
        }
    });
});
