const form = document.querySelector(".card");
const toast = document.querySelector(".toast");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = {
    firstName: {
        input: document.querySelector("#first-name"),
        error: document.querySelector("#first-name-error")
    },
    lastName: {
        input: document.querySelector("#last-name"),
        error: document.querySelector("#last-name-error")
    },
    email: {
        input: document.querySelector("#email"),
        error: document.querySelector("#email-error")
    },
    message: {
        input: document.querySelector("#message"),
        error: document.querySelector("#message-error")
    },
    consent: {
        input: document.querySelector("#consent"),
        error: document.querySelector("#consent-error")
    }
};

const queryInputs = document.querySelectorAll('input[name="queryType"]');
const queryError = document.querySelector("#query-error");

const hideToast = () => {
    toast.classList.add("hidden");
    toast.setAttribute("aria-hidden", "true");
};

const showToast = () => {
    toast.classList.remove("hidden");
    toast.setAttribute("aria-hidden", "false");
};

const setFieldState = (field, message = "") => {
    const { input, error } = field;

    input.classList.toggle("error", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
};

const clearFieldState = (field) => setFieldState(field, "");

const validateQuery = () => {
    const hasSelection = [...queryInputs].some((radio) => radio.checked);

    if (!hasSelection) {
        queryError.textContent = "Please select a query type";
        return false;
    }

    queryError.textContent = "";
    return true;
};

const validateField = (field, rules = []) => {
    const value = field.input.type === "checkbox" ? field.input.checked : field.input.value.trim();

    for (const rule of rules) {
        const result = rule(value, field.input);
        if (result) {
            setFieldState(field, result);
            return false;
        }
    }

    clearFieldState(field);
    return true;
};

const validateForm = () => {
    hideToast();

    Object.values(fields).forEach(clearFieldState);
    queryError.textContent = "";

    let isValid = true;

    isValid = validateField(fields.firstName, [
        (value) => (value === "" ? "This field is required" : "")
    ]) && isValid;

    isValid = validateField(fields.lastName, [
        (value) => (value === "" ? "This field is required" : "")
    ]) && isValid;

    isValid = validateField(fields.email, [
        (value) => (value === "" ? "This field is required" : ""),
        (value) => (value && !emailPattern.test(value) ? "Please enter a valid email address" : "")
    ]) && isValid;

    isValid = validateField(fields.message, [
        (value) => (value === "" ? "This field is required" : "")
    ]) && isValid;

    isValid = validateField(fields.consent, [
        (value, input) => (!input.checked ? "To submit this form, please consent to being contacted" : "")
    ]) && isValid;

    isValid = validateQuery() && isValid;

    return isValid;
};

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    form.reset();
    showToast();
});

Object.values(fields).forEach(({ input }) => {
    input.addEventListener("input", () => {
        if (input.type === "checkbox") {
            validateField(fields.consent, [
                (value, checkbox) => (!checkbox.checked ? "To submit this form, please consent to being contacted" : "")
            ]);
            return;
        }

        if (input.id === "email") {
            validateField(fields.email, [
                (value) => (value === "" ? "This field is required" : ""),
                (value) => (value && !emailPattern.test(value) ? "Please enter a valid email address" : "")
            ]);
            return;
        }

        const fieldKey = input.name;
        if (fields[fieldKey]) {
            validateField(fields[fieldKey], [
                (value) => (value === "" ? "This field is required" : "")
            ]);
        }
    });
});

queryInputs.forEach((input) => {
    input.addEventListener("change", () => validateQuery());
});

hideToast();
