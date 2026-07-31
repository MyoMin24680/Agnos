"use client";

import { useEffect, useRef, useState } from "react";
import GradientPanel from "./GradientPanel";
import { pusherClient, CHANNEL_NAME, EVENT_FIELD_UPDATE, EVENT_STATUS_UPDATE } from "@/lib/pusher";

const FIELD_GROUPS = [
  {
    title: "Personal Detail",
    fields: [
      { key: "firstName", label: "First Name" },
      { key: "middleName", label: "Middle Name" },
      { key: "lastName", label: "Last Name" },
      { key: "dateOfBirth", label: "Date Of Birth" },
      { key: "gender", label: "Gender" },
      { key: "preferredLanguage", label: "Preferred Language" },
      { key: "nationality", label: "Nationality" },
      { key: "religion", label: "Religion" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "phoneNumber", label: "Phone Number" },
      { key: "email", label: "Email" },
      { key: "emergencyContactName", label: "Emergency Contact" },
      { key: "emergencyContactRelationship", label: "Relationship" },
    ],
  },
  {
    title: "Address",
    fields: [
      { key: "country", label: "Country" },
      { key: "city", label: "City" },
      { key: "streetAddress", label: "Street Address" },
    ],
  },
];

const STATUS_STYLES = {
  filling: { label: "Actively filling", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  inactive: { label: "Inactive", dot: "bg-gray-400", bg: "bg-gray-100", text: "text-gray-600" },
  submitted: { label: "Submitted", dot: "bg-green-500", bg: "bg-green-50", text: "text-green-700" },
  idle: { label: "Waiting for patient", dot: "bg-gray-300", bg: "bg-gray-100", text: "text-gray-500" },
};

export default function StaffView() {
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("idle");
  const [activeField, setActiveField] = useState(null); // field currently being typed (bonus real-time indicator)
  const activeFieldTimer = useRef(null);

  useEffect(() => {
    const channel = pusherClient.subscribe(CHANNEL_NAME);

    channel.bind(EVENT_FIELD_UPDATE, (data) => {
      // Handles both single-field updates and the final full snapshot on submit
      if (data.fieldName) {
        setValues((prev) => ({ ...prev, [data.fieldName]: data.value }));
        setActiveField(data.fieldName);

        if (activeFieldTimer.current) clearTimeout(activeFieldTimer.current);
        activeFieldTimer.current = setTimeout(() => setActiveField(null), 1500);
      } else {
        setValues((prev) => ({ ...prev, ...data }));
      }
    });

    channel.bind(EVENT_STATUS_UPDATE, (data) => {
      setStatus(data.status);
    });

    return () => {
      pusherClient.unsubscribe(CHANNEL_NAME);
    };
  }, []);

  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.idle;

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <GradientPanel />

      <div className="bg-white px-5 py-8 sm:px-10 lg:px-14 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">Staff View</h1>
          <span className={"flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full " + statusStyle.bg + " " + statusStyle.text}>
            <span className={"w-1.5 h-1.5 rounded-full " + statusStyle.dot} />
            {statusStyle.label}
          </span>
        </div>

        {FIELD_GROUPS.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">{group.title}</p>
            <div className="h-px bg-gray-200 mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.fields.map((field) => (
                <ReadOnlyField
                  key={field.key}
                  label={field.label}
                  value={values[field.key]}
                  isActive={activeField === field.key}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value, isActive }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className={
          "text-sm px-3 py-2 rounded-lg border min-h-[38px] " +
          (isActive ? "border-amber-500 border-[1.5px]" : "border-gray-200 bg-gray-50") +
          (value ? " text-gray-900" : " text-gray-400")
        }
      >
        {value || "—"}
        {isActive && <span className="opacity-50">|</span>}
      </p>
    </div>
  );
}
