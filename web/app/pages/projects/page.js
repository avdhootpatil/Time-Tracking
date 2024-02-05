"use client";
import React, { useEffect, useState } from "react";
import ProjectsTable from "../../components/ProjectsTable";
import { Pagination } from "@mui/material";
import ProjectsModal from "../../components/ProjectsModal";
import DeleteModal from "../../components/DeleteModal";
import getProjectsList from "../../services/getProjectsList";
import deleteProject from "../../services/deleteProject";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [projectId, setProjectId] = useState(0);
  const PAGE_SIZE = 10;

  const getProjectsListCall = async (pageNo) => {
    let res = await getProjectsList(pageNo, PAGE_SIZE);
    setPage(res.data.currentPage);
    setProjectsList(res.data);
  };
  useEffect(() => {
    (async () => {
      await getProjectsListCall(1);
    })();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (isSaved) => (e) => {
    if (isSaved) {
      //get list
      getProjectsListCall(page);
      console.log("projectlist updated");
    }

    setOpenDeleteModal(false);
    setOpen(false);
  };

  const handlePageChange = async (event, pageNo) => {
    try {
      await getProjectsListCall(pageNo);
    } catch (error) {
      console.log(error);
    }

    setPage(pageNo);
  };

  const handleDeleteDialog = (projId) => (event) => {
    setProjectId(projId);
    setOpenDeleteModal(true);
  };

  const handleAddProjectDialog = (projId) => (event) => {
    setProjectId(projId);
    handleOpen();
  };

  const handleDeleteProject = async () => {
    try {
      let res = await deleteProject(projectId);
      if (res.status == 200) {
        console.log("data deleted successfully");
        handleClose(true)();
        if (projectsList.pageSize == 1 && page != 1) {
          await getProjectsListCall(page - 1);
        } else {
          await getProjectsListCall(page);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ProjectsTable
        handleOpen={handleOpen}
        handleDeleteDialog={handleDeleteDialog}
        handleAddProjectDialog={handleAddProjectDialog}
        projectsList={projectsList?.items || []}
      />
      <Pagination
        sx={{ float: "right", marginTop: "1rem" }}
        count={projectsList.totalPages}
        page={page}
        onChange={handlePageChange}
      />
      <ProjectsModal
        open={open}
        onClose={handleClose}
        projectId={projectId}
        handleAddProjectDialog={handleAddProjectDialog}
        page={page}
      />
      <DeleteModal
        openDeleteModal={openDeleteModal}
        onClose={handleClose}
        handleDeleteProject={handleDeleteProject}
      />
    </>
  );
}
