import React from "react";
import { CircularProgress } from "@material-ui/core";

function LoadingZone({ isLoading = true, children }) {
  let loading;
  if (typeof isLoading === "function") {
    loading = isLoading();
  } else {
    loading = !!isLoading;
  }

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          padding: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  return children;
}

export default LoadingZone;
