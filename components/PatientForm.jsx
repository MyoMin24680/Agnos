"use client";

import { useState, useRef, useCallback } from "react";
import FormField from "./FormField";
import GradientPanel from "./GradientPanel";
import { validateField, validateAll } from "@/lib/validation";

// import { useDebouncedCallback } from "@/lib/useDebouncedCallback";
import { useDebouncedFieldSync } from "@/lib/useDebouncedFieldSync";
import {
  LANGUAGE_OPTIONS,
  NATIONALITY_OPTIONS,
  RELIGION_OPTIONS,
  COUNTRY_OPTIONS,
  RELATIONSHIP_OPTIONS,
  GENDER_OPTIONS,
} from "@/lib/formOptions";
import { EVENT_FIELD_UPDATE, EVENT_STATUS_UPDATE } from "@/lib/pusher";

const INACTIVITY_TIMEOUT = 8000; // ms of no typing -> mark "inactive"

const initialFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  preferredLanguage: "",
  nationality: "",
  religion: "",
  phoneNumber: "",
  email: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  country: "",
  city: "",
  streetAddress: "",
};

async function sendToPusher(event, data) {
  try {
    await fetch("/api/pusher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
    });
  } catch (err) {
    console.error("Failed to sync:", err);
  }
}

export default function PatientForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const inactivityTimer = useRef(null);
  const hasStarted = useRef(false);

  // Debounced sync to Staff View — waits 400ms after typing stops
  const debouncedFieldSync = useDebouncedFieldSync((fieldName, value) => {
    sendToPusher(EVENT_FIELD_UPDATE, { fieldName, value });
  }, 400);

  const markInactiveAfterDelay = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      sendToPusher(EVENT_STATUS_UPDATE, { status: "inactive" });
      hasStarted.current = false;
    }, INACTIVITY_TIMEOUT);
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value })); // instant local UI update

    if (!hasStarted.current) {
      hasStarted.current = true;
      sendToPusher(EVENT_STATUS_UPDATE, { status: "filling" });
    }

    debouncedFieldSync(name, value);
    markInactiveAfterDelay();

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (name) => {
    const message = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = validateAll(formData);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      const firstErrorField = document.querySelector('[name="' + Object.keys(allErrors)[0] + '"]');
      firstErrorField?.focus();
      return;
    }

    await sendToPusher(EVENT_FIELD_UPDATE, formData); // final full snapshot
    await sendToPusher(EVENT_STATUS_UPDATE, { status: "submitted" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800">Thank you!</p>
          <p className="text-sm text-gray-500 mt-2">Your information has been submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <GradientPanel />

      <div className="bg-white px-5 py-8 sm:px-10 lg:px-14 overflow-y-auto">
        <h1 className="text-lg font-semibold mb-6">Patient Form</h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* ---------------- Personal Detail ---------------- */}
          <SectionHeader title="Personal Detail" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <FormField label="First Name" name="firstName" required
              value={formData.firstName} onChange={handleChange} onBlur={handleBlur} error={errors.firstName} />
            <FormField label="Middle Name" name="middleName"
              value={formData.middleName} onChange={handleChange} onBlur={handleBlur} error={errors.middleName} />
            <FormField label="Last Name" name="lastName" required
              value={formData.lastName} onChange={handleChange} onBlur={handleBlur} error={errors.lastName} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <FormField type="date" label="Date Of Birth" name="dateOfBirth" required
              value={formData.dateOfBirth} onChange={handleChange} onBlur={handleBlur} error={errors.dateOfBirth} />
            <FormField type="radio" label="Gender" name="gender" required options={GENDER_OPTIONS}
              value={formData.gender} onChange={handleChange} error={errors.gender} />
            <FormField type="select" label="Preferred Language" name="preferredLanguage" required options={LANGUAGE_OPTIONS}
              value={formData.preferredLanguage} onChange={handleChange} onBlur={handleBlur} error={errors.preferredLanguage} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <FormField type="select" label="Nationality" name="nationality" required options={NATIONALITY_OPTIONS}
              value={formData.nationality} onChange={handleChange} onBlur={handleBlur} error={errors.nationality} />
            <FormField type="select" label="Religion" name="religion" options={RELIGION_OPTIONS}
              value={formData.religion} onChange={handleChange} onBlur={handleBlur} error={errors.religion} />
          </div>

          {/* ---------------- Contact ---------------- */}
          <SectionHeader title="Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <FormField type="tel" label="Phone Number" name="phoneNumber" required
              value={formData.phoneNumber} onChange={handleChange} onBlur={handleBlur} error={errors.phoneNumber} />
            <FormField type="email" label="Email" name="email" required
              value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
            <FormField label="Emergency Contact" name="emergencyContactName"
              value={formData.emergencyContactName} onChange={handleChange} onBlur={handleBlur} error={errors.emergencyContactName} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <FormField type="select" label="Relationship" name="emergencyContactRelationship" options={RELATIONSHIP_OPTIONS}
              value={formData.emergencyContactRelationship} onChange={handleChange} onBlur={handleBlur} error={errors.emergencyContactRelationship} />
          </div>

          {/* ---------------- Address ---------------- */}
          <SectionHeader title="Address" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <FormField type="select" label="Country" name="country" required options={COUNTRY_OPTIONS}
              value={formData.country} onChange={handleChange} onBlur={handleBlur} error={errors.country} />
            <FormField label="City" name="city" required
              value={formData.city} onChange={handleChange} onBlur={handleBlur} error={errors.city} />
          </div>
          <div className="mb-8">
            <FormField label="Street Address" name="streetAddress" required
              value={formData.streetAddress} onChange={handleChange} onBlur={handleBlur} error={errors.streetAddress} />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <div className="h-px bg-gray-200 mt-2" />
    </div>
  );
}
