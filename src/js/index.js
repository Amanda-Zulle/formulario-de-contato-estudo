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


/* ---------- Validation rules ---------- */

const requiredRule = (value) =>
    value === "" ? "This field is required" : "";

const emailRules = [
    requiredRule,
    (value) =>
        value && !emailPattern.test(value)
            ? "Please enter a valid email address"
            : ""
];

const consentRules = [
    (value, input) =>
        !input.checked
            ? "To submit this form, please consent to being contacted"
            : ""
];


/* ---------- Toast ---------- */

const hideToast = () => {
    toast.classList.add("hidden");
};

const showToast = () => {
    toast.classList.remove("hidden");
};


/* ---------- Field state ---------- */

const setFieldState = (field, message = "") => {
    const { input, error } = field;

    input.classList.toggle("error", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
};

const clearFieldState = (field) => {
    setFieldState(field);
};


/* ---------- Field validation ---------- */

const validateField = (field, rules = []) => {
    const value =
        field.input.type === "checkbox"
            ? field.input.checked
            : field.input.value.trim();

    for (const rule of rules) {
        const message = rule(value, field.input);

        if (message) {
            setFieldState(field, message);
            return false;
        }
    }

    clearFieldState(field);
    return true;
};


/* ---------- Query validation ---------- */

const validateQuery = () => {
    const hasSelection = [...queryInputs].some(
        (radio) => radio.checked
    );

    queryError.textContent = hasSelection
        ? ""
        : "Please select a query type";

    return hasSelection;
};


/* ---------- Form validation ---------- */

const validateForm = () => {
    hideToast();

    Object.values(fields).forEach(clearFieldState);
    queryError.textContent = "";

    let isValid = true;

    isValid =
        validateField(fields.firstName, [requiredRule]) && isValid;

    isValid =
        validateField(fields.lastName, [requiredRule]) && isValid;

    isValid =
        validateField(fields.email, emailRules) && isValid;

    isValid =
        validateField(fields.message, [requiredRule]) && isValid;

    isValid =
        validateField(fields.consent, consentRules) && isValid;

    isValid =
        validateQuery() && isValid;

    return isValid;
};


/* ---------- Submit ---------- */

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    form.reset();
    showToast();
});


/* ---------- Live validation ---------- */

Object.entries(fields).forEach(([fieldKey, field]) => {
    field.input.addEventListener("input", () => {
        if (fieldKey === "email") {
            validateField(field, emailRules);
            return;
        }

        if (fieldKey === "consent") {
            validateField(field, consentRules);
            return;
        }

        validateField(field, [requiredRule]);
    });
});


/* ---------- Query change ---------- */

queryInputs.forEach((input) => {
    input.addEventListener("change", validateQuery);
});


hideToast();
