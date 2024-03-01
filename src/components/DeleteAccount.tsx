import React, { useState } from "react";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useAuth } from "../components/contexts/AuthContext";
// const { currentUser } = useAuth();
const currentUser = null;
function DeleteAccount() {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    // handle delete here
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
            <Button onClick={handleDelete}>Yes</Button>
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
