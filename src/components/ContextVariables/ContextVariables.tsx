import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Box,
  Stack,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "sonner";

interface ContextVariable {
  key: string;
  value: string;
}

interface ContextVariablesProps {
  variables: ContextVariable[];
  content: string;
  onChange: (variables: ContextVariable[]) => void;
}

export const ContextVariables: React.FC<ContextVariablesProps> = ({
  content,
}) => {
  const [variables, setVariables] = React.useState<ContextVariable[]>([]);

  const handleVariableChange = (
    index: number,
    field: "value",
    newValue: string
  ) => {
    const newVariables = variables.map((variable, i) =>
      i === index ? { ...variable, [field]: newValue } : variable
    );

    setVariables(newVariables);
  };

  React.useEffect(() => {
    const extractVariables = (content: string) => {
      const regex = /{{(.*?)}}/g;
      const matches = content.match(regex);
      if (matches) {
        const newVariables = matches.map((match) => ({
          key: match.replace(/{{|}}/g, "").trim(),
          value: "",
        }));
        setVariables(newVariables);
      }
    };

    extractVariables(content);
  }, [content]);

  const handleEmbed = () => {
    const embeddedContent = variables.reduce((acc, variable) => {
      const regex = new RegExp(`{{${variable.key}}}`, "g");
      return acc.replace(regex, variable.value);
    }, content);

    navigator.clipboard
      .writeText(embeddedContent)
      .then(() => {
        console.log("Content copied to clipboard:", embeddedContent);
        toast.success("Embedded content copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy content to clipboard.");
      });
  };

  return (
    <Accordion expanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="context-variables-content"
        id="context-variables-header"
      >
        <Typography>Context Variables</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          {variables.map((variable, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                label={`${variable.key} (Value)`}
                size="small"
                onChange={(e) =>
                  handleVariableChange(index, "value", e.target.value)
                }
                sx={{ flex: 2 }}
              />
            </Box>
          ))}
          <Button variant="contained" color="primary" onClick={handleEmbed}>
            Embed and copy to clipboard
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
