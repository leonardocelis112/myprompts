import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, IconButton } from "@mui/material";
import { PromptDialogForm } from "../components/PromptDialogForm/PromptDialogForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { db, Prompt, Project } from "../../db";
import { toast } from "sonner";
import { ReusableTable } from "../components/Table/Table";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useNavigate } from "react-router";

export default function PromptsPage() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [prompts, setPrompts] = React.useState<Prompt[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedPrompt, setSelectedPrompt] = React.useState<Prompt | null>(
    null
  );
  const navigate = useNavigate();
  const handleOpenDialog = () => {
    setSelectedPrompt(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPrompt(null);
  };

  React.useEffect(() => {
    // Load prompts and projects
    Promise.all([db.prompts.toArray(), db.projects.toArray()]).then(
      ([promptsData, projectsData]) => {
        setPrompts(promptsData);
        setProjects(projectsData);
      }
    );
  }, []);

  const handleSave = async (data: {
    name: string;
    objective: string;
    projectId: string;
  }) => {
    try {
      if (selectedPrompt) {
        // Update existing prompt
        const updatedPrompt = {
          ...selectedPrompt,
          ...data,
          updatedAt: new Date(),
        };
        await db.prompts.update(
          selectedPrompt.id as unknown as never,
          updatedPrompt
        );
        setPrompts(
          prompts.map((prompt) =>
            prompt.id === selectedPrompt.id ? updatedPrompt : prompt
          )
        );
        toast.success("Prompt updated");
      } else {
        // Create new prompt
        const newPrompt = {
          id: crypto.randomUUID(),
          name: data.name,
          objective: data.objective,
          projectId: data.projectId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await db.prompts.add(newPrompt);
        setPrompts([...prompts, newPrompt]);
        toast.success("Prompt created");
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(
        selectedPrompt ? "Error updating prompt" : "Error creating prompt"
      );
      console.error("Error saving prompt:", error);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      await db.prompts.delete(id as unknown as never);
      setPrompts((prevPrompts) =>
        prevPrompts.filter((prompt) => prompt.id !== id)
      );
      toast.success("Prompt deleted");
    } catch (error) {
      toast.error("Error deleting prompt");
      console.error("Error deleting prompt:", error);
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setOpenDialog(true);
  };

  const handleOpenStudio = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    navigate(`/prompts-studio/${prompt.id}`);
  };

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || "Unknown Project";
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "project", label: "Project", minWidth: 130 },
    {
      id: "objective",
      label: "Objective",
      minWidth: 200,
    },
    {
      id: "createdAt",
      label: "Created",
      minWidth: 130,
      align: "right" as const,
      format: (value: Date) => value.toLocaleDateString(),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 100,
      align: "right" as const,
      format: (value: string, row: any) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleOpenStudio(row)}
            color="primary"
          >
            <LibraryBooksIcon />
          </IconButton>
          <IconButton onClick={() => handleEditPrompt(row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeletePrompt(row.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const tableData = prompts.map((prompt) => ({
    ...prompt,
    project: getProjectName(prompt.projectId),
    actions: prompt.id,
  }));

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Create Prompt
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Prompt List
        </Typography>
        <ReusableTable columns={columns} rows={tableData} />
      </Box>
      <PromptDialogForm
        open={openDialog}
        title={selectedPrompt ? "Edit Prompt" : "Create New Prompt"}
        onClose={handleCloseDialog}
        onSave={handleSave}
        projects={projects}
        initialData={
          selectedPrompt
            ? {
                name: selectedPrompt.name,
                objective: selectedPrompt.objective,
                projectId: selectedPrompt.projectId,
              }
            : undefined
        }
        saveButtonText={selectedPrompt ? "Update" : "Create"}
      />
    </>
  );
}
