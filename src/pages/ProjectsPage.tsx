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
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  React.useEffect(() => {
    db.projects.toArray().then((projects) => {
      setProjects(projects);
    });
  }, []);

  const handleSave = async (data: { name: string; description: string }) => {
    try {
      const newProject = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.projects.add(newProject);
      toast.success("Project created");
      handleCloseDialog();
      setProjects([...projects, newProject]);
    } catch (error) {
      toast.error("Error creating project");
      console.error("Error creating project:", error);
    }
  };

  function handleDeleteProject(id: string): void {
    try {
      db.projects.delete(id as never);
      setProjects(projects.filter((project) => project.id !== id));
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Error deleting project");
      console.error("Error deleting project:", error);
    }
  }

  function handleEditProject(id: string): void {
    setOpenDialog(true);
  }

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
                    onClick={() => handleEditProject(project.id)}
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
        title="Create New Project"
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </>
  );
}
