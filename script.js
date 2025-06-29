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
});