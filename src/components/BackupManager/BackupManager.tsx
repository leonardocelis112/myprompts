import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import BackupIcon from "@mui/icons-material/Backup";
import RestoreIcon from "@mui/icons-material/Restore";
import { BackupService } from "../../services/BackupService";
import { toast } from "sonner";

export const BackupManager: React.FC = () => {
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false);
  const backupService = React.useMemo(() => new BackupService(), []);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateBackup = async () => {
    try {
      await backupService.createBackup();
      toast.success("Backup created successfully");
    } catch (error) {
      toast.error("Failed to create backup");
      console.error("Backup creation failed:", error);
    }
  };

  const handleRestoreClick = () => {
    setIsRestoreDialogOpen(true);
  };

  const handleRestoreCancel = () => {
    setIsRestoreDialogOpen(false);
  };

  const handleRestoreConfirm = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await backupService.restoreBackup(file);
      toast.success("Backup restored successfully");
      setIsRestoreDialogOpen(false);
    } catch (error) {
      toast.error("Failed to restore backup");
      console.error("Backup restoration failed:", error);
    }

    // Reset file input
    event.target.value = "";
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Database Backup
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Create a backup of your database or restore from a previous
                backup.
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<BackupIcon />}
                onClick={handleCreateBackup}
              >
                Create Backup
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestoreIcon />}
                onClick={handleRestoreClick}
                color="warning"
              >
                Restore Backup
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Hidden file input for restore */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".zip"
        onChange={handleFileSelect}
      />

      {/* Restore confirmation dialog */}
      <Dialog open={isRestoreDialogOpen} onClose={handleRestoreCancel}>
        <DialogTitle>Restore Backup</DialogTitle>
        <DialogContent>
          <Typography>
            Warning: Restoring a backup will merge the backup data with your
            current database. This action cannot be undone. Are you sure you
            want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestoreCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleRestoreConfirm} color="warning">
            Restore
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
