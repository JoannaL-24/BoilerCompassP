import React, { useState } from "react";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteUser } from "firebase/auth";

import { useAuth } from "../components/contexts/AuthContext";
import RemoteUserdata from "models/RemoteUserData";
import { useNavigate } from "react-router-dom";

function DeleteAccount() {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const remoteUserData = new RemoteUserdata;
  const navigate = useNavigate()

  const handleDelete = () => {
    if (currentUser) {
      remoteUserData.delete().then(() => {
        console.log("Deleted firestore document for user " + currentUser.uid)
        navigate("/")
        // deleteUser(currentUser).then(() => {
        //     useNavigate()("/")
        //   }).catch((err) => {
        //     console.log(err)
        //     alert("An error occurred - could not delete user account!")
        //   })
      }).catch((err) => {
            console.log(err)
            alert("An error occurred - could not delete remote user data!")
          })
    }
    setOpen(false);
  };

  if (!currentUser) {
    return (
      <div>
        <Button disabled>
          <DeleteForeverIcon /> Delete Account
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              style={{ marginRight: "250px" }}
            >
              No
            </Button>
            <Button >Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        <DeleteForeverIcon /> Delete Account
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            style={{ marginRight: "250px" }}
          >
            No
          </Button>
          <Button onClick={handleDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteAccount;
