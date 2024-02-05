"use client";

import { WithAuthentication } from "@/lib/components/auth";
import DeleteConfirmDialog from "@/lib/components/deleteConfirmDialog";
import { ClientModal } from "@/lib/components/modal";
import ClientTable from "@/lib/components/table/ClientTable";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { deleteClient, getClientList } from "@/lib/services/client";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ClientPage() {
  const [clients, setClients] = useState(null);
  const [user, setUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientId, setClientId] = useState(0);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  useEffect(() => {
    (async () => {
      let user = getUserFromLocalStorage();

      if (user) {
        setUser(user);
        await getPaginatedClients(1, PAGE_SIZE, user.token);
      }
    })();
  }, []);

  const getPaginatedClients = async (page, pageSize, token) => {
    let response = await getClientList(page, pageSize, token);
    if (response.status === "success") {
      setClients(response.data);
    } else {
      toast.error("Unable to get clients.");
    }
  };

  const handleAdd = () => {
    setClientId(0);
    setIsModalOpen(true);
  };

  const handleEdit = (index) => (event) => {
    let client = clients?.items[index];
    setClientId(client?.id);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => async (event) => {
    if (isDeleteModalOpen) {
      let client = clients["items"][index];

      let response = await deleteClient(client?.id || 0, user.token);
      if (response.status === "success") {
        toast.success("Client deleted successfully.");
        await getPaginatedClients(page, PAGE_SIZE, user.token);
      } else {
        toast.error(response.errors);
      }
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(true);
      setCurrentIndex(index);
    }
  };

  const handlePageChange = async (event, value) => {
    setPage(value);
    await getPaginatedClients(value, PAGE_SIZE, user.token);
  };

  const handleCloseModal = async (isSaved) => {
    if (isSaved) {
      await getPaginatedClients(page, PAGE_SIZE, user.token);
    }

    setIsModalOpen(false);
    setClientId(0);
  };

  return (
    <div className="page-container">
      <ClientTable
        clients={clients?.items || []}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={false}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          page={page}
          count={clients?.totalPages}
          onChange={handlePageChange}
          variant="outlined"
          sx={{ marginTop: 3, marginBottom: 2 }}
        />
      </div>

      <ClientModal
        clientId={clientId}
        closeModal={handleCloseModal}
        isModalOpen={isModalOpen}
      />

      <DeleteConfirmDialog
        open={isDeleteModalOpen}
        onCancel={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        currentIndex={currentIndex}
      />
    </div>
  );
}

export default WithAuthentication(ClientPage);
