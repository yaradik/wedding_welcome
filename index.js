
document.addEventListener('DOMContentLoaded', () => {
    const envelopeContainer = document.getElementById('envelope-container');
    const envelope = document.getElementById('envelope');
    const openButton = document.getElementById('open-button');
    const invitationContent = document.getElementById('invitation-content');
    const mainHeader = document.getElementById('main-header');

    let scrollObserver = null; 

    const setupScrollAnimations = () => {
        const scrollPages = document.querySelectorAll('.scroll-page');
        if (scrollPages.length === 0 || scrollObserver) return; 

        const observerOptions = {
            root: invitationContent, // Observe scrolling within main-content
            rootMargin: '0px 0px -15% 0px', // Trigger a bit earlier
            threshold: 0.1 
        };

        const intersectionCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    // Optional: remove active class
                    // if (entry.boundingClientRect.bottom < 0 || entry.boundingClientRect.top > window.innerHeight) {
                    //    entry.target.classList.remove('active');
                    // }
                }
            });
        };

        scrollObserver = new IntersectionObserver(intersectionCallback, observerOptions);
        scrollPages.forEach(page => {
            scrollObserver.observe(page);
        });
        
        setTimeout(() => {
             if (scrollPages.length > 0 && invitationContent && invitationContent.classList.contains('visible')) {
                const firstPage = scrollPages[0];
                // Check if first page is in view relative to the scroll container (invitationContent)
                const containerRect = invitationContent.getBoundingClientRect();
                const firstPageRect = firstPage.getBoundingClientRect();
                
                // Adjust condition for intersection relative to the container
                if (firstPageRect.top <= containerRect.top + (containerRect.height * 0.85) && firstPageRect.bottom >= containerRect.top) { 
                    firstPage.classList.add('active');
                }
            }
        }, 150); 
    };

    const setupHeaderNavigation = () => {
        if (!mainHeader || !invitationContent) return;
        const navLinks = mainHeader.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return; 

                const targetElement = document.querySelector(targetId);

                if (targetElement && targetElement instanceof HTMLElement) {
                    const headerOffset = mainHeader.offsetHeight;
                    // Calculate position relative to the scrollable container (invitationContent)
                    const elementPositionInContainer = targetElement.offsetTop; 
                    const offsetPosition = elementPositionInContainer - headerOffset;
                    
                    invitationContent.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    const targetHeader = targetElement.querySelector('h1, h2');
                    if(targetHeader && targetHeader instanceof HTMLElement) {
                        targetHeader.setAttribute('tabindex', '-1'); 
                        targetHeader.focus({ preventScroll: true }); 
                    } else {
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus({ preventScroll: true });
                    }
                } else {
                    console.warn('Navigation target not found or not an HTMLElement:', targetId);
                }
            });
        });
    };

    const openEnvelope = () => {
        if (!envelopeContainer || !invitationContent || !envelope || !openButton) {
            console.error('One or more envelope elements not found.');
            return;
        }

        envelopeContainer.classList.add('opening');
        if(envelope) envelope.setAttribute('aria-expanded', 'true');

        setTimeout(() => {
            if (envelopeContainer) {
                envelopeContainer.classList.add('opened');
            }
        }, 500); 

        setTimeout(() => {
            if (envelopeContainer) envelopeContainer.style.display = 'none';
            if (invitationContent) {
                invitationContent.style.display = 'block'; 
                invitationContent.setAttribute('aria-hidden', 'false');
                if (mainHeader) mainHeader.style.display = 'flex'; 

                setTimeout(() => { 
                    invitationContent.classList.add('visible');
                    setupScrollAnimations(); 
                    setupHeaderNavigation();

                    const firstVisibleSection = invitationContent.querySelector('.scroll-page.hero-page-1');
                    if (firstVisibleSection && firstVisibleSection instanceof HTMLElement) {
                        const focusableHeader = firstVisibleSection.querySelector('h1');
                        if (focusableHeader && focusableHeader instanceof HTMLElement) {
                            focusableHeader.setAttribute('tabindex', '-1');
                            focusableHeader.focus({ preventScroll: true });
                        } else {
                            firstVisibleSection.setAttribute('tabindex', '-1');
                            firstVisibleSection.focus({ preventScroll: true });
                        }
                    }
                }, 50); 
            }
        }, 900); 
    };
    
    if (openButton) {
        openButton.addEventListener('click', openEnvelope);
    }
    if (envelope) {
        envelope.addEventListener('click', openEnvelope);
        envelope.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); 
                openEnvelope();
            }
        });
    }

    setTimeout(() => {
        if (envelopeContainer && !envelopeContainer.classList.contains('opening') && !envelopeContainer.classList.contains('opened')) {
            envelopeContainer.classList.add('pre-open');
        }
    }, 200);

    let intervalId = null; 
    const countdownTimer = () => {
        const countToDate = new Date("July 15, 2025 16:00:00").getTime();
        const now = new Date().getTime();
        const difference = countToDate - now;

        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        const timerContainer = document.getElementById('countdown-timer');

        if (!daysElement || !hoursElement || !minutesElement || !secondsElement || !timerContainer) {
            if (intervalId) clearInterval(intervalId); 
            return;
        }

        if (difference < 0) {
            timerContainer.innerHTML = "<p>Это событие уже состоялось!</p>";
            if (intervalId) clearInterval(intervalId); 
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysElement.innerText = days < 10 ? '0' + days : days.toString();
        hoursElement.innerText = hours < 10 ? '0' + hours : hours.toString();
        minutesElement.innerText = minutes < 10 ? '0' + minutes : minutes.toString();
        secondsElement.innerText = seconds < 10 ? '0' + seconds : seconds.toString();
    };

    if (document.getElementById('countdown-timer')) { 
        intervalId = setInterval(countdownTimer, 1000);
        countdownTimer(); 
    }
    
    // Developer helper: skip envelope if #no-envelope is in URL
    if (window.location.hash === '#no-envelope') {
        if (envelopeContainer) envelopeContainer.style.display = 'none';
        if (invitationContent) {
            invitationContent.style.display = 'block';
            invitationContent.setAttribute('aria-hidden', 'false');
            if (mainHeader) mainHeader.style.display = 'flex';
            
            setTimeout(() => {
                invitationContent.classList.add('visible');
                setupScrollAnimations();
                setupHeaderNavigation();
                const firstVisibleSection = invitationContent.querySelector('.scroll-page.hero-page-1');
                if (firstVisibleSection && firstVisibleSection instanceof HTMLElement) {
                    const focusableHeader = firstVisibleSection.querySelector('h1');
                    if (focusableHeader && focusableHeader instanceof HTMLElement) {
                        focusableHeader.setAttribute('tabindex', '-1');
                        focusableHeader.focus({ preventScroll: true });
                    } else {
                       firstVisibleSection.setAttribute('tabindex', '-1');
                       firstVisibleSection.focus({ preventScroll: true });
                    }
                }
            }, 50);
        }
    }
});