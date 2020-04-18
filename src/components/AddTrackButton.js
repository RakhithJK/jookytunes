import React, { useState } from "react";
import TrackUploader from "./TrackUploader";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const AddTrackButton = ({ onTrackAdded, buttonClass }) => {
  const styles = useStyles();

  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Fab
        color="primary"
        variant="extended"
        className={buttonClass}
        onClick={() => setShowModal(true)}
      >
        <AddIcon className={styles.extendedIcon} />
        Add Tracks
      </Fab>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div>
          <Grid
            container
            spacing={0}
            alignItems="center"
            justify="center"
            style={{ minHeight: "100vh" }}
          >
            <div
              style={{
                backgroundColor: "#000",
                minHeight: "20vh",
                minWidth: "30vw",
                border: "1px solid purple",
                padding: "5rem",
              }}
            >
              <TrackUploader onTrackAdded={() => setShowModal(false)} />
            </div>
          </Grid>
        </div>
      </Modal>
    </>
  );
};

export default AddTrackButton;
