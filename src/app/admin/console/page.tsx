"use client";
import AdminLayout from "@/app/admin/components/AdminLayout";
import AuthRequired from "../components/AuthRequired";
import useAdminAuth from "@/hooks/useAdminAuth";
import AgentChat from "../components/AgentChat";

export default function AdminConsole() {
  const { token, userEmail, logout, message, isError, setMessage, setIsError } =
    useAdminAuth();

  // If not authenticated, show login prompt
  if (!token) {
    return <AuthRequired />;
  }

  // Main admin console UI
  return (
    <AdminLayout>
      <div className="py-8 px-4 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">
          Outdated page, use Games page instead
        </h1>

        <AgentChat />
      </div>
    </AdminLayout>
  );
}
