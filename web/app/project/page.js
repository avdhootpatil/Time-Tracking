"use client";

import { WithAuthentication } from "@/lib/components/auth";
import DeleteConfirmDialog from "@/lib/components/deleteConfirmDialog";
import { ProjectModal } from "@/lib/components/modal";
import ProjectTable from "@/lib/components/table/ProjectTable";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { deleteProject, getProjectList } from "@/lib/services/project";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ProjectPage() {
  const [projects, setProjects] = useState(null);
  const [user, setUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectId, setProjectId] = useState(0);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  useEffect(() => {
    (async () => {
      let user = getUserFromLocalStorage();
      if (user) {
        setUser(user);
        await getPaginatedProjects(1, PAGE_SIZE, user.token);
      }
    })();
  }, []);

  const getPaginatedProjects = async (page, pageSize, token) => {
    let response = await getProjectList(page, pageSize, token);
    if (response.status === "success") {
      setProjects(response.data);
    } else {
      toast.error("Unable to get projects.");
    }
  };

  const handleAdd = () => {
    setProjectId(0);
    setIsModalOpen(true);
  };

  const handleEdit = (index) => (event) => {
    let project = projects?.items[index];
    setProjectId(project?.id);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => async (event) => {
    if (isDeleteModalOpen) {
      let project = projects["items"][index];

      let response = await deleteProject(project?.id || 0, user.token);
      if (response.status === "success") {
        toast.success("Client deleted successfully.");
        await getPaginatedProjects(page, PAGE_SIZE, user.token);
      } else {
        toast.error("Unable to delete Daily Calculation");
      }
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(true);
      setCurrentIndex(index);
    }
  };

  const handlePageChange = async (event, value) => {
    setPage(value);
    await getPaginatedProjects(value, PAGE_SIZE, user.token);
  };

  const handleCloseModal = async (isSaved) => {
    if (isSaved) {
      await getPaginatedProjects(page, PAGE_SIZE, user.token);
    }

    setIsModalOpen(false);
    setProjectId(0);
  };

  return (
    <div>
      <ProjectTable
        projects={projects?.items || []}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={false}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          page={page}
          count={projects?.totalPages}
          onChange={handlePageChange}
          variant="outlined"
          sx={{ marginTop: 3, marginBottom: 2 }}
        />
      </div>

      <ProjectModal
        projectId={projectId}
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

export default WithAuthentication(ProjectPage);
