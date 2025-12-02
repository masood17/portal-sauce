import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
} from "@material-ui/core";
import { User as UserIcon } from "react-feather";
import LinkOffIcon from '@material-ui/icons/LinkOff';

import { Client, User } from "../../../../views/reviewer/common/types";

export default function LinkedClients() {
    const [loading, setLoading] = useState<boolean>(false); // @TODO true
    const [clients, setClients] = useState<Client[]>([]);

    // useEffect(() => {
    //     axios
    //         .post("/api/clients")
    //         .then(async (response) => {
    //             setLoading(false);
    //             // console.log(response.data);
    //             setClients(response.data.slice(4, 7));
    //         })
    //         .catch((e) => {
    //             // @TODO handle
    //             console.error(e);
    //             setLoading(false);
    //         });
    // }, []);

    return <>
        <Box
            p={3}
            style={{
                height: "calc(100vh - 317px)", overflowX: "auto", display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}
        >
            {(loading && <CircularProgress />) || (<>
                <ClientSelector onChange={(v: User) => setClients([{
                    id: 132,
                    user_id: 378,
                    reviewer_id: 3,
                    updated_at: "2024-04-03T20:53:31.000000Z",
                    facility_count: 0,
                    product_count: 0,
                    business_name: v.name
                } as Client, ...clients])} />
                <Table style={{ marginTop: 10 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>
                                Business Name
                            </TableCell>
                            <TableCell>
                                Owner Name
                            </TableCell>
                            <TableCell align="center">
                                Facilities
                            </TableCell>
                            <TableCell align="center">
                                Products
                            </TableCell>
                            <TableCell>
                                Date Linked
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map((client) => (
                            <ClientItem client={client} />
                        ))}
                    </TableBody>
                </Table>
            </>)}
        </Box>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
            <Button color="secondary" variant="contained" disabled>
                Update
            </Button>
        </Box>
    </>
}

interface ClientSelectorProps {
    defaultValue?: string | null;
    onChange?: (value: User) => void;
}

export function ClientSelector({
    defaultValue,
    onChange,
}: ClientSelectorProps) {
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

        // axios
        //     .post(`/api/login-as/${user.id}`)
        //     .then(async (response) => {
        //         if (response.status == 200 || response.status == 201) {
        //             window.location.href = "/";
        //         } else {
        //             console.error(response);
        //         }
        //     })
        //     .catch((e) => {
        //         console.error(e);
        //     });
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
                onChange && onChange(newValue as User);
            }}
            // @ts-ignore
            defaultValue={{ name: defaultValue as string }}
            // @ts-ignore
            getOptionSelected={(option, value) => option.name === value.name}
            // @ts-ignore
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            size="medium"
            renderInput={(params) => {
                return (
                    // @ts-ignore
                    <TextField
                        {...params}
                        label="Link client"
                        name="link_client"
                        variant="outlined"
                        // onChange={handleChange}
                        InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
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

interface ClientItemProps {
    client: Client;
}

function ClientItem({ client }: ClientItemProps) {
    const navigate = useNavigate();
    const handleRowClick = (id: number) => navigate(`/admin/client/${id}`);

    return (
        <TableRow
            hover
            // @ts-ignore
            key={client.id}
            id={`client-${client.id as number}`}
            // @ts-ignore
            style={{ cursor: "pointer" }}
        >
            <TableCell>
                <UserIcon />
            </TableCell>
            <TableCell onClick={(e) => handleRowClick(client.id as number)}>
                <strong>{client.business_name}</strong>
            </TableCell>
            <TableCell onClick={(e) => handleRowClick(client.id as number)}>
                {client.user && `${client.user.profile.first_name} ${client.user.profile.last_name}`}
            </TableCell>
            <TableCell
                align="center"
                onClick={(e) => handleRowClick(client.id as number)}
            >
                <strong>
                    <Chip label={client.facility_count} />
                </strong>
            </TableCell>
            <TableCell
                align="center"
                onClick={(e) => handleRowClick(client.id as number)}
            >
                <strong>
                    <Chip label={client.product_count} />
                </strong>
            </TableCell>
            <TableCell onClick={(e) => handleRowClick(client.id as number)}>
                {
                    // @ts-ignore
                    moment(client.created_at).format("MM/DD/YY")
                }
            </TableCell>
            <TableCell>
                <Button startIcon={<LinkOffIcon />}>Unlink</Button>
            </TableCell>
        </TableRow>
    );
}
