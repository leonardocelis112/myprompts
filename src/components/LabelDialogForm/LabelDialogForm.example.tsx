import React from "react";
import { Button } from "@mui/material";
import { LabelDialogForm } from "./LabelDialogForm";

export const LabelFormExample: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async (data: {
    name: string;
    color: string;
    type: string;
    description?: string;
  }) => {
    console.log("Saved label:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    handleClose();
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Create New Label
      </Button>

      <LabelDialogForm
        open={open}
        title="Create New Label"
        onClose={handleClose}
        onSave={handleSave}
        saveButtonText="Create"
        initialData={{
          name: "",
          color: "#6366F1",
          type: "tag",
          description: "",
        }}
      />
    </>
  );
};
