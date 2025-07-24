/**
 * Media Unboxx Cube Transition - Main JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if we're coming from a page transition
    if (document.body.classList.contains('page-transition')) {
        // Remove the transition class immediately
        document.body.classList.remove('page-transition');
    }
    
    // Handle browser back/forward navigation - Simplified for non-menu code
    window.addEventListener('pageshow', function(event) {
        // If the page is being restored from the bfcache (back/forward navigation)
        if (event.persisted) {
            // Remove the transition class
            document.body.classList.remove('page-transition');
            // Ensure the body is visible
            document.body.style.opacity = '1';
        }
    });
    
    // Initialize variables
    const servicecubeContainer = document.getElementById('servicecube-container');
    const navDots = document.querySelectorAll('.nav-dot');
    const section2 = document.getElementById('section2');
    const section2Title = document.getElementById('section2-title');
    const section2Text = document.getElementById('section2-text');
    const buttonContainer = document.getElementById('button-container');
    const buttonContainerSection4 = document.getElementById('button-container-section4');
    
    // Handle navigation arrow clicks
    const navArrowUp = document.getElementById('nav-arrow-up');
    const navArrowDown = document.getElementById('nav-arrow-down');
    
    // Touch and scroll variables
    let currentSection = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0; // Added for horizontal detection
    let touchStartTarget = null;
    
    // Detect if we're on a small screen (like iPhone SE - use 700, for S24 use 850)
    function isSmallScreen() {
        return window.innerHeight < 700;
    }
    
    // Helper function to check if the menu is active - Kept for use in other parts
    function isMenuActive() {
        const popupMenu = document.getElementById('popup-menu');
        return popupMenu && popupMenu.classList.contains('active');
    }
    
    // Set up navigation arrow event listeners (only once)
    if (navArrowUp) {
        navArrowUp.addEventListener('click', function() {
            if (isScrolling || currentSection === 0) return;
            
            isScrolling = true;
            currentSection--;
            updateCube();
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
    }
    
    if (navArrowDown) {
        navArrowDown.addEventListener('click', function() {
            if (isScrolling || currentSection === 3) return;
            
            isScrolling = true;
            currentSection++;
            updateCube();
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
    }
    
    // Helper function to get appropriate buttons and data for current page
    function getButtonsForCurrentPath() {
        // Get the current URL path
        const currentPath = window.location.pathname;
        
        // Check specific paths in a clear priority order
        if (currentPath.includes('/event-planning-pr')) {
            return {
                buttons: [
                    document.getElementById('button1EP'),
                    document.getElementById('button2EP'),
                    document.getElementById('button3EP'),
                    document.getElementById('button4EP')
                ],
                buttonsData: [
                    { id: 'button1EP', background: "url('/images/Passion-Oolong-Fizz-6-cans-1.jpg')", text: "Event Planning Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here." },
                    { id: 'button2EP', background: "url('/images/Peachy-Oolong-Picnic.jpg')", text: "Event Planning  Expertise 2 description here. Expertise 2 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here.." },
                    { id: 'button3EP', background: "url('/images/Sake-Tea-Brew.png')", text: "Event Planning Expertise 3 description here. Expertise 3 description here. Expertise 3 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here..." },
                    { id: 'button4EP', background: "url('/images/Sake-Tea-Brew.png')", text: "Event Planning Expertise 4 description here. Expertise 3 description here. Expertise 3 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here..." }
                ],
                defaultButtonId: 'button1EP',
                
                // Section 4 buttons configuration 
                buttonsSection4: [
                    document.getElementById('button1S4'),
                    document.getElementById('button2S4'),
                    document.getElementById('button3S4'),
                    document.getElementById('button4S4')
                ],
                buttonsDataSection4: [
                    { id: 'button1S4', background: "url('/images/Passion-Oolong-Fizz-6-cans-1.jpg')", text: "Comprehensive review of your events and PR strategies to identify opportunities for improvement." },
                    { id: 'button2S4', background: "url('/images/Peachy-Oolong-Picnic.jpg')", text: "Customized event planning roadmaps to maximize impact and deliver memorable experiences." },
                    { id: 'button3S4', background: "url('/images/Sake-Tea-Brew.png')", text: "Innovative PR techniques to amplify your message and reach your target audience effectively." },
                    { id: 'button4S4', background: "url('/images/Sake-Tea-Brew.png')", text: "Complete event planning and PR package handling everything from concept to execution." }
                ],
                defaultButtonIdSection4: 'button1S4'
            };
        }
        else if (currentPath.includes('/website-design-development')) {
            return {
                buttons: [
                    document.getElementById('button1WD'),
                    document.getElementById('button2WD'),
                    document.getElementById('button3WD'),
                    document.getElementById('button4WD')
                ],
                buttonsData: [
                    { id: 'button1WD', background: "url('/images/Passion-Oolong-Fizz-6-cans-1.jpg')", text: "Website Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here." },
                    { id: 'button2WD', background: "url('/images/Peachy-Oolong-Picnic.jpg')", text: "EWebsite  Expertise 2 description here. Expertise 2 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here.." },
                    { id: 'button3WD', background: "url('/images/Sake-Tea-Brew.png')", text: "Website Expertise 3 description here. Expertise 3 description here. Expertise 3 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here..." },
                    { id: 'button4WD', background: "url('/images/Sake-Tea-Brew.png')", text: "Website Expertise 4 description here. Expertise 3 description here. Expertise 3 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here. Expertise 1 description here..." }
                ],
                defaultButtonId: 'button1WD',
                
                // Section 4 buttons configuration 
                buttonsSection4: [
                    document.getElementById('button1S4'),
                    document.getElementById('button2S4'),
                    document.getElementById('button3S4'),
                    document.getElementById('button4S4')
                ],
                buttonsDataSection4: [
                    { id: 'button1S4', background: "url('/images/Passion-Oolong-Fizz-6-cans-1.jpg')", text: "Comprehensive website audit to identify UX/UI improvements, performance issues, and conversion opportunities." },
                    { id: 'button2S4', background: "url('/images/Peachy-Oolong-Picnic.jpg')", text: "Custom website development roadmap tailored to your business goals and audience needs." },
                    { id: 'button3S4', background: "url('/images/Sake-Tea-Brew.png')", text: "Results-driven website optimization strategies to boost traffic, engagement, and conversions." },
                    { id: 'button4S4', background: "url('/images/Sake-Tea-Brew.png')", text: "End-to-end website solution from design to development, maintenance, and ongoing optimization." }
                ],
                defaultButtonIdSection4: 'button1S4'
            };
        } 
        else if (currentPath.includes('/ads-management')) {
            return {
                buttons: [
                    document.getElementById('button1PS'),
                    document.getElementById('button2PS'),
                    document.getElementById('button3PS'),
                    document.getElementById('button4PS')
                ],
                buttonsData: [
                    { id: 'button1PS', background: "url('images/ads-management-google-ads.webp')", text: "Our Google Ads specialists optimize search campaigns, shopping ads, and display advertising for maximum ROI. We eliminate wasted spend on irrelevant keywords and focus budget on searches that convert into customers." },
                    { id: 'button2PS', background: "url('images/ads-management-meta-ads.webp')", text: "Our Meta Ads experts create and manage Facebook and Instagram campaigns that reach your ideal customers. From awareness to conversion, we build advertising funnels that turn social media users into loyal customers." },
                    { id: 'button3PS', background: "url('images/ads-management-tiktok-ads.webp')", text: "We manage TikTok advertising campaigns that capture attention and drive action. Our creative-first approach ensures your ads feel native to the platform while delivering measurable business results." },
                    { id: 'button4PS', background: "url('images/ads-management-analytics.webp')", text: "Our ads management includes comprehensive tracking, A/B testing, and continuous optimization. Get detailed reports that show exactly how your ad spend translates into leads, sales, and business growth." }
                ],
                defaultButtonId: 'button1PS',
                
                // Section 4 buttons configuration 
                buttonsSection4: [
                    document.getElementById('button1S4'),
                    document.getElementById('button2S4'),
                    document.getElementById('button3S4'),
                    document.getElementById('button4S4')
                ],
                buttonsDataSection4: [
                    { id: 'button1S4', background: "url('/images/Passion-Oolong-Fizz-6-cans-1.jpg')", text: "Deep performance analysis to uncover what's working, what's not, and where opportunities lie." },
                    { id: 'button2S4', background: "url('/images/Peachy-Oolong-Picnic.jpg')", text: "Custom performance strategy development based on your unique business goals and KPIs." },
                    { id: 'button3S4', background: "url('/images/Sake-Tea-Brew.png')", text: "Accelerated growth tactics to maximize ROI and outperform competitors in your space." },
                    { id: 'button4S4', background: "url('/images/Sake-Tea-Brew.png')", text: "Complete performance management package including analysis, strategy, implementation, and reporting." }
                ],
                defaultButtonIdSection4: 'button1S4'
            };
        }
        else if (currentPath.includes('/media-production')) {
            return {
                buttons: [
                    document.getElementById('button1MP'),
                    document.getElementById('button2MP'),
                    document.getElementById('button3MP'),
                    document.getElementById('button4MP')
                ],
                buttonsData: [
                    { id: 'button1MP', background: "url('/images/Media Production Videography.webp')", text: "Our team creates compelling corporate videos, product demonstrations, and brand stories that capture viewers' attention. We transform complex messaging into visual narratives that resonate with your target audience and drive measurable results." },
                    { id: 'button2MP', background: "url('/images/Media Production Photography.webp')", text: "Our commercial photography services deliver high-impact visuals for both digital and print media. From product photography to social media content, we create images that communicate your brand's value and professionalism instantly." },
                    { id: 'button3MP', background: "url('/images/Media Production Animation.webp')", text: "Our animation services simplify complex concepts through engaging motion graphics and explainer videos. Transform technical information into digestible content that educates customers and accelerates decision-making." },
                    { id: 'button4MP', background: "url('/images/Media Product Live Event Coverage.webp')", text: "Comprehensive event coverage that extends your reach beyond the venue. Our live event production captures keynote moments, networking highlights, and brand activations. Turn single-day events into months of content marketing material that amplifies your investment." }
                ],
                defaultButtonId: 'button1MP',
                
                // Section 4 buttons configuration 
                buttonsSection4: [
                    document.getElementById('button1S4'),
                    document.getElementById('button2S4'),
                    document.getElementById('button3S4'),
                    document.getElementById('button4S4')
                ],
                buttonsDataSection4: [
                    { id: 'button1S4', background: "url('/images/Media Product CTA Image.webp')", text: "Get in Touch." },
                    { id: 'button2S4', background: "url('/images/Media Product CTA Image.webp')", text: "Get in Touch." },
                    { id: 'button3S4', background: "url('/images/Media Product CTA Image.webp')", text: "Get in Touch." },
                    { id: 'button4S4', background: "url('/images/Media Product CTA Image.webp')", text: "Get in Touch." }
                ],
                defaultButtonIdSection4: 'button1S4'
            };
        } 
        else if (currentPath.includes('/influencer-marketing')) {
            return {
                buttons: [
                    document.getElementById('button1IM'),
                    document.getElementById('button2IM'),
                    document.getElementById('button3IM'),
                    document.getElementById('button4IM')
                ],
                buttonsData: [
                    { id: 'button1IM', background: "url('images/influencer-marketing-micro-influencer.webp')", text: "We connect you with micro-influencers who have highly engaged, niche audiences in Singapore, Malaysia, and Thailand. Get better conversion rates at lower costs." },
                    { id: 'button2IM', background: "url('images/influencer-marketing-collab-ugc.webp')", text: "Our influencer partnerships create authentic user-generated content that builds trust and social proof. Transform customer advocacy into a content marketing machine that sells for you 24/7." },
                    { id: 'button3IM', background: "url('images/influencer-marketing-campaign-strategy.webp')", text: "Our team identifies content creators who align with your brand values and target audience. We manage end-to-end campaigns that generate authentic engagement and measurable business results, not just pretty posts." },
                    { id: 'button4IM', background: "url('#')", text: "blank" }
                ],
                defaultButtonId: 'button1IM',
                
                // Section 4 buttons configuration 
                buttonsSection4: [
                    document.getElementById('button1S4'),
                    document.getElementById('button2S4'),
                    document.getElementById('button3S4'),
                    document.getElementById('button4S4')
                ],
                buttonsDataSection4: [
                    { id: 'button1S4', background: "url('/images/Passion-Oolong-Fizz-6-cans-1.jpg')", text: "Thorough assessment of your influencer marketing needs and identification of the right partners." },
                    { id: 'button2S4', background: "url('/images/Peachy-Oolong-Picnic.jpg')", text: "Strategic influencer campaign development to maximize reach, engagement, and conversion." },
                    { id: 'button3S4', background: "url('/images/Sake-Tea-Brew.png')", text: "Advanced influencer relationship building and campaign optimization for exceptional results." },
                    { id: 'button4S4', background: "url('/images/Sake-Tea-Brew.png')", text: "End-to-end influencer marketing management from strategy to execution and performance analysis." }
                ],
                defaultButtonIdSection4: 'button1S4'
            };
        }
        else {
            // Default to social media buttons for all other paths (including '/social-media')
            return {
                buttons: [
                    document.getElementById('button1'),
                    document.getElementById('button2'),
                    document.getElementById('button3'),
                    document.getElementById('button4')
                ],
                buttonsData: [
                    { id: 'button1', background: "url('/images/Social Media - Content Creation Landscape.webp')", text: "Thumb-stopping visuals and captions that make people slow their scroll and hit share. We craft the kind of content that sparks conversations and gets remembered long after the latest trend fades." },
                    { id: 'button2', background: "url('/images/social media - strategy planning.webp')", text: "Data-driven approaches customized to your unique audience, not generic templates. We dig deep into analytics to build roadmaps that evolve with your business goals and outpace your competition." },
                    { id: 'button3', background: "url('/images/social media - platform mastery.webp')", text: "From TikTok trends to LinkedIn thought leadership, we speak the native language of every platform. We stay ahead of algorithm changes and emerging platforms so you're never caught playing catch-up." },
                    { id: 'button4', background: "url('/images/social media - analytics.webp')", text: "Beyond vanity metrics to actual results that impact your bottom line. We translate likes and shares into concrete business outcomes, tracking the journey from casual viewer to loyal customer." }
                ],
                defaultButtonId: 'button1',
                
                // Section 4 buttons configuration 
                buttonsSection4: [
                    document.getElementById('button1S4'),
                    document.getElementById('button2S4'),
                    document.getElementById('button3S4'),
                    document.getElementById('button4S4')
                ],
                buttonsDataSection4: [
                    { id: 'button1S4', background: "url('/images/Passion-Oolong-Fizz-6-cans-1.jpg')", text: "Comprehensive review of your current social media presence, competitor analysis, and performance metrics to identify growth opportunities." },
                    { id: 'button2S4', background: "url('/images/Peachy-Oolong-Picnic.jpg')", text: "Tailored roadmaps and content calendars to achieve your business goals through social media, from brand awareness to lead generation." },
                    { id: 'button3S4', background: "url('/images/Sake-Tea-Brew.png')", text: "Accelerated follower and engagement growth through optimization strategies, trend leveraging, and tactical content deployment." },
                    { id: 'button4S4', background: "url('/images/Sake-Tea-Brew.png')", text: "End-to-end social media management, from strategy to execution, analytics to optimization, giving you a worry-free solution." }
                ],
                defaultButtonIdSection4: 'button1S4'
            };
        }
    }

    // Function to set active button for section 2
    function setActiveButton(activeButton) {
        const { buttons } = getButtonsForCurrentPath();
        
        // Remove active class from all buttons
        buttons.forEach(button => {
            if (button) {
                button.classList.remove('active-button');
                button.classList.remove('button-glow');
                button.style.backgroundColor = 'white';
                button.style.color = '#141d26';
            }
        });
        
        // Add active class to clicked button
        if (activeButton) {
            activeButton.classList.add('active-button');
            activeButton.classList.add('button-glow'); // Add glow to active button
            activeButton.style.backgroundColor = '#141d26';
            activeButton.style.color = '#ffffff';
        }
    }

    // Function to set active button for section 4
    function setActiveButtonSection4(activeButton) {
        const { buttonsSection4 } = getButtonsForCurrentPath();
        
        // Remove active class from all buttons
        buttonsSection4.forEach(button => {
            if (button) {
                button.classList.remove('active-button');
                button.classList.remove('button-glow');
                button.style.backgroundColor = 'white';
                button.style.color = '#141d26';
            }
        });
        
        // Add active class to clicked button
        if (activeButton) {
            activeButton.classList.add('active-button');
            activeButton.classList.add('button-glow'); // Add glow to active button
            activeButton.style.backgroundColor = '#141d26';
            activeButton.style.color = '#ffffff';
        }
    }

    // Function to get active button data for section 2
    function getActiveButtonData() {
        const { buttonsData } = getButtonsForCurrentPath();
        const activeButton = document.querySelector('#button-container .active-button');
        
        if (activeButton) {
            return buttonsData.find(btn => btn.id === activeButton.id);
        }
        return buttonsData[0]; // Default to first button if none active
    }

    // Function to get active button data for section 4
    function getActiveButtonDataSection4() {
        const { buttonsDataSection4 } = getButtonsForCurrentPath();
        const activeButton = document.querySelector('#button-container-section4 .active-button');
        
        if (activeButton) {
            return buttonsDataSection4.find(btn => btn.id === activeButton.id);
        }
        return buttonsDataSection4[0]; // Default to first button if none active
    }

    // Function to initialize buttons based on current page
    function initializePageButtons() {
        const { defaultButtonId, defaultButtonIdSection4 } = getButtonsForCurrentPath();
        
        // Initialize section 2 buttons
        const defaultButton = document.getElementById(defaultButtonId);
        if (defaultButton) {
            setActiveButton(defaultButton);
            
            // Set initial background and text for section2
            const initialButtonData = getButtonsForCurrentPath().buttonsData.find(btn => btn.id === defaultButtonId);
            if (initialButtonData) {
                section2.style.backgroundImage = initialButtonData.background;
                section2Text.textContent = initialButtonData.text;
            }
        }
        
        // Initialize section 4 buttons
        const defaultButtonSection4 = document.getElementById(defaultButtonIdSection4);
        if (defaultButtonSection4) {
            setActiveButtonSection4(defaultButtonSection4);
        }
    }

    // Add event listeners to all buttons for current page - Section 2
    const { buttonsData } = getButtonsForCurrentPath();
    
    buttonsData.forEach(buttonData => {
        const button = document.getElementById(buttonData.id);
        if (button) {
            // Mouse enter - Preview this button's content
            button.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active-button')) {
                    this.style.backgroundColor = '#243447';
                    this.style.color = 'white';
                    // Add glowing effect on hover
                    this.classList.add('button-glow');
                    // Preview background and text on hover
                    section2.style.backgroundImage = buttonData.background;
                    section2Text.textContent = buttonData.text;
                }
            });
            
            // Mouse leave - Restore active button's content
            button.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active-button')) {
                    this.style.backgroundColor = 'white';
                    this.style.color = '#141d26';
                    // Remove glowing effect when not hovering
                    this.classList.remove('button-glow');
                    // Restore active button's background and text
                    const activeData = getActiveButtonData();
                    section2.style.backgroundImage = activeData.background;
                    section2Text.textContent = activeData.text;
                }
            });
            
            // Click - Set this button as active
            button.addEventListener('click', function(e) {
                e.preventDefault();
                setActiveButton(this);
                section2.style.backgroundImage = buttonData.background;
                section2Text.textContent = buttonData.text;
                
                    // If href is not # or empty, navigate after a short delay
                    const href = this.getAttribute('href');
                    const target = this.getAttribute('target');
                    
                    if (href && href !== '#') {
                        setTimeout(() => {
                            if (target === '_blank') {
                                window.open(href, '_blank', 'noopener,noreferrer');
                            } else {
                                window.location.href = href;
                            }
                        }, 800); // 800 ms delay to show the effect
                    }
                
            });
        }
    });

    // Add event listeners to all section 4 buttons
    const { buttonsDataSection4 } = getButtonsForCurrentPath();
    
    if (buttonsDataSection4) {
        buttonsDataSection4.forEach(buttonData => {
            const button = document.getElementById(buttonData.id);
            if (button) {
                // Mouse enter - Preview effects
                button.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('active-button')) {
                        this.style.backgroundColor = '#243447';
                        this.style.color = 'white';
                        // Add glowing effect on hover
                        this.classList.add('button-glow');
                    }
                });
                
                // Mouse leave - Reset effects
                button.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('active-button')) {
                        this.style.backgroundColor = 'white';
                        this.style.color = '#141d26';
                        // Remove glowing effect when not hovering
                        this.classList.remove('button-glow');
                    }
                });
                
                // Click - Set this button as active
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    setActiveButtonSection4(this);
                    
                    // If href is not # or empty, navigate after a short delay
                    const href = this.getAttribute('href');
                    const target = this.getAttribute('target');
                    
                    if (href && href !== '#') {
                        setTimeout(() => {
                            if (target === '_blank') {
                                window.open(href, '_blank', 'noopener,noreferrer');
                            } else {
                                window.location.href = href;
                            }
                        }, 800); // 800 ms delay to show the effect
                    }
                });
            }
        });
    }
    
    // Function to set the appropriate video source based on screen size and orientation
    function setAppropriateVideoSource() {
        const videoElement = document.getElementById('modal-video');
        const isMobilePortrait = window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches;
        
        // Get the appropriate source element
        const landscapeSource = document.querySelector('.landscape-video');
        const portraitSource = document.querySelector('.portrait-video');
        
        if (isMobilePortrait && portraitSource && portraitSource.getAttribute('src')) {
            // Use portrait video for mobile portrait mode
            videoElement.src = portraitSource.getAttribute('src');
        } else if (landscapeSource && landscapeSource.getAttribute('src')) {
            // Use landscape video for all other cases
            videoElement.src = landscapeSource.getAttribute('src');
        }
        
        // Load the new source
        videoElement.load();
    }
    
    // Modified video modal functionality
    const videoModal = document.getElementById('video-modal');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (videoOverlay && videoModal) {
        videoOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Set the appropriate video source before showing the modal
            setAppropriateVideoSource();
            
            // Show the modal
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        window.closeVideoModal = function() {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Pause the video when modal is closed
            const modalVideo = document.getElementById('modal-video');
            if (modalVideo) {
                modalVideo.pause();
            }
        };
        
        // Close modal when clicking outside the video
        videoModal.addEventListener('click', function(e) {
            if (e.target === this) closeVideoModal();
        });
        
        // Close modal on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });
        
        // Update video source when orientation changes
        window.addEventListener('resize', function() {
            if (videoModal.classList.contains('active')) {
                setAppropriateVideoSource();
            }
        });
    }
    
    // Update the cube rotation
    function updateCube() {
        servicecubeContainer.style.transform = `translateZ(-50vh) rotateX(${currentSection * 90}deg)`;
        
        // Update active nav dot
        navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSection);
        });
        
        // Show/hide buttons based on section
        if (currentSection === 1) {
            // Section 2 buttons
            if (buttonContainer) {
                setTimeout(() => {
                    buttonContainer.style.display = 'flex';
                    // Reset animation
                    buttonContainer.style.animation = 'none';
                    setTimeout(() => {
                        buttonContainer.style.animation = 'fadeIn 0.6s ease-out 0.8s forwards';
                    }, 10);
                }, 10);
            }
            
            // Hide section 4 buttons
            if (buttonContainerSection4) buttonContainerSection4.style.display = 'none';
            
        } else if (currentSection === 3) {
            // Section 4
            if (buttonContainer) buttonContainer.style.display = 'none';
            
            // Show section 4 buttons
            if (buttonContainerSection4) {
                setTimeout(() => {
                    buttonContainerSection4.style.display = 'flex';
                    // Reset animation
                    buttonContainerSection4.style.animation = 'none';
                    setTimeout(() => {
                        buttonContainerSection4.style.animation = 'fadeIn 0.6s ease-out 0.8s forwards';
                    }, 10);
                }, 10);
            }
            
        } else {
            // Hide all buttons for other sections
            if (buttonContainer) buttonContainer.style.display = 'none';
            if (buttonContainerSection4) buttonContainerSection4.style.display = 'none';
        }
    }

    // Handle keyboard navigation
    window.addEventListener('keydown', function(event) {
        if (isScrolling || isMenuActive()) return;
        
        if ((event.key === 'ArrowDown' || event.key === 'PageDown') && currentSection < 3) {
            isScrolling = true;
            currentSection++;
            updateCube();
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        } else if ((event.key === 'ArrowUp' || event.key === 'PageUp') && currentSection > 0) {
            isScrolling = true;
            currentSection--;
            updateCube();
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    });

    // Handle nav dot clicks
    navDots.forEach(dot => {
        dot.addEventListener('click', function() {
            if (isScrolling || isMenuActive()) return;
            
            isScrolling = true;
            currentSection = parseInt(this.getAttribute('data-section'));
            updateCube();
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
    });
    
    // Force proper initial scaling
    document.body.style.opacity = '0';
    setTimeout(() => {
        // Initialize page buttons FIRST, before any visual updates
        initializePageButtons();
        // Then update cube and other visual elements
        updateCube();
        // Force recalculation of text sizing
        const h1El = document.querySelector('h1');
        const pEls = document.querySelectorAll('p');
        
        if (h1El) {
            const computedStyle = window.getComputedStyle(h1El);
            h1El.style.fontSize = computedStyle.fontSize;
            setTimeout(() => h1El.style.fontSize = '', 50);
        }
        
        pEls.forEach(p => {
            const computedStyle = window.getComputedStyle(p);
            p.style.fontSize = computedStyle.fontSize;
            setTimeout(() => p.style.fontSize = '', 50);
        });
        // Only show content after initial animation completes
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }, 100);
    
    // CLEAN IMPLEMENTATION OF WHEEL AND TOUCH HANDLERS
    // ------------------------------------------------
    
    // 1. Mouse wheel handler for cube rotation
    window.addEventListener('wheel', function(event) {
        // Don't do anything if the menu is active or on small screens
        if (isMenuActive() || isScrolling) return;
        
        // For small screens, limit when wheel events trigger cube rotation
        if (isSmallScreen()) {
            // Only trigger cube rotation when at the top or bottom of the page
            const isAtTop = document.documentElement.scrollTop <= 5 || document.body.scrollTop <= 5;
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10;
            
            if (!isAtTop && !isAtBottom) {
                return; // Allow normal scrolling in the middle of the page
            }
        }
        
        // Determine scroll direction
        isScrolling = true;
        if (event.deltaY > 0 && currentSection < 3) {
            // Scrolling down - go to next section
            currentSection++;
        } else if (event.deltaY < 0 && currentSection > 0) {
            // Scrolling up - go to previous section
            currentSection--;
        }
        
        updateCube();
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }, { passive: true });
    
    // 2. Touch handlers for cube rotation
    window.addEventListener('touchstart', function(event) {
        // Store the touch start position (both X and Y)
        touchStartY = event.touches[0].clientY;
        touchStartX = event.touches[0].clientX;
        touchStartTarget = event.target;
        
        // For iOS Safari to prevent rubber banding (only on larger screens)
        if (!isSmallScreen() && !isMenuActive()) {
            if (document.documentElement.scrollTop === 0) {
                document.documentElement.scrollTop = 1;
            }
        }
    }, { passive: true });
    
    // Prevent pull-to-refresh on non-small screens
    document.addEventListener('touchmove', function(e) {
        // On small screens, allow natural scrolling
        if (isSmallScreen()) {
            // Only prevent default for horizontal swipes that would navigate history
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            const isVerticalSwipe = Math.abs(deltaY) > Math.abs(e.touches[0].clientX - touchStartX);
            
            // Let vertical swipes proceed naturally
            if (isVerticalSwipe) {
                return;
            }
        } 
        // On larger screens, prevent pull-to-refresh except in scrollable areas
        else if (!isMenuActive()) {
            // Check if we should allow scrolling in a specific element
            let isInScrollableElement = false;
            let element = e.target;
            
            // Check if the touch is happening in an element that should scroll
            while (element && element !== document.body) {
                // Add any elements that should be scrollable here
                if (element.classList && 
                    (element.classList.contains('menu-links') || 
                     element.classList.contains('scrollable'))) {
                    isInScrollableElement = true;
                    break;
                }
                element = element.parentElement;
            }
            
            // If not in a scrollable element, prevent the default behavior
            if (!isInScrollableElement) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    window.addEventListener('touchend', function(event) {
        // Don't do anything if the menu is active or we're already scrolling
        if (isMenuActive() || isScrolling) return;
        
        // Check if the touch is on the main content (not inside menu)
        const menuLinksElement = document.querySelector('.menu-links');
        if (menuLinksElement && 
            (touchStartTarget === menuLinksElement || menuLinksElement.contains(touchStartTarget))) {
            return;
        }
        
        // Calculate swipe distance
        touchEndY = event.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        // For small screens, don't activate cube navigation if the user is scrolling naturally
        if (isSmallScreen()) {
            // Only process if the user is not scrolling the page content
            const isAtTop = document.documentElement.scrollTop <= 5 || document.body.scrollTop <= 5;
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10;
            
            // Don't trigger cube rotation during normal page scrolling unless at edges
            if (!isAtTop && !isAtBottom && Math.abs(deltaY) > 50) {
                return;
            }
        }
        
        // Only process if the swipe is significant enough
        if (Math.abs(deltaY) > 50) {
            isScrolling = true;
            
            if (deltaY > 0 && currentSection < 3) {
                // Swipe up - go to next section
                currentSection++;
            } else if (deltaY < 0 && currentSection > 0) {
                // Swipe down - go to previous section
                currentSection--;
            }
            
            updateCube();
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }, { passive: true });
    
});

// ===== CUSTOM CURSOR IMPLEMENTATION =====
// OPTIMIZED CUSTOM CURSOR IMPLEMENTATION
(function() {
    // Only run on non-touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return;
    }
    
    // Track whether cursor is already initialized
    let isInitialized = false;
    let cursor = null;
    let animationFrameId = null;
    
    function initCustomCursor() {
        // Prevent multiple initializations
        if (isInitialized) return;
        isInitialized = true;
        
        // Create cursor only once
        cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
        
        // Use RAF for smoother performance and less CPU usage
        function updateCursorPosition(e) {
            // Cancel any pending animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            
            // Schedule the update for the next frame
            animationFrameId = requestAnimationFrame(() => {
                const x = e.clientX;
                const y = e.clientY;
                cursor.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
        
        // Use performance-optimized event listeners
        document.addEventListener('mousemove', updateCursorPosition, { passive: true });
        
        // Track mouse enter/leave for the window
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        }, { passive: true });
        
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        }, { passive: true });
        
        // Optimized hover handling for section4 buttons
        setupHoverHandlers();
    }
    
    // More efficient hover handlers
    function setupHoverHandlers() {
        const section4Buttons = document.querySelectorAll('#button-container-section4 a');
        
        // Use event delegation instead of multiple listeners when possible
        section4Buttons.forEach(button => {
            // Store the original text to avoid DOM manipulation on each hover
            const buttonText = "Get in touch!";
            
            // Add hover handlers just once per button
            button.addEventListener('mouseenter', () => {
                if (!cursor) return;
                cursor.classList.add('expanded');
                cursor.textContent = buttonText;
            }, { passive: true });
            
            button.addEventListener('mouseleave', () => {
                if (!cursor) return;
                cursor.classList.remove('expanded');
                cursor.textContent = '';
            }, { passive: true });
        });
        
        // Future expansion - Currently commented out
        // Uncomment to apply to section2 buttons as well
        /*
        const section2Buttons = document.querySelectorAll('#button-container a');
        section2Buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!cursor) return;
                cursor.classList.add('expanded');
                cursor.textContent = "Learn More!";
            }, { passive: true });
            
            button.addEventListener('mouseleave', () => {
                if (!cursor) return;
                cursor.classList.remove('expanded');
                cursor.textContent = '';
            }, { passive: true });
        });
        */
    }
    
    // Function to ensure video controls use custom cursor
    function setupVideoControls() {
        // Wait for video modal to be active
        const videoObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    const videoModal = document.getElementById('video-modal');
                    if (videoModal && videoModal.classList.contains('active')) {
                        // Target the video and its controls
                        const videoElement = document.getElementById('modal-video');
                        if (videoElement) {
                            // Force cursor: none on the video element
                            videoElement.style.cursor = 'none';
                            
                            // If the controls are within an iframe or shadow DOM
                            // we might need a more aggressive approach
                            applyToVideoElements();
                        }
                    }
                }
            });
        });
        
        const videoModal = document.getElementById('video-modal');
        if (videoModal) {
            videoObserver.observe(videoModal, { attributes: true });
        }
        
        // Add event handler for video play button
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('mouseenter', () => {
                if (!cursor) return;
                cursor.classList.add('expanded');
                cursor.textContent = "Play Video";
            }, { passive: true });
            
            playButton.addEventListener('mouseleave', () => {
                if (!cursor) return;
                cursor.classList.remove('expanded');
                cursor.textContent = '';
            }, { passive: true });
        }
    }

    // More aggressive approach to target video elements
    function applyToVideoElements() {
        // Force cursor: none through a stylesheet
        const style = document.createElement('style');
        style.innerHTML = `
            /* Basic video controls */
            video::-webkit-media-controls-panel,
            video::-webkit-media-controls-play-button,
            video::-webkit-media-controls-volume-slider,
            video::-webkit-media-controls-mute-button,
            video::-webkit-media-controls-timeline,
            video::-webkit-media-controls-current-time-display,
            video::-webkit-media-controls-time-remaining-display,
            video::-webkit-media-controls-fullscreen-button,
            video::-webkit-media-controls-timeline-container,
            video::-webkit-media-controls-enclosure,
            
            /* Specific targets for More Options button */
            video::-webkit-media-controls-toggle-closed-captions-button,
            video::-webkit-media-controls-overflow-button,
            video::-webkit-media-controls-more-options-button,
            video::-webkit-media-controls-settings-button,
            video::-internal-media-controls-overflow-menu-list,
            video::-internal-media-controls-download-button,
            video::-webkit-media-controls-overflow-menu-list,
            video::-webkit-media-controls-overflow-button,
            
            /* Chrome's more options button */
            video::-webkit-media-controls-toggle-closed-captions-button,
            
            /* Firefox specific */
            video::-moz-range-thumb,
            video::-moz-range-track,
            video::-moz-range-progress,
            
            /* Safari specific */
            video::-webkit-media-controls-panel.detail-panel,
            video::-webkit-media-controls-panel button,
            
            /* Video.js player (if used) */
            .video-js .vjs-control,
            .video-js .vjs-big-play-button,
            .video-js .vjs-menu-button,
            .video-js .vjs-slider,
            .video-js .vjs-volume-panel,
            .video-js .vjs-progress-control,
            .video-js .vjs-menu,
            .video-js .vjs-menu-item {
                cursor: none !important;
            }
            
            /* Target controls activated by the More Options button */
            div[aria-label="More options"],
            div[aria-label="Options"],
            div[aria-label="Settings"],
            div[title="More options"],
            div[title="Settings"],
            div[role="menu"],
            div[role="menuitem"],
            .ytp-menuitem,
            .ytp-settings-menu,
            .ytp-panel-menu {
                cursor: none !important;
            }
            
            /* Target the container modal that appears when More Options is clicked */
            div[class*="controls-menu"],
            div[class*="popup-menu"],
            div[class*="context-menu"],
            div[class*="settings-menu"],
            div[class*="overlay-menu"] {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Force cursor: none on all elements via stylesheet
    function applyCursorStylesheet() {
        const style = document.createElement('style');
        style.innerHTML = `
            html, body, a, button, input, select, textarea, label, .nav-dot, 
            .nav-arrow, .play-button, .menu-btn, .menu-close,
            div[role="button"], [onclick], [class*="button"], [id*="button"],
            [tabindex="0"], [data-section], [href], .close-modal,
            .video-overlay, .content-overlay {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Clean up function to prevent memory leaks
    function cleanupCursor() {
        if (cursor && cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
        }
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        isInitialized = false;
    }
    
    // Fix for scrollbar issues - hidden scrollbars
    function fixScrollbarIssues() {
        const style = document.createElement('style');
        style.innerHTML = `
            html, body {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            
            html::-webkit-scrollbar, 
            body::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Handle window resize events
    window.addEventListener('resize', () => {
        if (cursor) {
            // Ensure cursor position updates on resize
            cursor.style.opacity = '0';
            setTimeout(() => {
                cursor.style.opacity = '1';
            }, 100);
        }
    }, { passive: true });
    
    // Clean up when page becomes hidden (modern replacement for unload)
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            cleanupCursor();
        }
    }, { passive: true });
    
    // Additional cleanup for page navigation (fallback)
    window.addEventListener('pagehide', cleanupCursor, { passive: true });
    
    // Apply all initialization
    applyCursorStylesheet();
    fixScrollbarIssues();
    setupVideoControls();
    
    // Initialize with a slight delay
    setTimeout(initCustomCursor, 500);
})();
