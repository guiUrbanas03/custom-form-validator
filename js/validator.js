import { CheckboxField, Field } from "./field.js";
import { Observer } from "./observer.js";
import { SCHEMAS } from "./schemas.js";

const FIELD_VALIDATOR_SELECTOR = "[data-validator]"

export class FormValidator extends Observer {
    constructor(form, schema) {
        super();

        this.form = form;
        this.submitter = this.form.querySelector("[type=submit]");
        this.schema = SCHEMAS[schema];
        this.fields = [];
        this.hasErrors = true;

        this.setFields(this.instantiatedFields);
        
        this.observeFields();
        this.listenSubmit();
    }

    get fieldElements() {
        return this.form.querySelectorAll(FIELD_VALIDATOR_SELECTOR);
    }

    getInput(fieldElement) {
        return fieldElement.querySelector("input");
    }

    get instantiatedFields() {
        return [...this.fieldElements].map((fieldElement) => this.getInput(fieldElement).type === "checkbox" 
            ? new CheckboxField(fieldElement)
            : new Field(fieldElement));
    }

    get schemaDataObject() {
        return this.fields.reduce((data, field) => {
            data[field.validatorKey] = field.effectiveValue;
            return data;
        }, {});
    }

    getField(key) {
        return this.fields.find((field) => field.validatorKey === key);
    }

    getIssue(validation, key) {
        return validation.error.issues.find((issue) => issue.path[0] === key);
    }

    setFields(fields) {
        this.fields = fields;
    }

    setHasErrors(value) {
        this.submitter.disabled = value;
        this.hasErrors = value;
    }

    observeFields() {
        this.fields.forEach((field) => {
            field.addObserver(this);
        });
    }

    updateObserver(data) {
        const currentField = this.getField(data["field"]);
        console.log(this.schemaDataObject);
        const validation = this.schema.safeParse(this.schemaDataObject);

        if (!validation.success) {
            return this.onValidationFailure(validation, currentField);
        } 

        this.onValidationSuceed(currentField);
    }

    onValidationFailure(validation, currentField) {
        const error = this.getIssue(validation, currentField.validatorKey);
        currentField.errorElement.innerText = error?.message ?? "";
        this.setHasErrors(true); 
    }

    onValidationSuceed(currentField) {
        currentField.errorElement.innerText = "";
        this.setHasErrors(false);
    }
    
    listenSubmit() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!this.hasErrors) {
                this.form.submit();
            }
        });
    }
}