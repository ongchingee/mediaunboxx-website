document.addEventListener('DOMContentLoaded', function() {

    // Check if we're coming from a page transition - DO NOT DELETE
    if (document.body.classList.contains('page-transition')) {
        // Remove the transition class immediately
        document.body.classList.remove('page-transition');
    }
   
    // Handle browser back/forward navigation - Simplified for non-menu code - DO NOTE DELETE
    window.addEventListener('pageshow', function(event) {
        // If the page is being restored from the bfcache (back/forward navigation)
        if (event.persisted) {
            // Remove the transition class
            document.body.classList.remove('page-transition');
            // Ensure the body is visible
            document.body.style.opacity = '1';
        }
    });

    // === RESPONSIVE VIDEO LOADING === <-- ADD THIS SECTION HERE
//    function loadResponsiveVideos() {
//        const isDesktop = window.innerWidth > 992;
//        const videoSuffix = isDesktop ? '1200x1200' : '800x800';
//        
//        console.log('Screen width:', window.innerWidth, 'isDesktop:', isDesktop, 'videoSuffix:', videoSuffix);
//        
//        const cubeVideos = document.querySelectorAll('.cube-face video');
//        console.log('Found videos:', cubeVideos.length);
//        
//        cubeVideos.forEach(video => {
//            const source = video.querySelector('source[type="video/mp4"]');
//            if (source) {
//                const currentSrc = source.getAttribute('src');
//                const newSrc = currentSrc.replace(/800x800/, videoSuffix);
//                
//                console.log('Changing:', currentSrc, 'to:', newSrc);
//                
//                if (currentSrc !== newSrc) {
//                    source.setAttribute('src', newSrc);
//                    video.load();
//                }
//            }
//        });
//    }
//
    // Call responsive video loading on page load
//    loadResponsiveVideos();
    // END OF RESPONSIVE VIDEO LOADING
    
    const cube = document.getElementById('cube');
    const cubeFaces = document.querySelectorAll('.cube-face');
    let currentlyHoveredFace = null;
    
    // Create a single background image container and element
    const bgContainer = document.createElement('div');
    bgContainer.id = 'bg-container';
    
    const bgImage = document.createElement('div');
    bgImage.id = 'bg-image';
    
    bgContainer.appendChild(bgImage);
    document.body.appendChild(bgContainer);
    
    // START OF CUSTOM CURSOR CODE
    const customCursor = document.getElementById('custom-cursor');
    const cursorContent = customCursor.querySelector('.cursor-content');
    
    // ADD THIS CODE: Check if device has touch/mobile capabilities
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };

    // Only initialize cursor on non-touch devices
    if (!isTouchDevice()) {
    // KEEP ALL THE EXISTING CURSOR CODE INSIDE THIS IF STATEMENT:
    
        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });
        
        // Change cursor state when hovering over cube faces
        document.querySelectorAll('.cube-face').forEach(face => {
            face.addEventListener('mouseenter', () => {
                customCursor.classList.add('hover');
            });
            
            face.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hover');
            });
        });
        
        // Hide cursor when leaving the window
        document.addEventListener('mouseleave', () => {
            customCursor.style.opacity = '0';
        });
        
        // Show cursor when entering the window
        document.addEventListener('mouseenter', () => {
            customCursor.style.opacity = '1';
        });
        
        // Additional code you may have for cursor states
    } else {
        // Hide cursor element on touch devices
        customCursor.style.display = 'none';
    }

    // END OF CUSTOM CURSOR CODE ↑
    
    // Additional cursor state management
    let isDraggingCursor = false;
    
    // Detect mousedown/mouseup for dragging state
    document.addEventListener('mousedown', () => {
        isDraggingCursor = true;
        customCursor.classList.add('dragging');
    });
    
    document.addEventListener('mouseup', () => {
        isDraggingCursor = false;
        customCursor.classList.remove('dragging');
    });
    
    // Force cursor to be visible during all events
    document.addEventListener('dragstart', (e) => {
        e.preventDefault(); // Prevent default drag behavior
        customCursor.style.opacity = '1';
        customCursor.style.visibility = 'visible';
    });
    
    // Additional event to ensure cursor stays visible
    setInterval(() => {
        if (customCursor.style.opacity !== '1') {
            customCursor.style.opacity = '1';
        }
    }, 100);
    
    // Page transition element
    const pageTransition = document.getElementById('page-transition');
    
    // IMPORTANT: Reset page transition when page loads (including back button)
    pageTransition.classList.remove('active');
    
    // Check if we're coming from a page transition
    if (document.body.classList.contains('page-transition')) {
        // Remove the transition class immediately
        document.body.classList.remove('page-transition');
    }
    
    // Force refresh on back button
    let perfEntries = performance.getEntriesByType("navigation");
    if (perfEntries.length > 0 && perfEntries[0].type === 'back_forward') {
        // Coming from back/forward navigation - force refresh
        window.location.reload();
    } else {
        // Handle browser back/forward navigation (fallback for browsers that don't support performance API)
        window.addEventListener('pageshow', function(event) {
            // This fires when navigating back to a page using back/forward cache
            if (event.persisted) {
                // Page was loaded from cache (back button)
                window.location.reload();
            }
        });
    }
    
    // SIMPLE SPIN-OUT TRANSITION FUNCTION
    function triggerSpinOutTransition(targetUrl) {
        // Stop auto-rotation
        stopAutoRotation();
        
        // Add transition class for smooth animation
        cube.classList.add('cube-spin-out');
        
        // Calculate final transform: current position + lots of spinning + scale to 0
        const finalRotateX = rotateX; // Keep X-axis stable
        const finalRotateY = rotateY + 1080; // 3 full rotations
        const finalScale = 0; // Scale down to nothing
        
        // Apply the spin-out transform
        cube.style.transform = `scale3d(${finalScale}, ${finalScale}, ${finalScale}) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg)`;
        
        // Start black fade after a brief delay
        setTimeout(() => {
            pageTransition.classList.add('active');
        }, 200);
        
        // Navigate after transition completes
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 1500);
    }

    // SIMPLIFIED cube face click handlers - just spin out
    cubeFaces.forEach(face => {
        face.addEventListener('click', function(e) {
            // Only handle direct clicks on the face, not on child elements
            if (e.currentTarget === face) {
                e.preventDefault();
                const targetUrl = face.getAttribute('href');
                triggerSpinOutTransition(targetUrl);
            }
        });
    });
    
    // SIMPLIFIED inner cube click handler - same spin out effect
    const innerCube = document.getElementById('inner-cube');
    if (innerCube) {
        innerCube.addEventListener('click', function(e) {
            e.preventDefault();
            const targetUrl = innerCube.getAttribute('href');
            triggerSpinOutTransition(targetUrl);
        });
    }
    
    // Variable to track last touched face
    let lastTouchedFace = null;
    
    // Set initial rotation to match the screenshot's 3D view
    let rotateX = -20;
    let rotateY = -35;
    let scale = 1.0;
    
    // Auto-rotation variables
    let isAutoRotating = true;
    let autoRotateId = null;
    let inactivityTimer = null;
    const inactivityTimeout = 3000; // 3 seconds of inactivity before auto-rotation resumes
    
    // Mouse control variables
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let dragStartTime = 0;
    let dragDistance = 0;
    
    // Initialize cube rotation
    updateCubeRotation();
    
    // Start auto-rotation
    startAutoRotation();
    
    // Handle scroll events
    window.addEventListener('wheel', (event) => {
        stopAutoRotation();
        
        // Determine scroll direction
        const deltaY = event.deltaY;
        const deltaX = event.deltaX;
        
        // Update rotation based on scroll
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal scroll controls Y rotation
            rotateY += deltaX * 0.1;
        } else {
            // Vertical scroll controls X rotation
            rotateX -= deltaY * 0.1;
        }
        
        // Update cube rotation
        updateCubeRotation();
        
        // Prevent default scroll behavior
        event.preventDefault();
    }, { passive: false });
    
    // Add mouse drag support
    document.addEventListener('mousedown', (event) => {
        stopAutoRotation();
        
        isDragging = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
        // Custom cursor handles the cursor style change
        dragStartTime = Date.now();
        dragDistance = 0;
        
        // If clicking on a face, set its background
        const target = event.target.closest('.cube-face');
        if (target) {
            setBackgroundFromFace(target);
        }
        
        // Prevent default behavior
        event.preventDefault();
    });
    
    // Help popup functionality
    const helpBtn = document.getElementById('help-btn');
    const instructionsPopup = document.getElementById('instructions-popup');
    const closePopup = document.getElementById('close-popup');
    
    // Variable to track popup state
    let isPopupOpen = false;
    
    // Function to toggle instructions popup
    function toggleInstructions(e) {
        if (e) {
            e.stopPropagation(); // Prevent event bubbling
        }
        
        if (isPopupOpen) {
            // Close the popup
            instructionsPopup.classList.remove('active');
            isPopupOpen = false;
            resetInactivityTimer();
        } else {
            // Open the popup
            stopAutoRotation();
            instructionsPopup.classList.add('active');
            isPopupOpen = true;
        }
    }
    
    // Add click event to the button for toggling
    helpBtn.addEventListener('click', toggleInstructions);
    
    // Also add click event to the icon inside the button
    const helpIcon = helpBtn.querySelector('i');
    if (helpIcon) {
        helpIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling which might cause conflicts
            toggleInstructions();
        });
    }
    
    // Close button still works as before
    closePopup.addEventListener('click', () => {
        instructionsPopup.classList.remove('active');
        isPopupOpen = false;
        resetInactivityTimer();
    });
    
    // Close popup when clicking outside
    document.addEventListener('click', (event) => {
        if (event.target !== helpBtn && 
            !helpBtn.contains(event.target) &&
            !instructionsPopup.contains(event.target) && 
            instructionsPopup.classList.contains('active')) {
            instructionsPopup.classList.remove('active');
            isPopupOpen = false;
            resetInactivityTimer();
        }
    });
    
    // Cleanup when page is hidden/closed
    window.addEventListener('beforeunload', () => {
        if (autoRotateId) {
            clearInterval(autoRotateId);
        }
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
    });
    
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            // Calculate mouse movement since last position
            const deltaX = event.clientX - previousMouseX;
            const deltaY = event.clientY - previousMouseY;
            
            // Calculate drag distance
            dragDistance += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Update rotation based on mouse movement
            rotateY += deltaX * 0.5;
            rotateX -= deltaY * 0.5;
            
            // Update cube rotation
            updateCubeRotation();
            
            // Update previous mouse position
            previousMouseX = event.clientX;
            previousMouseY = event.clientY;
            
            // Prevent default behavior
            event.preventDefault();
        }
    });
    
    document.addEventListener('mouseup', (event) => {
        // Prevent accidental clicks if dragging
        const dragDuration = Date.now() - dragStartTime;
        const isSignificantDrag = dragDistance > 10; // Threshold for considering it a drag
        
        if (isSignificantDrag) {
            // If this was a significant drag, prevent the click
            event.stopPropagation();
            
            // Find and cancel any click events on cube faces
            const preventClicks = (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.removeEventListener('click', preventClicks, true);
            };
            
            // Add listener to capture and prevent the upcoming click
            document.addEventListener('click', preventClicks, true);
        }
        
        isDragging = false;

        // Reset inactivity timer to resume auto-rotation after timeout
        resetInactivityTimer();
    });
    
    document.addEventListener('mouseleave', () => {
        isDragging = false;

    });
    
    // Add touch support
    // Add touch support for pinch zoom
    let initialDistance = 0;
    let isZooming = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;
    
    function getDistance(touch1, touch2) {
        return Math.hypot(
            touch1.clientX - touch2.clientX,
            touch1.clientY - touch2.clientY
        );
    }
    
    window.addEventListener('touchstart', (event) => {
        stopAutoRotation();
        
        if (event.touches.length === 2) {
            // Pinch zoom
            isZooming = true;
            initialDistance = getDistance(event.touches[0], event.touches[1]);
            event.preventDefault();
        } else if (event.touches.length === 1) {
            // Check if we're touching a cube face
            const target = event.target.closest('.cube-face');
            if (target) {
                // Save the touched face
                lastTouchedFace = target;
                // Set the background from this face
                setBackgroundFromFace(target);
            } else if (lastTouchedFace && !isDragging) {
                // If touching outside faces and not dragging, reset background
                resetBackground();
                lastTouchedFace = null;
            }
            
            // Normal touch for rotation
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
            lastTouchX = touchStartX;
            lastTouchY = touchStartY;
        }
    }, { passive: false });
    
    window.addEventListener('touchmove', (event) => {
        if (isZooming && event.touches.length === 2) {
            // Handle pinch zoom
            const currentDistance = getDistance(event.touches[0], event.touches[1]);
            const delta = currentDistance - initialDistance;
            
            // Check if mobile device (screen width < 768px)
            if (window.innerWidth < 768) {
                scale += delta * 0.01;
                
                // Constrain zoom level
                scale = Math.max(0.5, Math.min(scale, 2.0));
                
                updateCubeRotation();
                initialDistance = currentDistance;
            }
            
            event.preventDefault();
        } else if (event.touches.length === 1) {
            // Normal touch movement for rotation
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;
            
            const deltaX = touchX - lastTouchX;
            const deltaY = touchY - lastTouchY;
            
            rotateY += deltaX * 0.5;
            rotateX -= deltaY * 0.5;
            
            updateCubeRotation();
            
            lastTouchX = touchX;
            lastTouchY = touchY;
            
            event.preventDefault();
        }
    }, { passive: false });
    
    window.addEventListener('touchend', (event) => {
        if (event.touches.length < 2) {
            isZooming = false;
            
            // Don't reset background on touch end to keep it visible
            // Only reset inactivity timer
            resetInactivityTimer();
        }
    });
    
    // Function to update cube rotation
    function updateCubeRotation() {
        cube.style.transform = `scale3d(${scale}, ${scale}, ${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // Auto-rotation functions
    function startAutoRotation() {
        if (!autoRotateId) {
            isAutoRotating = true;
            cube.classList.add('auto-rotating'); // ADD THIS LINE
            autoRotateId = setInterval(() => {
                if (isAutoRotating) {
                    rotateY += 0.3; // Speed of rotation
                    updateCubeRotation();
                }
            }, 16); // ~60fps
        }
    }
    
    function stopAutoRotation() {
        isAutoRotating = false;
        if (autoRotateId) {                    // ADD THIS
            clearInterval(autoRotateId);       // ADD THIS  
            autoRotateId = null;               // ADD THIS
        }                                      // ADD THIS
        cube.classList.remove('auto-rotating');
        resetInactivityTimer();
    }
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (!isDragging) {
              startAutoRotation();
            }
        }, inactivityTimeout);
    }
    
    // Function to detect which face is most visible
    function getMostVisibleFace() {
        const faces = document.querySelectorAll('.cube-face');
        let maxVisibility = -1;
        let mostVisibleFace = null;
        
        faces.forEach(face => {
            const matrix = window.getComputedStyle(face).transform;
            // Extract the z-translation from the matrix
            const values = matrix.split('(')[1].split(')')[0].split(',');
            const zValue = values[14] || values[11]; // 3D or 2D matrix
            
            if (zValue > maxVisibility) {
                maxVisibility = zValue;
                mostVisibleFace = face;
            }
        });
        
        return mostVisibleFace;
    }
    
    // Navigation buttons control
    const upBtn = document.getElementById('up-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const downBtn = document.getElementById('down-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Set rotation amount for each button press
    const rotationAmount = 45;
    
    upBtn.addEventListener('click', () => {
        rotateX += rotationAmount;
        updateCubeRotation();
    });
    
    downBtn.addEventListener('click', () => {
        rotateX -= rotationAmount;
        updateCubeRotation();
    });
    
    leftBtn.addEventListener('click', () => {
        rotateY -= rotationAmount;
        updateCubeRotation();
    });
    
    rightBtn.addEventListener('click', () => {
        rotateY += rotationAmount;
        updateCubeRotation();
    });
    
    resetBtn.addEventListener('click', () => {
        // Reset to 3D view like screenshot
        rotateX = -20;
        rotateY = -35;
        scale = 1.0;
        updateCubeRotation();
    });
    
    // Zoom buttons
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    
    zoomInBtn.addEventListener('click', () => {
        scale += 0.1;
        // Limit max zoom
        scale = Math.min(scale, 2.0);
        updateCubeRotation();
    });
    
    zoomOutBtn.addEventListener('click', () => {
        scale -= 0.1;
        // Limit min zoom
        scale = Math.max(scale, 0.5);
        updateCubeRotation();
    });
    
    // Add unbox functionality with SVG state changes
    const unboxBtn = document.getElementById('unbox-btn');
    let isUnboxed = false;
    
    // Define the two SVG states with individual element classes
    const boxedSVG = `
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" class="boxed-state">
            <!-- Larger gaps version -->
            <path d="M12 8h24" stroke-linecap="round" class="top-line"/>
            <path d="M20 16l4-4 4 4" stroke-linecap="round" stroke-linejoin="round" class="top-flap"/>
            
            <path d="M8 12v24" stroke-linecap="round" class="left-line"/>
            <path d="M16 20l-4 4 4 4" stroke-linecap="round" stroke-linejoin="round" class="left-flap"/>
            
            <path d="M40 12v24" stroke-linecap="round" class="right-line"/>
            <path d="M32 20l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" class="right-flap"/>
            
            <path d="M12 40h24" stroke-linecap="round" class="bottom-line"/>
            <path d="M20 32l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" class="bottom-flap"/>
        </svg>
    `;
    
    const unboxedSVG = `
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" class="unboxed-state">
            <!-- Unboxed state with smaller chevrons (same size as boxedSVG) -->
            <!-- Top chevron pointing down (smaller arms) -->
            <path d="M20 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" class="top-chevron"/>
            
            <!-- Left chevron pointing right (smaller arms) -->
            <path d="M4 20l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" class="left-chevron"/>
            
            <!-- Right chevron pointing left (smaller arms) -->
            <path d="M44 20l-4 4 4 4" stroke-linecap="round" stroke-linejoin="round" class="right-chevron"/>
            
            <!-- Center box (stationary) -->
            <rect x="19" y="19" width="10" height="10" stroke="currentColor" fill="none" class="center-box"/>
            
            <!-- Bottom chevron pointing up (smaller arms) -->
            <path d="M20 44l4-4 4 4" stroke-linecap="round" stroke-linejoin="round" class="bottom-chevron"/>
        </svg>
    `;
    
    unboxBtn.addEventListener('click', () => {
        // Toggle unboxed state
        isUnboxed = !isUnboxed;
        
        // Apply or remove unboxed class and update SVG
        if (isUnboxed) {
            cube.classList.add('unboxed');
            unboxBtn.innerHTML = unboxedSVG; // Change to unboxed SVG
        } else {
            cube.classList.remove('unboxed');
            unboxBtn.innerHTML = boxedSVG; // Change back to boxed SVG
        }
        
        // Stop auto-rotation when unboxing
        if (isUnboxed) {
            stopAutoRotation();
        }
    });
    
    // Background image change functionality with smooth opacity transition
    // BACKGROUND IMAGE TRANSITION SETTINGS:
    // This function controls the background transition when hovering over cube faces
    function setBackgroundFromFace(face) {
        // Find the image or video within the face
        const img = face.querySelector('img');
        const video = face.querySelector('video');
        let imageUrl = '';
        
        // Get image URL from face
        if (img) {
            // BACKGROUND IMAGE: Uses the same image from the cube face
            imageUrl = img.src;
        } else if (video) {
            // For video face, create a canvas to capture the current frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 400;
            canvas.height = video.videoHeight || 400;
            const ctx = canvas.getContext('2d');
            
            // Draw the current video frame on the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // BACKGROUND IMAGE: Uses a snapshot of the video
            imageUrl = canvas.toDataURL('image/png');
        }
        
        if (imageUrl) {
            // Get the background image element
            const bgImage = document.getElementById('bg-image');
            
            // Set the new background image
            bgImage.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imageUrl}')`;
            
            // Trigger a reflow to ensure transition works
            void bgImage.offsetWidth;
            
            // Fade in the background
            bgImage.style.opacity = '1';
            
            currentlyHoveredFace = face;
        }
    }
    
    // Function to reset background with smooth fade-out
    function resetBackground() {
        // Get the background image element
        const bgImage = document.getElementById('bg-image');
        
        // Fade out the background
        bgImage.style.opacity = '0';
        
        currentlyHoveredFace = null;
    }
    
    // Add hover and touch events to all cube faces
    cubeFaces.forEach(face => {
        // DESKTOP: Mouse hover events
        face.addEventListener('mouseenter', () => {
            setBackgroundFromFace(face);
        });
        
        face.addEventListener('mouseleave', () => {
            // Only clear background if we're not dragging this face
            if (!isDragging || currentlyHoveredFace !== face) {
                resetBackground();
            }
        });
    });
    
    // Popup Menu Functionality
//    const menuBtn = document.getElementById('menu-btn');
//    const popupMenu = document.getElementById('popup-menu');
//    const menuClose = document.getElementById('menu-close');
    
//    menuBtn.addEventListener('click', () => {
//        popupMenu.classList.add('active');
//    });
    
//    menuClose.addEventListener('click', () => {
//        popupMenu.classList.remove('active');
//    });
    
    // Close menu when clicking outside menu links
//    popupMenu.addEventListener('click', (e) => {
//        if (e.target === popupMenu) {
//            popupMenu.classList.remove('active');
//        }
//    });
});
