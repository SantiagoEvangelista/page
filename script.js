document.addEventListener("DOMContentLoaded", () => {

    // Contact form submission (shared between contact + careers pages)
    const form = document.getElementById("contactForm");
    if (form) {
        const status = document.getElementById("contactStatus");
        const submitButton = form.querySelector('button[type="submit"]');
        const originalLabel = submitButton.textContent;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            submitButton.disabled = true;
            submitButton.textContent = "Sending";
            if (status) status.textContent = "";

            try {
                // Append LinkedIn to the message so it reaches Google Forms
                const linkedInInput = document.getElementById("applyLinkedIn");
                if (linkedInInput && linkedInInput.value.trim()) {
                    const messageField = document.getElementById("applyMessage");
                    if (messageField) {
                        messageField.value = messageField.value.trimEnd() + "\n\nLinkedIn: " + linkedInInput.value.trim();
                    }
                }

                await fetch(form.action, {
                    method: "POST",
                    mode: "no-cors",
                    body: new FormData(form)
                });

                form.reset();
                if (status) status.textContent = "Message sent.";
            } catch (error) {
                if (status) status.textContent = "Unable to send right now.";
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalLabel;
            }
        });
    }

    // Job card expand/collapse
    const jobCards = document.querySelectorAll(".job-card");
    jobCards.forEach((card) => {
        const header = card.querySelector(".job-header");

        header.addEventListener("click", () => {
            const isOpen = card.classList.contains("is-open");

            jobCards.forEach((other) => {
                other.classList.remove("is-open");
                other.querySelector(".job-header").setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                card.classList.add("is-open");
                header.setAttribute("aria-expanded", "true");
            }
        });
    });

    // Apply modal
    const modal = document.getElementById("applyModal");
    if (!modal) return;

    const applyMessage = document.getElementById("applyMessage");
    const applyRoleLabel = document.getElementById("applyRoleLabel");
    const closeButton = modal.querySelector(".modal-close");

    function openModal(role) {
        if (applyRoleLabel) {
            applyRoleLabel.textContent = "Apply — " + role;
        }
        if (applyMessage) {
            applyMessage.value = "Role: " + role + "\n\n";
        }
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (applyMessage) {
            applyMessage.focus();
            applyMessage.setSelectionRange(applyMessage.value.length, applyMessage.value.length);
        }
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Apply buttons open modal
    document.querySelectorAll(".job-apply").forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".job-card");
            openModal(card.dataset.role);
        });
    });

    // Close on X button
    closeButton.addEventListener("click", closeModal);

    // Close on overlay click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });
});
