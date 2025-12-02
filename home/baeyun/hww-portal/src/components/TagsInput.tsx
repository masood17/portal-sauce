import React, { useState } from "react";
import axios from "axios";
import { Chip } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useSnackbar } from "notistack";

export interface TagsInputProps {
  putUrl: string;
  tags: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TagsInput({ putUrl, tags: _tags, setLoading }: TagsInputProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [tags, setTags] = useState<string[]>(
    (_tags && JSON.parse(_tags)) || []
  );

  const handleTagsChange = (event: any, value: (string | string[])[]) => {
    // setLoading(true);
    axios
      .put(putUrl, {
        tags: JSON.stringify(value),
      })
      .then(async (response) => {
        // setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setTags(value as string[]);
          enqueueSnackbar("Tags updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to update tags.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        // setLoading(false);
        enqueueSnackbar("Failed to update tags.", {
          variant: "error",
        });
      });
  };

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-filled"
        options={[]}
        defaultValue={tags}
        freeSolo
        onChange={handleTagsChange}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              // variant="outlined"
              label={option}
              size="small"
              color="primary"
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Add Tags..."
            // InputProps={{ disableUnderline: true }}
            // onBlur={(e) => {
            //   console.log(e.target);
            //   console.log(params);
            // }}
          />
        )}
      />
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 400,
      "& > * + *": {
        marginTop: theme.spacing(3),
      },
    },
  })
);
