document.addEventListener("DOMContentLoaded", () => {
    const darkModeBtn = document.getElementById("toggle-dark-mode");
    const modeIcon = document.getElementById("mode-icon");
    const body = document.body;

    // Check localStorage for dark mode preference
    if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("dark-mode");
        modeIcon.textContent = "🌞"; // Set to sun icon for light mode
    }

    darkModeBtn.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        
        // Save the user's preference
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
            modeIcon.textContent = "🌞"; // Change to sun icon
        } else {
            localStorage.setItem("dark-mode", "disabled");
            modeIcon.textContent = "🌙"; // Change to moon icon
        }
    });
});
