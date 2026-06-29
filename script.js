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

    /* Animate the home hero architecture card without external dependencies. */
    const architectureCards = document.querySelectorAll(".architecture-card");

    architectureCards.forEach(function (card) {
        const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const roleElement = card.querySelector("[data-role-rotator]");
        const nodes = card.querySelectorAll(".architecture-node");
        const paths = card.querySelectorAll(".architecture-path");
        const titles = ["Full-Stack Software Developer", "Travlr Getaways Admin"];
        let titleIndex = 0;
        let titleIntervalId = null;

        function removePackets() {
            card.querySelectorAll(".architecture-packet").forEach(function (packet) {
                packet.remove();
            });
        }

        function rotateTitle() {
            if (!roleElement) {
                return;
            }

            roleElement.classList.add("is-transitioning");

            window.setTimeout(function () {
                titleIndex = (titleIndex + 1) % titles.length;
                roleElement.textContent = titles[titleIndex];
                roleElement.classList.remove("is-transitioning");
            }, 280);
        }

        function startTitleRotation() {
            if (!roleElement || titleIntervalId || reducedMotionQuery.matches) {
                return;
            }

            titleIntervalId = window.setInterval(rotateTitle, 7000);
        }

        function stopTitleRotation() {
            if (titleIntervalId) {
                window.clearInterval(titleIntervalId);
                titleIntervalId = null;
            }

            if (roleElement) {
                roleElement.classList.remove("is-transitioning");
                roleElement.textContent = titles[0];
                titleIndex = 0;
            }
        }

        function setActiveConnections(activeNode) {
            const activeTechnology = activeNode.dataset.tech;

            nodes.forEach(function (node) {
                node.classList.toggle("is-active", node === activeNode);
            });

            paths.forEach(function (path) {
                const connectedTechnologies = (path.dataset.connection || "").split(" ");
                path.classList.toggle("is-active", connectedTechnologies.includes(activeTechnology));
            });
        }

        function clearActiveConnections() {
            nodes.forEach(function (node) {
                node.classList.remove("is-active");
            });

            paths.forEach(function (path) {
                path.classList.remove("is-active");
            });
        }

        nodes.forEach(function (node) {
            node.addEventListener("mouseenter", function () {
                setActiveConnections(node);
            });

            node.addEventListener("focus", function () {
                setActiveConnections(node);
            });

            node.addEventListener("mouseleave", function () {
                if (document.activeElement !== node) {
                    clearActiveConnections();
                }
            });

            node.addEventListener("blur", function () {
                if (!node.matches(":hover")) {
                    clearActiveConnections();
                }
            });
        });

        if (reducedMotionQuery.matches) {
            removePackets();
            stopTitleRotation();
        } else {
            startTitleRotation();
        }

        if (typeof reducedMotionQuery.addEventListener === "function") {
            reducedMotionQuery.addEventListener("change", function (event) {
                if (event.matches) {
                    removePackets();
                    stopTitleRotation();
                } else {
                    startTitleRotation();
                }
            });
        }
    });
});
