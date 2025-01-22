import React from "react";
import { Button } from "@mui/material";
import { PromptDialogForm } from "./PromptDialogForm";
import { Project } from "../../../db";

export const PromptFormExample: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  // Example projects - in real usage, these would come from your database
  const sampleProjects: Project[] = [
    {
      id: "1",
      name: "Project 1",
      description: "Description 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Project 2",
      description: "Description 2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async (data: {
    name: string;
    objective: string;
    projectId: string;
  }) => {
    console.log("Saved prompt:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    handleClose();
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Create New Prompt
      </Button>

      <PromptDialogForm
        open={open}
        title="Create New Prompt"
        onClose={handleClose}
        onSave={handleSave}
        projects={sampleProjects}
        saveButtonText="Create"
        initialData={{
          name: "",
          objective: "",
          projectId: "",
        }}
      />
    </>
  );
};
