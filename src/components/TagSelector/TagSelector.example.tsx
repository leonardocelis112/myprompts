import React from "react";
import { TagSelector } from "./TagSelector";
import { Box, Typography } from "@mui/material";

export const TagSelectorExample: React.FC = () => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const handleTagChange = (newTags: string[]) => {
    setSelectedTags(newTags);
    console.log("Selected tags:", newTags);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Tags
      </Typography>
      <TagSelector selectedTags={selectedTags} onChange={handleTagChange} />
    </Box>
  );
};
