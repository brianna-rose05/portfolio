const hamburger = document.querySelector(".hamburger_menu");
const navMenu = document.querySelector(".nav_menu");
const navLinks = document.querySelectorAll(".nav_link");
const footerBtns = document.querySelectorAll(".menu_button_container .btn");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".navigation")) {
        navMenu.classList.remove("active");
    }
});

function setActive(href) {
    navLinks.forEach(link => {
        link.classList.toggle("selected", link.getAttribute("href") === href);
    });
    footerBtns.forEach(btn => {
        btn.classList.toggle("selected", btn.getAttribute("href") === href);
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => setActive(link.getAttribute("href")));
});
footerBtns.forEach((btn) => {
    btn.addEventListener("click", () => setActive(btn.getAttribute("href")));
});
/* ------------------------------ Scroll reveal ----------------------------- */
const options = {
    root: null, //watch whole document
    rootMargin: '0px',
    threshold: 0.3, //element considered visible if at least 30% in viewport
};

const callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
            if (entry.target.classList.contains("stagger")) {
                const cards = Array.from(entry.target.parentElement.children);
                const index = cards.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 250}ms`;
            }
            entry.target.classList.add("animated");
        }
    });
};

const observer = new IntersectionObserver(callback, options);
const animatedElements = document.querySelectorAll('.animate');


animatedElements.forEach(element => {observer.observe(element)});

/* ------------------------------- DOT CURSOR ------------------------------- */
const cursor = document.querySelector('.cursor_dot');
const viewTargets = document.querySelectorAll('[data-cursor="view"]');

document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
})

document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor_grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor_grow'));
});


viewTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor_view'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor_view'));
});

/* ------------------- TURN ON NAV BAR OPACITY IN SECTION ------------------- */
if (window.matchMedia('(pointer: fine)').matches) {
    const sections = document.querySelectorAll('section[id]');

    const clearObserver = new IntersectionObserver((entries) => {
    
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            const id = entry.target.id;
            // if the highlighted link points to THIS section that just left, clear it
            const selectedLink = document.querySelector(`.nav_link.selected[href="#${id}"]`);
            if (selectedLink) {
                document.querySelectorAll('.nav_link, .btn').forEach(el => {
                    el.classList.remove('selected');
                });
            }
        }
    });
});
}
sections.forEach(section => clearObserver.observe(section));