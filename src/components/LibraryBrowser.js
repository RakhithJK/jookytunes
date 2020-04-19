import React, { useEffect, useContext, useState } from "react";
import PlayerContext from "./PlayerContext";
import LoadingZone from "./LoadingZone";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TextField,
} from "@material-ui/core";

function LibraryBrowser({ onTrackSelected = () => {}, ...props }) {
  const { storage } = useContext(PlayerContext);
  const [allTracks, setAllTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storage) {
      return;
    }
    async function loadTracks() {
      setIsLoading(true);
      try {
        const tracks = await storage.loadAllTracks();
        setAllTracks(tracks);
      } finally {
        setIsLoading(false);
      }
    }
    loadTracks();
  }, [storage]);

  const regex = searchQuery ? new RegExp(searchQuery, "i") : null;
  const rows = allTracks
    .filter((track) => {
      if (!regex) {
        return true;
      }
      return regex.test(track.artist) || regex.test(track.title);
    })
    .map((track) => {
      return (
        <TableRow
          key={track.digest}
          hover
          onClick={() => onTrackSelected(track)}
        >
          <TableCell>{track.title}</TableCell>
          <TableCell>{track.artist}</TableCell>
        </TableRow>
      );
    });

  return (
    <div {...props}>
      <LoadingZone isLoading={isLoading}>
        <TextField
          label="Search for a track"
          size="small"
          style={{
            width: "100%",
          }}
          autoFocus
          margin="normal"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ type: "search" }}
        />
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Artist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      </LoadingZone>
    </div>
  );
}

export default LibraryBrowser;
