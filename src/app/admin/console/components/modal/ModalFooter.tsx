import React from 'react';

interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  confirmLabel: string;
  confirmIcon: React.ReactNode;
  loadingLabel: string;
  loadingIcon: React.ReactNode;
  confirmColor?: string;
}

export default function ModalFooter({
  onCancel,
  onConfirm,
  isLoading,
  confirmLabel,
  confirmIcon,
  loadingLabel,
  loadingIcon,
  confirmColor = 'bg-green-600 hover:bg-green-700'
}: ModalFooterProps) {
  return (
    <div className="flex gap-3 justify-end mt-6 sticky bottom-0 pt-4 bg-gradient-to-t from-gray-800 to-transparent">
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-md transition-colors flex items-center"
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isLoading}
        className={`${confirmColor} text-white px-6 py-2 rounded-md transition-colors flex items-center
          ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isLoading ? (
          <>
            {loadingIcon}
            {loadingLabel}
          </>
        ) : (
          <>
            {confirmIcon}
            {confirmLabel}
          </>
        )}
      </button>
    </div>
  );
}
