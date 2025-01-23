import React from "react";
import { ContextVariables } from "./ContextVariables";
import { Box, Typography } from "@mui/material";

interface ContextVariable {
  key: string;
  value: string;
}

export const ContextVariablesExample: React.FC = () => {
  const [variables, setVariables] = React.useState<ContextVariable[]>([
    { key: "username", value: "John Doe" },
    { key: "role", value: "developer" },
  ]);

  const handleVariablesChange = (newVariables: ContextVariable[]) => {
    setVariables(newVariables);
    console.log("Updated variables:", newVariables);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Context Variables Example
      </Typography>
      <ContextVariables
        content="Hello, {{username}}! You are a {{role}}."
        variables={variables}
        onChange={handleVariablesChange}
      />
    </Box>
  );
};
