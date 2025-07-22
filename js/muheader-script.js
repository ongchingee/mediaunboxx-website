/**
 * Header Menu Functionality - Standalone JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Helper function to check if the menu is active
    function isMenuActive() {
        const popupMenu = document.getElementById('popup-menu');
        return popupMenu && popupMenu.classList.contains('active');
    }
    
    // Handle browser back/forward navigation for menu state
    window.addEventListener('pageshow', function(event) {
        // Always hide the popup menu when navigating back or loading the page
        const popupMenu = document.getElementById('popup-menu');
        if (popupMenu) {
            // Remove the 'active' class to hide the menu
            popupMenu.classList.remove('active');
        }
        
        // If the page is being restored from the bfcache (back/forward navigation)
        if (event.persisted) {
            // Ensure the body is visible and scroll is enabled
            document.body.style.opacity = '1';
            document.body.style.overflow = '';
        }
    });
    
    // Popup menu functionality
    const menuBtn = document.getElementById('menu-btn');
    const popupMenu = document.getElementById('popup-menu');
    const menuClose = document.getElementById('menu-close');
    
    if (menuBtn && popupMenu && menuClose) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            popupMenu.classList.add('active');
        });
        
        menuClose.addEventListener('click', function(e) {
            e.stopPropagation();
            popupMenu.classList.remove('active');
        });
        
        popupMenu.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }
    
    // Add transition effect to all menu links (both main and sub)
    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if the link has an href attribute and it's not empty or #
            const href = this.getAttribute('href');
            if (!href || href === '#' || href === 'javascript:void(0)') {
                return; // Don't add transition effect to non-navigating links
            }
            
            e.preventDefault(); // Prevent immediate navigation
            
            // Apply transition class to body
            document.body.classList.add('page-transition');
            
            // Navigate after transition completes
            setTimeout(() => {
                window.location.href = href;
            }, 500); // Match the transition duration
        });
    });
    
    // Menu scrolling handlers
    const menuLinksElement = document.querySelector('.menu-links');
    if (menuLinksElement) {
        // Variables for menu touch handling
        let menuTouchStartY = 0;
        
        // Wheel events in menu
        menuLinksElement.addEventListener('wheel', function(event) {
            // Only do special handling if menu is active
            if (!isMenuActive()) return;
            
            // Check if we're at scroll boundaries
            const atTop = this.scrollTop <= 0 && event.deltaY < 0;
            const atBottom = this.scrollTop + this.clientHeight >= this.scrollHeight && event.deltaY > 0;
            
            // Prevent overscroll effect at boundaries
            if (atTop || atBottom) {
                event.preventDefault();
            }
            
            // Stop the event from reaching the window handler
            event.stopPropagation();
        }, { passive: false });
        
        // Touch start in menu
        menuLinksElement.addEventListener('touchstart', function(event) {
            menuTouchStartY = event.touches[0].clientY;
        }, { passive: true });
        
        // Touch move in menu
        menuLinksElement.addEventListener('touchmove', function(event) {
            // Only process if menu is active
            if (!isMenuActive()) return;
            
            const touchY = event.touches[0].clientY;
            const scrollingUp = touchY > menuTouchStartY;
            const scrollingDown = touchY < menuTouchStartY;
            
            // Check if we're at boundaries
            const atTop = this.scrollTop <= 0 && scrollingUp;
            const atBottom = this.scrollTop + this.clientHeight >= this.scrollHeight && scrollingDown;
            
            // Prevent overscroll bounce effect at boundaries
            if (atTop || atBottom) {
                event.preventDefault();
            }
            
            // Stop propagation to prevent cube rotation or other page interactions
            event.stopPropagation();
        }, { passive: false });
    }

    // Close menu with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuActive()) {
            const popupMenu = document.getElementById('popup-menu');
            if (popupMenu) {
                popupMenu.classList.remove('active');
            }
        }
    });
    
    // Handle body scroll when menu is open/closed
    function updateBodyScroll() {
        if (isMenuActive()) {
            // Store current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    }
    
    // Add listeners for menu state changes to update body scroll
    if (menuBtn && popupMenu) {
        menuBtn.addEventListener('click', function() {
            // Small delay to ensure the menu class is updated first
            setTimeout(updateBodyScroll, 10);
        });
        
        if (menuClose) {
            menuClose.addEventListener('click', function() {
                setTimeout(updateBodyScroll, 10);
            });
        }
        
        // When clicking on the menu background (to close it)
        popupMenu.addEventListener('click', function(e) {
            if (e.target === this) {
                setTimeout(updateBodyScroll, 10);
            }
        });
    }
    
    // Additional helper for mobile devices - prevent document bouncing
    document.addEventListener('touchmove', function(e) {
        if (isMenuActive()) {
            // Allow scrolling only in menu content
            const menuContent = document.querySelector('.menu-links');
            let isInMenuContent = false;
            let element = e.target;
            
            // Check if the touch is in the menu content
            while (element && element !== document.body) {
                if (element === menuContent) {
                    isInMenuContent = true;
                    break;
                }
                element = element.parentElement;
            }
            
            // Prevent document bouncing when not in menu content
            if (!isInMenuContent) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    // Handle window resize - adjust menu if needed
    window.addEventListener('resize', function() {
        if (isMenuActive()) {
            // Ensure menu is properly positioned on resize
            const menuLinks = document.querySelector('.menu-links');
            if (menuLinks) {
                // Reset scroll to avoid issues after rotation or resize
                menuLinks.scrollTop = 0;
            }
        }
    });
});