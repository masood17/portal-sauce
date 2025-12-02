import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

import { User } from "../views/reviewer/common/types";

interface AuthenticateByUserIdProps {
  defaultValue?: string | null;
}

export default function AuthenticateByUserId({
  defaultValue,
}: AuthenticateByUserIdProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<User[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      axios
        .post(`/api/users`)
        .then(async (response) => {
          if (response.status == 200 || response.status == 201) {
            if (active) setOptions(response.data as User[]);
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

  const handleSelect = (user: User) => {
    if (!user) return;

    axios
      .post(`/api/login-as/${user.id}`)
      .then(async (response) => {
        if (response.status == 200 || response.status == 201) {
          window.location.href = "/";
        } else {
          console.error(response);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Autocomplete
      fullWidth
      freeSolo
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event: any, newValue: string | User | null) => {
        handleSelect(newValue as User);
      }}
      // @ts-ignore
      defaultValue={{ name: defaultValue as string }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      size="small"
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            // label="User Name"
            name="user_name"
            // variant="outlined"
            required
            // onChange={handleChange}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">AS:</InputAdornment>
              ),
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
