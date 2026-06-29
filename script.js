/* ==========================================================================
   CS499 ePortfolio JavaScript
   Handles responsive navigation, active navigation state, and minor UI polish.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const siteHeader = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const yearElement = document.querySelector("#current-year");

    /* Add a subtle shadow to the sticky header after the page scrolls. */
    function updateHeaderState() {
        if (siteHeader) {
            siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
        }
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    /* Display the current year in the footer without requiring manual updates. */
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* Toggle the mobile navigation menu and keep ARIA state in sync. */
    if (navToggle && navMenu) {
        function closeNavigation() {
            navMenu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("nav-open");
        }

        navToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("nav-open", isOpen);
        });

        navMenu.addEventListener("click", function (event) {
            if (event.target instanceof HTMLAnchorElement) {
                closeNavigation();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeNavigation();
                navToggle.focus();
            }
        });

        document.addEventListener("click", function (event) {
            const isNavigationClick = navMenu.contains(event.target) || navToggle.contains(event.target);

            if (!isNavigationClick && navMenu.classList.contains("is-open")) {
                closeNavigation();
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
