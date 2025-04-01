"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Fraction } from "@/services/gameService";
import { adminApi } from "@/utils/api";
import AdminLayout from "@/app/admin/components/AdminLayout";
import FractionList from "./components/FractionList";
import CreateFractionModal from "./components/CreateFractionModal";
import EditFractionModal from "./components/EditFractionModal";
import AuthRequired from "../components/AuthRequired";
import useAdminAuth from "@/hooks/useAdminAuth";

export default function FactionsManagement() {
  const { token, logout, message, isError, setMessage, setIsError } =
    useAdminAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [factions, setFactions] = useState<Fraction[]>([]);
  const [editingFraction, setEditingFraction] = useState<Fraction | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Effect for fetching factions once authenticated
  useEffect(() => {
    if (token) {
      fetchFactions();
    }
  }, [token]);

  // Fetch factions from the server
  const fetchFactions = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getFactions();
      setFactions(response.data);
    } catch (error) {
      console.error("Error fetching factions:", error);
      setIsError(true);
      setMessage("Failed to load factions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Open create faction modal
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Open the edit modal for a faction
  const openEditModal = (faction: Fraction) => {
    setEditingFraction({ ...faction });
    setIsEditModalOpen(true);
  };

  // Delete a faction
  const deleteFraction = async (factionId: string) => {
    if (!token) {
      setIsError(true);
      setMessage("You must be logged in to perform this action");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this faction? This may affect games using this faction."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      await adminApi.deleteFraction(factionId);

      setMessage("Fraction deleted successfully!");

      // Update local state
      const updatedFactions = factions.filter((f) => f._id !== factionId);
      setFactions(updatedFactions);
    } catch (error: any) {
      console.error("Error deleting faction:", error);

      // Extract error message from axios error
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";

      setIsError(true);
      setMessage(`Failed to delete faction: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful faction creation
  const handleFractionCreated = async () => {
    setIsCreateModalOpen(false);
    await fetchFactions();
    setMessage("Fraction created successfully!");
  };

  // Handle successful faction update
  const handleFractionUpdated = async (updatedFraction: Fraction) => {
    setFactions((prev) =>
      prev.map((f) => (f._id === updatedFraction._id ? updatedFraction : f))
    );
    setIsEditModalOpen(false);
    setEditingFraction(null);
    setMessage("Fraction updated successfully!");
  };

  // If not authenticated, show login prompt
  if (!token) {
    return <AuthRequired />;
  }

  return (
    <AdminLayout>
      <div className="py-8 px-4 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Factions Management</h1>
          <button
            onClick={openCreateModal}
            disabled={isLoading}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium
              ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            Create New Fraction
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`p-4 mb-8 rounded ${
              isError
                ? "bg-red-900/50 border border-red-700"
                : "bg-green-900/50 border border-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Fraction listing */}
        <FractionList
          factions={factions}
          isLoading={isLoading}
          onEditFraction={openEditModal}
          onDeleteFraction={deleteFraction}
        />

        {/* Create Fraction Modal */}
        {isCreateModalOpen && (
          <CreateFractionModal
            onClose={() => setIsCreateModalOpen(false)}
            onFractionCreated={handleFractionCreated}
            onError={(errorMessage) => {
              setIsError(true);
              setMessage(errorMessage);
            }}
          />
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingFraction && (
          <EditFractionModal
            faction={editingFraction}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingFraction(null);
            }}
            onFractionUpdated={handleFractionUpdated}
            onError={(errorMessage) => {
              setIsError(true);
              setMessage(errorMessage);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
