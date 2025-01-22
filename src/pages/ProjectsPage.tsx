import * as React from "react";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ProjectFormDialog } from "../components/ProjectFormDialog/ProjectFormDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { db, Project } from "../../db";
import { toast } from "sonner";

export default function ProjectsPage() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );

  const handleOpenDialog = () => {
    setSelectedProject(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
  };

  React.useEffect(() => {
    db.projects.toArray().then((projects) => {
      setProjects(projects);
    });
  }, []);

  const handleSave = async (data: { name: string; description: string }) => {
    try {
      if (selectedProject) {
        // Update existing project
        const updatedProject = {
          ...selectedProject,
          ...data,
          updatedAt: new Date(),
        };
        await db.projects.update(selectedProject.id, updatedProject);
        setProjects(
          projects.map((project) =>
            project.id === selectedProject.id ? updatedProject : project
          )
        );
        toast.success("Project updated");
      } else {
        // Create new project
        const newProject = {
          id: crypto.randomUUID(),
          name: data.name,
          description: data.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await db.projects.add(newProject);
        setProjects([...projects, newProject]);
        toast.success("Project created");
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(
        selectedProject ? "Error updating project" : "Error creating project"
      );
      console.error("Error saving project:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await db.projects.delete(id);
      setProjects(projects.filter((project) => project.id !== id));
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Error deleting project");
      console.error("Error deleting project:", error);
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Create Project
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Project List</Typography>
        <List>
          {projects.map((project) => (
            <ListItem
              key={project.id}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditProject(project)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={project.name}
                secondary={project.description}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <ProjectFormDialog
        open={openDialog}
        title={selectedProject ? "Edit Project" : "Create New Project"}
        onClose={handleCloseDialog}
        onSave={handleSave}
        initialData={
          selectedProject
            ? {
                name: selectedProject.name,
                description: selectedProject.description,
              }
            : undefined
        }
        saveButtonText={selectedProject ? "Update" : "Create"}
      />
    </>
  );
}
