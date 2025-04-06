"use client";
import { RegistrationInfo } from "@/services/gameService";

// Define the mixed event type
type MixedChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  | { target: { name: string; value: any } };

interface RegistrationInfoFieldsProps {
  regInfo: RegistrationInfo;
  onChange: (e: MixedChangeEvent) => void;
  isLoading?: boolean;
}

export default function RegistrationInfoFields({
  regInfo,
  onChange,
  isLoading = false,
}: RegistrationInfoFieldsProps) {
  // Helper function to handle regInfo field changes
  const handleRegInfoChange = (field: string, value: string) => {
    const updatedRegInfo = {
      ...regInfo,
      [field]: value,
    };

    const syntheticEvent = {
      target: {
        name: "regInfo",
        value: updatedRegInfo,
      },
    };

    onChange(syntheticEvent);
  };

  return (
    <>
      <h3 className="text-lg font-medium text-blue-500 mb-4">
        Registration Info
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Registration Link
          </label>
          <input
            type="url"
            value={regInfo.link || ""}
            onChange={(e) =>
              handleRegInfoChange("link", e.target.value)
            }
            className="w-full input-class"
            disabled={isLoading}
            placeholder="https://..."
          />
        </div>

        <div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Registration Details (Markdown)
        </label>
        <textarea
          value={regInfo.details || ""}
          onChange={(e) =>
            handleRegInfoChange("details", e.target.value)
          }
          rows={3}
          className="w-full input-class"
          disabled={isLoading}
          placeholder="Extra details about registration..."
        ></textarea>
      </div>
    </>
  );
}