import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteUserDialog from "./UserActionDialog.tsx/DeleUserDialog";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { IUser } from "../../helpers/constants";
import EditUserDialog from "./UserActionDialog.tsx/EditUserDialog";

type IProps = {
    users?: IUser[];
    hideColumn?: boolean;
}

const DraphonyList = (props: IProps): JSX.Element => {
    const [openEditDialog, setOpenEditDiaLog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDiaLog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser>();

    const handleOpenEditDialog = (user: IUser) => {
        setOpenEditDiaLog(true);
        setSelectedUser(user);
    }

    const handleOpenDeleteDialog = (user: IUser) => {
        setOpenDeleteDiaLog(true);
        setSelectedUser(user);
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            {!props.hideColumn && <TableCell></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.users?.map((user) => (
                            <TableRow
                                key={user.email}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>
                                    <Avatar alt={user.name} src={user.avatar} />
                                </TableCell>
                                <TableCell>
                                    {user.email}
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                {!props.hideColumn &&
                                    (<TableCell>
                                        <Box display={"flex"} justifyContent={"flex-end"}>
                                            <Button onClick={() => handleOpenEditDialog(user)}>
                                                <CreateIcon />
                                            </Button>
                                            <Button onClick={() => handleOpenDeleteDialog(user)}>
                                                <DeleteIcon />
                                            </Button>
                                        </Box>
                                    </TableCell>)
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {openDeleteDialog && (
                <DeleteUserDialog
                    onCancel={() => setOpenDeleteDiaLog(false)}
                    onAccept={() => setOpenDeleteDiaLog(false)}
                    user={selectedUser}
                />
            )}
            {openEditDialog && (
                <EditUserDialog
                    onCancel={() => setOpenEditDiaLog(false)}
                    onAccept={() => setOpenEditDiaLog(false)}
                    user={selectedUser}
                />
            )}
        </>
    );
};

export default DraphonyList;
