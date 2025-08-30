document.addEventListener("DOMContentLoaded", () => {
    const darkModeBtn = document.getElementById("toggle-dark-mode");
    const modeIcon = document.getElementById("mode-icon");
    const body = document.body;

    // Centralized icons for dark and light mode
    const DARK_MODE_ICON = "🌙";
    const LIGHT_MODE_ICON = "☀️";

    // Set current year in footer
    const currentYearElement = document.getElementById("current-year");
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Check if dark mode is enabled in localStorage
    if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("dark-mode");
        if (darkModeBtn) {
            darkModeBtn.checked = true;
        }
        if (modeIcon) {
            modeIcon.textContent = LIGHT_MODE_ICON;
        }
    } else {
        if (modeIcon) {
            modeIcon.textContent = DARK_MODE_ICON;
        }
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", () => {
            if (body.classList.contains("dark-mode")) {
                body.classList.remove("dark-mode");
                localStorage.setItem("dark-mode", "disabled");
                if (modeIcon) {
                    modeIcon.textContent = DARK_MODE_ICON;
                }
            } else {
                body.classList.add("dark-mode");
                localStorage.setItem("dark-mode", "enabled");
                if (modeIcon) {
                    modeIcon.textContent = LIGHT_MODE_ICON;
                }
            }
        });
    }

    // Add section highlighting in navigation
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-bar a[href^='#']");

    function highlightNavLink() {
        const scrollPos = window.scrollY + 100; // Offset to trigger slightly before the section

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + sectionId) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }
    // Initial call and event listener
    highlightNavLink();
    window.addEventListener("scroll", highlightNavLink);

    // Tab functionality for learning archive

        // Update current year in footer (handled above)

    // Tab functionality for learning archive
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                console.log('Tab clicked:', tabId);

                // Get all tab buttons and content
                const allTabBtns = document.querySelectorAll('.tab-btn');
                const allTabContents = document.querySelectorAll('.tab-content');

                // Remove active class from all buttons and contents
                allTabBtns.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }

    // Course filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                console.log('Filter selected:', filter);

                // Remove active class from all filter buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked filter button
                this.classList.add('active');

                // Filter course rows
                const courseRows = document.querySelectorAll('.course-row');
                courseRows.forEach(row => {
                    if (filter === 'all' || row.classList.contains(filter)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }

    // Typewriter effect for writer bio
    document.addEventListener('DOMContentLoaded', function() {
        const writerBio = document.getElementById('writer-bio');
        
        if (writerBio) {
            const bioText = writerBio.innerHTML;
            const bioTextPlain = bioText.replace(/<br><br>/g, '\n\n');
            
            // Clear the div to start fresh
            writerBio.innerHTML = '';
            
            // Create cursor element
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            writerBio.parentNode.appendChild(cursor);
            
            // Start typing after a short delay
            let charIndex = 0;
            let htmlContent = '';
            const typingDelay = 20; // milliseconds per character
            
            function typeText() {
                if (charIndex < bioTextPlain.length) {
                    // Handle newlines
                    if (bioTextPlain.charAt(charIndex) === '\n' && bioTextPlain.charAt(charIndex + 1) === '\n') {
                        htmlContent += '<br><br>';
                        charIndex += 2;
                    } else {
                        htmlContent += bioTextPlain.charAt(charIndex);
                        charIndex++;
                    }
                    
                    writerBio.innerHTML = htmlContent;
                    
                    // Position cursor at the end of text
                    const bioRect = writerBio.getBoundingClientRect();
                    cursor.style.position = 'absolute';
                    cursor.style.top = (window.scrollY + bioRect.bottom - 20) + 'px';
                    cursor.style.left = (bioRect.right + 2) + 'px';
                    
                    // Schedule next character with variable delay
                    const nextDelay = typingDelay * (bioTextPlain.charAt(charIndex) === '.' ? 5 : 1);
                    setTimeout(typeText, nextDelay);
                } else {
                    // Done typing, continue blinking cursor
                    cursor.style.position = 'static';
                    cursor.style.display = 'inline-block';
                    writerBio.appendChild(cursor);
                }
            }
            
            // Option to skip animation on second visit
            const hasVisitedBefore = sessionStorage.getItem('visitedWritingPage');
            
            if (hasVisitedBefore) {
                // Skip animation for returning visitors
                writerBio.innerHTML = bioText;
            } else {
                // Start typing animation after a brief pause
                setTimeout(typeText, 800);
                // Mark that user has visited the page
                sessionStorage.setItem('visitedWritingPage', 'true');
            }
        }
    });
});
