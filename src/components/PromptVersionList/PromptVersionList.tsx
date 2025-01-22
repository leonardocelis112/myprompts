import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PromptVersion } from "../../../db";
import StarIcon from "@mui/icons-material/Star";
interface PromptVersionListProps {
  versions: PromptVersion[];
  onVersionSelect: (version: PromptVersion) => void;
}

export const PromptVersionList: React.FC<PromptVersionListProps> = ({
  versions,
  onVersionSelect,
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Prompt Versions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {versions.length > 0 ? (
            versions.map((version) => (
              <ListItemButton
                key={version.id}
                onClick={() => onVersionSelect(version)}
              >
                <ListItemIcon>
                  <IconButton>
                    <Badge badgeContent={version.score} color="primary">
                      <StarIcon />
                    </Badge>
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary={`v${version.version} - ${new Date(
                    version.createdAt
                  ).toLocaleDateString()} - ${version.comments || ""}`}
                />
              </ListItemButton>
            ))
          ) : (
            <ListItem>No versions created</ListItem>
          )}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
