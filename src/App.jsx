import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useParams, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SpotifyInfo from "./components/SpotifyInfo";
import { SpotifyAuth } from "./scripts/spotifyAuth";
import "./App.css";

function App() {
  const { name } = useParams();
  const [spotAuth, setSpotAuth] = useState(new SpotifyAuth());

  return (
    <div>
      {name === "spotify" ? (
        <SpotifyInfo spotAuth={spotAuth} />
      ) : name === "login" ? (
        <Login spotAuth={spotAuth} />
      ) : (
        <Home spotAuth={spotAuth} />
      )}
    </div>
  );
}

export default App;
