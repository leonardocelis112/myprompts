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

interface LabelFormData {
  name: string;
  color: string;
  description?: string;
  type: "category" | "tag" | "status";
}

interface LabelDialogFormProps {
  open: boolean;
  title: string;
  initialData?: LabelFormData;
  onClose: () => void;
  onSave: (data: LabelFormData) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short")
    .max(30, "Name is too long")
    .required("Name is required"),
  color: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .required("Color is required"),
  description: Yup.string().max(200, "Description is too long"),
  type: Yup.string()
    .oneOf(["category", "tag", "status"], "Invalid type")
    .required("Type is required"),
});

const labelTypes = [
  { value: "category", label: "Category" },
  { value: "tag", label: "Tag" },
  { value: "status", label: "Status" },
];

export const LabelDialogForm: React.FC<LabelDialogFormProps> = ({
  open,
  title,
  initialData = { name: "", color: "#000000", type: "tag", description: "" },
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
                  name="type"
                  select
                  label="Type"
                  fullWidth
                  value={values.type}
                  onChange={handleChange}
                  error={touched.type && Boolean(errors.type)}
                  helperText={touched.type && errors.type}
                  required
                >
                  {labelTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="color"
                  label="Color"
                  fullWidth
                  type="color"
                  value={values.color}
                  onChange={handleChange}
                  error={touched.color && Boolean(errors.color)}
                  helperText={touched.color && errors.color}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
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
