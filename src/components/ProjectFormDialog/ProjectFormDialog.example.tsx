import React from "react";
import { Button } from "@mui/material";
import { ProjectFormDialog } from "./ProjectFormDialog";

export const ProjectFormExample: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = (data: { name: string; description: string }) => {
    console.log("Saved data:", data);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Data saved:", data);
        handleClose();
        resolve(true);
      }, 1000);
    });
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Create New Project
      </Button>

      <ProjectFormDialog
        open={open}
        title="Create New Project"
        onClose={handleClose}
        onSave={handleSave}
        saveButtonText="Create"
        initialData={{
          name: "",
          description: "",
        }}
      />
    </>
  );
};
