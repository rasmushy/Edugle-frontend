import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { AirlineSeatIndividualSuiteRounded } from "@mui/icons-material";

interface User {
  username: string;
  description?: string | null | undefined;
  likes?: number | null | undefined;
}

interface HoverUserProps {
  user: User | null | undefined;
  isPopUpOpen: boolean;
  handleClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HoverUser: React.FC<HoverUserProps> = ({ user, isPopUpOpen, handleClose }) => {
  const [open, setOpen] = React.useState(isPopUpOpen);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose2 = () => {
    //console.log("asdasdas!");
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} TransitionComponent={Transition} onClose={handleClose2} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{user?.username} when no apps are running.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose2()}>Disagree</Button>
          <Button onClick={() => handleClose2()}>Agree</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HoverUser;
