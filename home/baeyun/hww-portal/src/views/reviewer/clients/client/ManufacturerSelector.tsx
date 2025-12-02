import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Manufacturer } from "../../common/types";

interface ManufacturerSelectorProps {
  defaultValue?: string | null;
  onSelect: (value: Manufacturer) => void;
}

export default function ManufacturerSelector({
  defaultValue,
  onSelect,
}: ManufacturerSelectorProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Manufacturer[]>([]);
  const loading = open && options.length === 0;

  const handleChange = (event: any) => {
    onSelect(event.target.value);
  };

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      axios
        .post(`/api/manufacturers`)
        .then(async (response) => {
          if (response.status == 200 || response.status == 201) {
            console.log(response.data);
            if (active) setOptions(response.data as Manufacturer[]);
          } else {
            console.error(response);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      freeSolo
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event: any, newValue: string | Manufacturer | null) => {
        onSelect(newValue as Manufacturer);
      }}
      defaultValue={{ name: defaultValue as string }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label="Raw Material Manufacturer Name"
            name="manufacturer_name"
            variant="outlined"
            required
            onChange={handleChange}
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
        );
      }}
    />
  );
}
