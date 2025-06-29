document.addEventListener("DOMContentLoaded", () => {
    const darkModeBtn = document.getElementById("toggle-dark-mode");
    const modeIcon = document.getElementById("mode-icon");
    const body = document.body;
    
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
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", () => {
            if (body.classList.contains("dark-mode")) {
                body.classList.remove("dark-mode");
                localStorage.setItem("dark-mode", "disabled");
                modeIcon.textContent = "🌙";
            } else {
                body.classList.add("dark-mode");
                localStorage.setItem("dark-mode", "enabled");
                modeIcon.textContent = "☀️";
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

    // Tab functionality for learning archive page
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Remove active class from all buttons and contents
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Filter functionality for course page
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        const courseRows = document.querySelectorAll('.course-row');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Remove active class from all filter buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked filter button
                this.classList.add('active');
                
                // Show/hide courses based on filter
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
});