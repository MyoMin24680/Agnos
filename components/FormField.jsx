"use client";

export default function FormField({
  type = "text",
  label,
  name,
  value,
  onChange,
  onBlur,
  required = false,
  error,
  options = [],
}) 
{
  const baseInputClasses =
    "peer w-full h-12 px-3 pt-4 pb-1 text-sm text-black bg-white border rounded-lg outline-none transition-colors " +
    "placeholder-transparent focus:ring-1 " +
    (error
      ? "border-red-400 focus:border-red-500 focus:ring-red-400"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-400");

  const floatingLabelClasses =
    "absolute left-3 top-1 text-xs transition-all pointer-events-none " +
    "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 " +
    "peer-focus:top-1 peer-focus:text-xs " +
    (error ? "text-red-500 peer-focus:text-red-500" : "text-gray-500 peer-focus:text-blue-500");

  // --- Radio group (e.g. Gender) ---
  if (type === "radio") {
    return (
      <div className="w-full">
        <p className="text-xs text-gray-500 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
        <div className="flex items-center gap-4 h-12 px-1">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(name, e.target.value)}
                className="w-4 h-4 accent-black cursor-pointer"
              />
              {opt}
            </label>
          ))}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  // --- Select dropdown ---
  if (type === "select") {
    return (
      <div className="w-full relative">
        <select
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur && onBlur(name)}
          className={
            "w-full h-12 px-3 text-sm bg-white border rounded-lg outline-none appearance-none focus:ring-1 " +
            (error
              ? "border-red-400 focus:border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-400") +
            (value ? " text-gray-900" : " text-gray-400")
          }
        >
          <option value="" disabled>
            {label} {required ? "*" : "(Optional)"}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-gray-900">
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
          ▼
        </span>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  // --- Default: text / date / email / tel with floating label ---
  return (
    <div className="w-full relative">
      <input
  type={type}
  name={name}
  value={value || ""}
  placeholder=" "
  autoComplete="off" 
  onChange={(e) => onChange(name, e.target.value)}
  onAnimationStart={(e) => {
    if (e.animationName === "onAutoFillStart") {
      onChange(name, e.target.value); // autofill ဖြစ်တဲ့အခါ value ကို force sync
    }
  }}
  onBlur={() => onBlur && onBlur(name)}
  className={baseInputClasses}
/>
      <label className={floatingLabelClasses}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
