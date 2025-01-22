import React from "react";
import { TextField, Button } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { PromptVersion } from "../../../db";
import { Rating } from "@mui/material";
import { toast } from "sonner";

interface PromptVersionFormData {
  content: string;
}

interface PromptVersionFormProps {
  promptId: string;
  currentVersion: number;
  selectedVersion?: PromptVersion;
  onSave: (version: PromptVersion) => void;
}

const validationSchema = Yup.object().shape({
  content: Yup.string()
    .min(10, "Content is too short")
    .max(5000, "Content is too long")
    .required("Content is required"),
});

export const PromptVersionForm: React.FC<PromptVersionFormProps> = ({
  promptId,
  currentVersion,
  selectedVersion,
  onSave,
}) => {
  return (
    <Formik
      initialValues={{
        content: selectedVersion?.content || "",
        comments: selectedVersion?.comments || "",
        score: selectedVersion?.score || 0,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        if (values.score < 1 || values.score > 5) {
          toast.error("Score must be between 1 and 5");
          return;
        }
        try {
          const newVersion: PromptVersion = {
            id: crypto.randomUUID(),
            promptId,
            version: currentVersion + 1,
            content: values.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            comments: values.comments,
            score: values.score,
          };

          await onSave(newVersion);
          resetForm();
        } catch (error) {
          console.error("Error saving version:", error);
        } finally {
          setSubmitting(false);
        }
      }}
      enableReinitialize
    >
      {({ errors, touched, handleChange, values, isSubmitting }) => (
        <Form>
          <TextField
            label="Content"
            name="content"
            value={values.content}
            fullWidth
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            error={touched.content && Boolean(errors.content)}
            helperText={touched.content && errors.content}
            required
          />
          <Rating
            name="score"
            value={values.score}
            onChange={handleChange}
            size="large"
          />
          <TextField
            label="Comments"
            name="comments"
            value={values.comments}
            fullWidth
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Save version
          </Button>
        </Form>
      )}
    </Formik>
  );
};
