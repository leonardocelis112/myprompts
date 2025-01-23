import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Project, Label } from "../../../db";
import { TagSelector } from "../TagSelector/TagSelector";

interface PromptFiltersProps {
  projects: Project[];
  searchProject: string;
  searchLabels: string[];
  onProjectChange: (projectId: string) => void;
  onLabelsChange: (labelIds: string[]) => void;
}

export const PromptFilters: React.FC<PromptFiltersProps> = ({
  projects,
  searchProject,
  searchLabels,
  onProjectChange,
  onLabelsChange,
}) => {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Project</InputLabel>
        <Select
          value={searchProject}
          label="Project"
          onChange={(e) => onProjectChange(e.target.value)}
        >
          <MenuItem value="">All Projects</MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ flexGrow: 1 }}>
        <TagSelector selectedTags={searchLabels} onChange={onLabelsChange} />
      </Box>
    </Stack>
  );
};
