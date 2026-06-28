/* ==========================================================================
   CS499 ePortfolio JavaScript
   Handles responsive navigation, active navigation state, and minor UI polish.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const yearElement = document.querySelector("#current-year");

    /* Display the current year in the footer without requiring manual updates. */
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* Toggle the mobile navigation menu and keep ARIA state in sync. */
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("nav-open", isOpen);
        });

        navMenu.addEventListener("click", function (event) {
            if (event.target instanceof HTMLAnchorElement) {
                navMenu.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
                document.body.classList.remove("nav-open");
            }
        });
    }

    /* Highlight the current page for pages that do not use aria-current directly. */
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-menu a");

    navLinks.forEach(function (link) {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });
});
