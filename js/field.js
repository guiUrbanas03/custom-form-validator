import { Subject } from "./observer.js";

export class Field extends Subject {
    INPUT_ELEMENT_SELECTOR = "input";
    ERROR_ELEMENT_SELECTOR = ".error";

    constructor(containerElement) {
        super();
        this.containerElement = containerElement;
        this.inputElement = this.containerElement.querySelector(this.INPUT_ELEMENT_SELECTOR);
        this.errorElement = this.containerElement.querySelector(this.ERROR_ELEMENT_SELECTOR);
        this.validatorKey = this.containerElement.dataset.validator;
        this.effectiveValue = undefined;

        this.listenInput();
    }

    setEffectiveValue(value) {
        this.effectiveValue = value;
    }

    updateField(value) {
        this.setEffectiveValue(value);
        this.notifyObservers(this.buildData(this.effectiveValue));
    }

    buildData(value) {
        return {
            "field": this.validatorKey,
            "data": value
        };
    }

    listenInput() {
        this.inputElement.addEventListener("input", (event) => this.updateField(event.target.value));
    }
}


export class CheckboxField extends Field {
    listenInput() {
        this.inputElement.addEventListener("input", (event) => this.updateField(event.target.checked));
    }
}