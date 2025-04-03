import React from "react";
import { Faction } from "@/services/gameService";

interface FactionFormFieldsProps {
  faction: Partial<Faction>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isLoading?: boolean;
}

export default function FactionFormFields({
  faction,
  onChange,
  isLoading = false,
}: FactionFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Basic Information
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {/* Faction name field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Faction Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={faction._id}
              onChange={onChange}
              placeholder="Enter faction name"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {/* Short description field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Short Description
              <span className="text-xs text-gray-500 ml-2">
                (Brief summary for listings)
              </span>
            </label>
            <input
              type="text"
              name="shortDescription"
              value={faction.shortDescription || ""}
              onChange={onChange}
              placeholder="Brief description of this faction"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-400">
              Used on `About`page for preview.
            </p>
          </div>

          {/* Camo Sample field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Camo Sample
              <span className="text-xs text-gray-500 ml-2">
                (Reference for uniform requirement)
              </span>
            </label>
            <input
              type="text"
              name="camoSample"
              value={faction.camoSample || ""}
              onChange={onChange}
              placeholder="Filename of camo sample image"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter the filename of the camo sample image to be displayed with this faction.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Description */}
      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          Requirements Description
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Full Description
            <span className="text-xs text-gray-500 ml-2">
              (Supports Markdown formatting)
            </span>
          </label>
          <textarea
            name="description"
            value={faction.description || ""}
            onChange={onChange}
            rows={6}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
            placeholder="# Detailed description of the faction&#10;- Background story&#10;- Special abilities&#10;- Purposes"
            disabled={isLoading}
          ></textarea>
          <p className="mt-1 text-xs text-gray-400">
            Used on the About page. Set faction requirements, equipment, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
