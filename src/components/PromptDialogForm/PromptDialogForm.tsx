import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Project } from "../../../db";

interface PromptFormData {
  name: string;
  objective: string;
  projectId: string;
}

interface PromptDialogFormProps {
  open: boolean;
  title: string;
  initialData?: PromptFormData;
  projects: Project[];
  onClose: () => void;
  onSave: (data: PromptFormData) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .required("Name is required"),
  objective: Yup.string()
    .min(10, "Objective is too short")
    .max(500, "Objective is too long")
    .required("Objective is required"),
  projectId: Yup.string().required("Project is required"),
});

export const PromptDialogForm: React.FC<PromptDialogFormProps> = ({
  open,
  title,
  initialData = { name: "", objective: "", projectId: "" },
  projects,
  onClose,
  onSave,
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Formik
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSave(values);
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ errors, touched, handleChange, values, isSubmitting }) => (
          <Form>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  autoFocus
                  name="name"
                  label="Name"
                  fullWidth
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  required
                />
                <TextField
                  name="projectId"
                  select
                  label="Project"
                  fullWidth
                  value={values.projectId}
                  onChange={handleChange}
                  error={touched.projectId && Boolean(errors.projectId)}
                  helperText={touched.projectId && errors.projectId}
                  required
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="objective"
                  label="Objective"
                  fullWidth
                  multiline
                  rows={3}
                  value={values.objective}
                  onChange={handleChange}
                  error={touched.objective && Boolean(errors.objective)}
                  helperText={touched.objective && errors.objective}
                  required
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="inherit">
                {cancelButtonText}
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {saveButtonText}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
