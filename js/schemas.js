import z from 'https://cdn.jsdelivr.net/npm/zod@3.21.4/+esm';

const isRequired = (data) => !!data;
const MUST = "Password must contain one";

const passwordSchema = z.coerce.string().min(6).max(60)
    .refine((value) => /[a-z]/.test(value), `${MUST} lowercase`)
    .refine((value) => /[A-Z]/.test(value), `${MUST} uppercase`)
    .refine((value) => /\d/.test(value), `${MUST} number`) 
    .refine((value) => /\W/.test(value), `${MUST} special character`)


const FormSchema = z.object({
    name: z.string().max(100).refine(isRequired, "Required"),
    age: z.coerce.number().min(0).max(999).refine(isRequired, "Required"),
    email: z.string().email().max(100).refine(isRequired, "Required"),
    password: passwordSchema,
    confirmPassword: z.string().max(60),
    termsAndConditions: z.coerce.boolean()
        .refine((value) => value === true, { message: "Must accept terms and conditions"}),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
});


export const SCHEMAS = Object.freeze({
    form: FormSchema,
});