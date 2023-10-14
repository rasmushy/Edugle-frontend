import Paper from "@mui/material/Paper";
import RulesGif from "../../../public/images/rules.gif";
import Image from "next/image";

const RulesPanel = ({ handleStartQueue, handleBack }: any) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper
        elevation={3} // Add elevation for shadow
        sx={{
          borderRadius: 5, // Add rounded corners
          margin: 0,
          marginLeft: "20px",
          marginRight: "20px",
          padding: 0,
          width: "90vw",
          height: "78vh !important",
          boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.4)",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "white", // Background color
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", flexDirection: "column" }}>
          <Image width={650} height={0} src={RulesGif.src} alt="Image" style={{ marginBottom: "20px", borderRadius: "50px", boxShadow: "5px 5px 3px gray" }} />
          <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Read Before Entering</h1>
          <p style={{ fontSize: "16px", textAlign: "center", marginBottom: "40px" }}>
            Do you know the rules about talking to{" "}
            <a
              style={{ fontWeight: "bolder", textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://faze.ca/dos-and-donts-chatting-strangers-online/"
            >
              strangers online
            </a>
            ?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => handleStartQueue()}
              style={{ fontSize: "16px", padding: "10px 20px", background: "#014F86", color: "white", border: "none", borderRadius: "5px" }}
            >
              I Know the Rules
            </button>
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

export default RulesPanel;
