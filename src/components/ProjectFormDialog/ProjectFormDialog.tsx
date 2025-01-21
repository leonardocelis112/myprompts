import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

interface ProjectFormData {
  name: string;
  description: string;
  [key: string]: any; // For additional custom fields
}

interface ProjectFormDialogProps {
  open: boolean;
  title: string;
  initialData?: ProjectFormData;
  onClose: () => void;
  onSave: (data: ProjectFormData) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .required("Name is required"),
  description: Yup.string().max(500, "Description is too long"),
});

export const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  open,
  title,
  initialData = { name: "", description: "" },
  onClose,
  onSave,
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={values.description}
                  onChange={handleChange}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
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
