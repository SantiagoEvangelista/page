document.addEventListener("DOMContentLoaded", () => {

    // Form submission (works for both contact + challenge pages)
    document.querySelectorAll(".contact-form").forEach((form) => {
        const status = form.querySelector(".form-status");
        const submitButton = form.querySelector('button[type="submit"]');
        const originalLabel = submitButton.textContent;
        const successMessage = form.id === "challengeForm"
            ? "We\u2019ll be in touch."
            : "Message sent.";

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            submitButton.disabled = true;
            submitButton.textContent = "Sending";
            if (status) status.textContent = "";

            try {
                const linkedInInput = form.querySelector("#applyLinkedIn");
                if (linkedInInput && linkedInInput.value.trim()) {
                    const messageField = form.querySelector("#applyMessage");
                    if (messageField) {
                        messageField.value = messageField.value.trimEnd()
                            + "\n\nLinkedIn: " + linkedInInput.value.trim();
                    }
                }

                await fetch(form.action, {
                    method: "POST",
                    mode: "no-cors",
                    body: new FormData(form)
                });

                form.reset();
                if (status) status.textContent = successMessage;
            } catch (error) {
                if (status) status.textContent = "Unable to send right now.";
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalLabel;
            }
        });
    });
});
