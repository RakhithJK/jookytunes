import React, { useState, useContext } from "react";
import TrackUploader from "./TrackUploader";
import LibraryBrowser from "./LibraryBrowser";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import { Dialog, DialogContent } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PlayerContext from "./PlayerContext";

import "./AddTrackButton.scss";

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const AddTrackButton = ({ onTrackAdded = () => {}, buttonClass }) => {
  const { controller } = useContext(PlayerContext);
  const styles = useStyles();
  const [showModal, setShowModal] = useState(false);

  const onExistingTrackSelected = (t) => {
    setShowModal(false);
    controller.addTrack(t, false);
    onTrackAdded(t);
  };

  const onNewTrackUploaded = (t) => {
    setShowModal(false);
    controller.addTrack(t, true);
    onTrackAdded(t);
  };

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
      <Dialog
        open={showModal}
        maxWidth="md"
        fullWidth={true}
        onClose={() => setShowModal(false)}
      >
        <DialogContent>
          <div className="track-modal">
            <div className="library">
              <h5>Browse Library</h5>
              <LibraryBrowser
                className="browser"
                onTrackSelected={onExistingTrackSelected}
              />
            </div>
            <div className="uploader">
              <h5>Add New</h5>
              <TrackUploader
                className="uploader"
                onTrackAdded={onNewTrackUploaded}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTrackButton;
