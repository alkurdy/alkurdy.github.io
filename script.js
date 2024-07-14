document.addEventListener('DOMContentLoaded', () => {
    const birthDate = new Date('1988-09-05');
    const ageSpan = document.getElementById('age');

    const calculateAge = (birthDate) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    ageSpan.textContent = calculateAge(birthDate);
});

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav ul li a');
    const content = document.getElementById('content');

    function loadPage(page) {
        fetch(page + '.html')
            .then(response => response.text())
            .then(html => {
                content.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading page:', error);
            });
    }

    links.forEach(link => {
        link.addEventListener('click', event => {
            // Only load dynamically if the screen is larger than 600px
            if (window.innerWidth > 600) {
                event.preventDefault();
                const page = link.getAttribute('data-page');
                loadPage(page);
            }
        });
    });

    // Initially load the home page
    if (window.innerWidth > 600) {
        loadPage('home');
    }
});
