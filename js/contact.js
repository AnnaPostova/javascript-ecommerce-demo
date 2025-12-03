document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".feedback__form");
    if (!form) return;

    const fields = {
        name: {
            input: document.getElementById("feedback-name"),
            error: document.getElementById("feedback-name-error"),
            requiredMessage: "Please enter your name."
        },
        email: {
            input: document.getElementById("feedback-email"),
            error: document.getElementById("feedback-email-error"),
            requiredMessage: "Please enter your email address.",
            invalidMessage: "Please enter a valid email address."
        },
        topic: {
            input: document.getElementById("feedback-topic"),
            error: document.getElementById("feedback-topic-error"),
            requiredMessage: "Please enter a topic."
        },
        message: {
            input: document.getElementById("feedback-message"),
            error: document.getElementById("feedback-message-error"),
            requiredMessage: "Please enter your message."
        }
    };

    const statusEl = document.createElement("p");
    statusEl.className = "feedback__status";
    statusEl.setAttribute("aria-live", "polite");
    form.appendChild(statusEl);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(field, message) {
        if (!field.input || !field.error) return;

        field.error.textContent = message;
        field.error.classList.add("visible");
        field.input.classList.add("form__input--invalid");
        field.input.setAttribute("aria-invalid", "true");
    }

    function clearError(field) {
        if (!field.input || !field.error) return;

        field.error.textContent = "";
        field.error.classList.remove("visible");
        field.input.classList.remove("form__input--invalid");
        field.input.removeAttribute("aria-invalid");
    }

    function validateField(field) {
        if (!field.input) return true;

        const value = field.input.value.trim();

        if (!value) {
            showError(field, field.requiredMessage);
            return false;
        }

        if (field.input.type === "email" && !emailRegex.test(value)) {
            showError(field, field.invalidMessage);
            return false;
        }

        clearError(field);
        return true;
    }

    Object.values(fields).forEach((field) => {
        if (!field.input) return;
        field.input.addEventListener("input", () => validateField(field));
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let isFormValid = true;

        Object.values(fields).forEach((field) => {
            const valid = validateField(field);
            if (!valid && isFormValid && field.input) {
                field.input.focus();
            }
            isFormValid = isFormValid && valid;
        });

        if (isFormValid) {
            statusEl.textContent = "Thank you! Your feedback has been sent.";
            statusEl.classList.add("feedback__status--success");
            statusEl.classList.remove("feedback__status--error");
            form.reset();
            Object.values(fields).forEach(clearError);
        } else {
            statusEl.textContent = "Please fix the highlighted fields and try again.";
            statusEl.classList.add("feedback__status--error");
            statusEl.classList.remove("feedback__status--success");
        }
    });
});
