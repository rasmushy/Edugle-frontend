import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import tips from "../../styles/tips";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import styles from "../../styles/styles.module.css";
import { useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";

const QueuePanel = ({ handleBack, chatStatus }: any) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(Math.floor(Math.random() * tips.length));
  const [showTip, setShowTip] = useState(true);
  const [startChat, setStartChat] = useState(false);
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setShowTip(false);
      setTimeout(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        setShowTip(true);
      }, 500); 
    }, 6000); 
     return () => {
      clearInterval(tipInterval);
    };
  }, []);

  useEffect(() => {
    if (chatStatus === "Paired") {
      setStartChat(true);
    }
    else {
      setStartChat(false);
    }
  }, [chatStatus]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper
        elevation={3} 
        sx={{
          borderRadius: 5, 
          margin: 0,
          marginLeft: "20px",
          marginRight: "20px",
          padding: 0,
          width: "90vw",
          height: "78vh !important",
          boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.4)",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "white", 
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", flexDirection: "column" }}>
          <p style={{ fontSize: "20px", marginBottom: "40px", color: "#2C7DA0" }}>
            <strong>{!startChat ? "Finding someone to talk to!" : "Starting chat!"}</strong>
          </p>
          {!startChat ? (
            <CircularProgress style={{ width: "150px", height: "150px", marginBottom: "20px" }} />
          ) : (
            <DoneIcon style={{ color: "green", height: "150px", width: "150px" }} />
          )}
          <p style={{ fontSize: "20px", marginBottom: "20px" }}>
            <strong>Daily tips</strong>
          </p>
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: "10px" }}>
            <div className={` ${showTip ? `${styles.fadeIn}` : `${styles.fadeOut}`}`} style={{ fontSize: "16px", textAlign: "center" }}>
              <TipsAndUpdatesIcon style={{ color: "orange", marginRight: "20px" }}></TipsAndUpdatesIcon> {tips[currentTipIndex]}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", bottom: "20px", position: "absolute" }}>
            <button
              onClick={() => handleBack()}
              style={{ fontSize: "16px", padding: "10px 20px", background: "#E53E3E", color: "white", border: "none", borderRadius: "5px" }}
            >
              Go Back
            </button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default QueuePanel;
