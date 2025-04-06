"use client";

import { useState, useEffect } from "react";
import { RegistrationInfo } from "@/services/gameService";

interface RegistrationInfoEditorProps {
  regInfo?: RegistrationInfo;
  onChange: (regInfo: RegistrationInfo) => void;
}

export default function RegistrationInfoEditor({
  regInfo,
  onChange,
}: RegistrationInfoEditorProps) {
  // Form field states
  const [link, setLink] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [status, setStatus] = useState<"not-open" | "open" | "closed">(
    "not-open"
  );

  // Initialize form when registration data changes
  useEffect(() => {
    if (regInfo) {
      setLink(regInfo.link || "");
      setDetails(regInfo.details || "");
      setStatus(regInfo.status || "not-open");
    }
  }, [regInfo]);

  // Process changes and update parent component
  const handleChange = (
    field: "link" | "details" | "status",
    value: string
  ) => {
    const updatedRegInfo: RegistrationInfo = {
      link: field === "link" ? value || null : link || null,
      details: field === "details" ? value : details || "",
      status:
        field === "status" ? (value as "not-open" | "open" | "closed") : status,
    };

    onChange(updatedRegInfo);
  };

  return (
    <div className="space-y-4 bg-gray-700 p-4 rounded-lg">
      {/* Registration Link (optional) */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-200">
          Registration Link
          <span className="text-xs font-normal text-gray-400 ml-1">
            (optional)
          </span>
        </label>
        <input
          type="url"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            handleChange("link", e.target.value);
          }}
          placeholder="https://example.com/register"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1">
          Leave empty if registration is handled directly on the site
        </p>
      </div>

      {/* Additional Details */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-200">
          Additional Details (supports Markdown)
        </label>
        <textarea
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
            handleChange("details", e.target.value);
          }}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          rows={4}
          placeholder="Additional registration information..."
        ></textarea>
      </div>
    </div>
  );
}
