export const validateEmail = (email) => {

    // 1. Ensure the email is a string
    if (typeof email !== "string") {
        return {
            isValid: false,
            message: "Email address must be valid text."
        };
    }

    // 2. Normalize the email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check empty email
    if (!normalizedEmail) {
        return {
            isValid: false,
            message: "Email address is required."
        };
    }

    // 4. Check maximum email length
    if (normalizedEmail.length > 254) {
        return {
            isValid: false,
            message: "Email address is too long."
        };
    }

    // 5. Validate email structure
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailPattern.test(normalizedEmail)) {
        return {
            isValid: false,
            message: "Please enter a valid email address."
        };
    }

    // 6. Return successful validation
    return {
        isValid: true,
        message: "Email address is valid.",
        value: normalizedEmail
    };
};


//// Validate when submitting

// import { validateEmail } from "./validation.js";

// const customerForm = document.querySelector("#customerForm");
// const customerEmail = document.querySelector("#customerEmail");
// const emailError = document.querySelector("#emailError");

// customerForm.addEventListener("submit", (event) => {

//     event.preventDefault();

//     // Get and validate email
//     const emailResult = validateEmail(customerEmail.value);

//     if (!emailResult.isValid) {

//         emailError.textContent = emailResult.message;
//         emailError.style.color = "red";

//         customerEmail.focus();

//         return;
//     }

//     // Replace input with normalized email
//     customerEmail.value = emailResult.value;

//     emailError.textContent = "";

//     console.log("Validated email:", emailResult.value);

//     // Continue saving customer details...
// });

/// Prevent duplicate emails

// export const isEmailAlreadyRegistered = (
//     email,
//     availableCustomers,
//     currentCustomerId = null
// ) => {

//     const normalizedEmail = email.trim().toLowerCase();

//     return availableCustomers.some(customer => {

//         if (!customer || typeof customer.email !== "string") {
//             return false;
//         }

//         const existingEmail = customer.email.trim().toLowerCase();

//         return (
//             existingEmail === normalizedEmail &&
//             customer.id !== currentCustomerId
//         );

//     });
// };