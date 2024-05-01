import { Typography, Box, Button, Grid } from "@mui/material";
import DraphonyList from "./DraphonyList";
import { useEffect, useState } from "react";
import AddUserDialog from "./UserActionDialog.tsx/AddUserDialog";
import { IUser } from "../../helpers/constants";
import { getUsersByRole } from "../../helpers/fetch";

const PermissionsPage = () => {

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [admins, setAdmins] = useState<IUser[]>();
    const [saleAgents, setSaleAgents] = useState<IUser[]>();


    useEffect(() => {
        const getAdmins = async () => {
            const role = await getUsersByRole("ZMI.GlobalAdmin");
            if (role) setAdmins(role);
        }
        const getSales = async () => {
            const role = await getUsersByRole("ZMI.SaleAgents");
            if (role) setSaleAgents(role);
        }

        getAdmins();
        getSales();
    }, [])

    return (
        <>
            <Box maxWidth="1080px" margin="auto">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="text" onClick={() => { setOpenAddDialog(true) }}>Add user</Button>
                </Box>
                <Box>
                    <Grid container>
                        <Typography mr={1}>Administrator</Typography>
                        <Typography>({admins?.length})</Typography>
                    </Grid>
                    <DraphonyList users={admins} />
                </Box>
                <Box mt={8}>
                    <Grid container>
                        <Typography mr={1}>Sale Agents</Typography>
                        <Typography>({saleAgents?.length})</Typography>
                    </Grid>
                    <DraphonyList users={saleAgents} />
                </Box>
            </Box>
            {openAddDialog && (
                <AddUserDialog
                    onCancel={() => {
                        setOpenAddDialog(false);
                    }}
                    onAccept={() => setOpenAddDialog(false)}
                />
            )}
        </>
    );
};

export default PermissionsPage;
