"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Faction } from "@/services/gameService";
import { adminApi } from "@/utils/api";
import AdminLayout from "@/app/admin/components/AdminLayout";
import AuthRequired from "../components/AuthRequired";
import useAdminAuth from "@/hooks/useAdminAuth";
import EditFactionModal from "./components/EditFractionModal";
import CreateFactionModal from "./components/CreateFractionModal";
import FactionList from "./components/FractionList";

export default function FactionsManagement() {
  const { token, logout, message, isError, setMessage, setIsError } =
    useAdminAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [editingFaction, setEditingFaction] = useState<Faction | null>(null);
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
      setFactions(response);
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
  const openEditModal = (faction: Faction) => {
    setEditingFaction({ ...faction });
    setIsEditModalOpen(true);
  };

  // Delete a faction
  const deleteFaction = async (factionId: string) => {
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
      await adminApi.deleteFaction(factionId);

      setMessage("Faction deleted successfully!");

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
  const handleFactionCreated = async () => {
    setIsCreateModalOpen(false);
    await fetchFactions();
    setMessage("Faction created successfully!");
  };

  // Handle successful faction update
  const handleFactionUpdated = async (updatedFaction: Faction) => {
    setFactions((prev) =>
      prev.map((f) => (f._id === updatedFaction._id ? updatedFaction : f))
    );
    setIsEditModalOpen(false);
    setEditingFaction(null);
    setMessage("Faction updated successfully!");
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
            Create New Faction
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

        {/* Faction listing */}
        <FactionList
          factions={factions}
          isLoading={isLoading}
          onEditFaction={openEditModal}
          onDeleteFaction={deleteFaction}
        />

        {/* Create Faction Modal */}
        {isCreateModalOpen && (
          <CreateFactionModal
            onClose={() => setIsCreateModalOpen(false)}
            onFactionCreated={handleFactionCreated}
            onError={(errorMessage) => {
              setIsError(true);
              setMessage(errorMessage);
            }}
          />
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingFaction && (
          <EditFactionModal
            faction={editingFaction}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingFaction(null);
            }}
            onFactionUpdated={handleFactionUpdated}
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
