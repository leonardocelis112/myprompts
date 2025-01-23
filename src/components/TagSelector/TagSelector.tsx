import React from "react";
import {
  Autocomplete,
  Chip,
  TextField,
  Box,
  AutocompleteRenderInputParams,
  CircularProgress,
} from "@mui/material";
import { Label, db } from "../../../db";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (newTags: string[]) => void;
  error?: boolean;
  helperText?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  error,
  helperText,
}) => {
  const [availableTags, setAvailableTags] = React.useState<Label[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await db.labels.toArray();
        setAvailableTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const selectedLabels = availableTags.filter((tag) =>
    selectedTags.includes(tag.id)
  );

  return (
    <Autocomplete
      multiple
      options={availableTags}
      value={selectedLabels}
      onChange={(_event, newValue) => {
        onChange(newValue.map((tag) => tag.id));
      }}
      getOptionLabel={(option) => option.name}
      loading={loading}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label="Tags"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((tag, index) => (
          <Chip
            key={tag.id}
            label={tag.name}
            {...getTagProps({ index })}
            style={{
              backgroundColor: tag.color,
              color: "#fff",
            }}
          />
        ))
      }
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Chip
            size="small"
            label={option.name}
            style={{
              backgroundColor: option.color,
              color: "#fff",
              marginRight: 8,
            }}
          />
          <span>({option.type})</span>
        </Box>
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
    />
  );
};
