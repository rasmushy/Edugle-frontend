import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const DELTE_USER =
  gql(`mutation DeleteUserAsAdmin($deleteUserId: ID!, $user: deleteUserAsAdminInput) {
  deleteUserAsAdmin(deleteUserID: $deleteUserId, user: $user) {
    message
  }
}`);

const AlertDialogSlide = ({
  isOpen,
  userId,
  setUsers,
  userGrid,
  setDeleteUser,
}: any) => {
  const [open, setOpen] = React.useState(isOpen);

    const deleteUserAsAdmin = useQuery(GET_USERS, {
      variables: {
        deleteUserId: "token",
        users: {
          token: token,
        },
      },
      onCompleted: ({ deleteUserAsAdmin }) => {},
    });

  const deleteUserDatabase = async (userId: any) => {};

  const deleteUser = () => {
    if (userId) {
      setUsers(userGrid.filter((row: any) => row.id !== userId));
      setOpen(false);
      setDeleteUser(false);
      deleteUserDatabase(userId);
    }
  };

  const cancelDeleteUser = () => {
    setOpen(false);
    setDeleteUser(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Poista käyttäjä?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Oletko varma että haluat poistaa käyttäjän?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancelDeleteUser()} color="primary">
            Peruuta
          </Button>
          <Button onClick={() => deleteUser()} color="error">
            Poista
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertDialogSlide;
