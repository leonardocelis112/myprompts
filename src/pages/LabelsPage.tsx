import * as React from "react";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { LabelDialogForm } from "../components/LabelDialogForm/LabelDialogForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { db, Label } from "../../db";
import { toast } from "sonner";

export default function LabelsPage() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [labels, setLabels] = React.useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = React.useState<Label | null>(null);

  const handleOpenDialog = () => {
    setSelectedLabel(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLabel(null);
  };

  React.useEffect(() => {
    db.labels.toArray().then((labels) => {
      setLabels(labels);
    });
  }, []);

  const handleSave = async (data: {
    name: string;
    color: string;
    type: "category" | "tag" | "status";
    description?: string;
  }) => {
    try {
      if (selectedLabel) {
        // Update existing label
        const updatedLabel = {
          ...selectedLabel,
          ...data,
          updatedAt: new Date(),
        };
        await db.labels.update(selectedLabel.id, updatedLabel);
        setLabels(
          labels.map((label) =>
            label.id === selectedLabel.id ? updatedLabel : label
          )
        );
        toast.success("Label updated");
      } else {
        // Create new label
        const newLabel = {
          id: crypto.randomUUID(),
          name: data.name,
          color: data.color,
          type: data.type,
          description: data.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await db.labels.add(newLabel);
        setLabels([...labels, newLabel]);
        toast.success("Label created");
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(
        selectedLabel ? "Error updating label" : "Error creating label"
      );
      console.error("Error saving label:", error);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    try {
      await db.labels.delete(id);
      setLabels(labels.filter((label) => label.id !== id));
      toast.success("Label deleted");
    } catch (error) {
      toast.error("Error deleting label");
      console.error("Error deleting label:", error);
    }
  };

  const handleEditLabel = (label: Label) => {
    setSelectedLabel(label);
    setOpenDialog(true);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Create Label
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Label List</Typography>
        <List>
          {labels.map((label) => (
            <ListItem
              key={label.id}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditLabel(label)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteLabel(label.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={label.name}
                      size="small"
                      style={{
                        backgroundColor: label.color,
                        color: "#fff",
                      }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      ({label.type})
                    </Typography>
                  </Box>
                }
                secondary={label.description}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <LabelDialogForm
        open={openDialog}
        title={selectedLabel ? "Edit Label" : "Create New Label"}
        onClose={handleCloseDialog}
        onSave={handleSave}
        initialData={
          selectedLabel
            ? {
                name: selectedLabel.name,
                color: selectedLabel.color,
                type: selectedLabel.type,
                description: selectedLabel.description,
              }
            : undefined
        }
        saveButtonText={selectedLabel ? "Update" : "Create"}
      />
    </>
  );
}
