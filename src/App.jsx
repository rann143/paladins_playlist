import { createContext, useState, useRef, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useParams, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SpotifyInfo from "./components/SpotifyInfo";
import PlaylistDetails from "./components/PlaylistDetails";
import { SpotifyAuth } from "./scripts/spotifyAuth";
import LoggedInOutContext from "./Contexts";
import "./App.css";

function App() {
  const { name, playlistid } = useParams();
  const [spotAuth, setSpotAuth] = useState(new SpotifyAuth());
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authCheckComplete = useRef(false); // Add this ref to track if auth check has run
  const navigate = useNavigate();

  useEffect(() => {
    if (!authCheckComplete.current) {
      // Only run if we haven't completed auth check
      checkAuth();
      authCheckComplete.current = true; // Mark as complete after first run
    }
  }, []);

  // On page load, try to fetch auth code from current browser search URL
  async function checkAuth() {
    try {
      const args = new URLSearchParams(window.location.search);
      const code = args.get("code");

      if (code) {
        const token = await spotAuth.getToken(code);
        spotAuth.currentToken.save(token);

        // Remove code from URL
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        const updatedUrl = url.search ? url.href : url.href.replace("?", "");
        window.history.replaceState({}, document.title, updatedUrl);
      }

      const now = new Date();

      if (
        !localStorage.getItem("access_token") ||
        now > new Date(localStorage.getItem("expires"))
      ) {
        console.log(`from app: now: ${now} > expired`);
        navigate("/login");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoading(false);
      navigate("/login");
    }
  }

  if (isLoading) {
    return <div>Loading App...</div>;
  }

  return (
    <LoggedInOutContext.Provider value={{ loggedIn, setLoggedIn }}>
      <div>
        {name === "spotify" && playlistid ? (
          <SpotifyInfo spotAuth={spotAuth} />
        ) : name === "spotify" ? (
          <SpotifyInfo spotAuth={spotAuth} />
        ) : name === "login" ? (
          <Login spotAuth={spotAuth} />
        ) : (
          <Home spotAuth={spotAuth} />
        )}
      </div>
    </LoggedInOutContext.Provider>
  );
}

export default App;
