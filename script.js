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
        modeIcon.textContent = "🌞";
    } else {
        modeIcon.textContent = "🌙";
    }

    darkModeBtn.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        
        // Save the user's preference
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
            modeIcon.textContent = "🌞";
        } else {
            localStorage.setItem("dark-mode", "disabled");
            modeIcon.textContent = "🌙";
        }
    });

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
});