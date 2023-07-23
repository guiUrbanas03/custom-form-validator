import { FormValidator } from "./validator.js";

const FORM_VALIDATOR_SELECTOR = ".form-validator"

window.addEventListener("load", () => {
    document.querySelectorAll(FORM_VALIDATOR_SELECTOR)
        .forEach((formValidator) => new FormValidator(formValidator, formValidator.dataset.schema))
});