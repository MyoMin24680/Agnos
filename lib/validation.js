// Simple, dependency-free validation used by PatientForm

export const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "phoneNumber",
  "email",
  "preferredLanguage",
  "nationality",
  "country",
  "city",
  "streetAddress",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s]{7,15}$/;

export function validateField(name, value) {
  const isEmpty = !value || value.toString().trim() === "";

  if (REQUIRED_FIELDS.includes(name) && isEmpty) {
    return "This field is required";
  }

  if (name === "email" && !isEmpty && !EMAIL_REGEX.test(value)) {
    return "Please enter a valid email address";
  }

  if (name === "phoneNumber" && !isEmpty && !PHONE_REGEX.test(value)) {
    return "Please enter a valid phone number";
  }

  return "";
}

export function validateAll(formData) {
  const errors = {};
  Object.keys(formData).forEach((key) => {
    const message = validateField(key, formData[key]);
    if (message) errors[key] = message;
  });
  return errors;
}
