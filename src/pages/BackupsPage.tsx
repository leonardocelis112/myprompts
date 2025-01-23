import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/material";
import { BackupManager } from "../components/BackupManager/BackupManager";

export default function BackupsPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Backup & Restore
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your database backups and restorations
        </Typography>
        <BackupManager />
      </Box>
    </Container>
  );
}
