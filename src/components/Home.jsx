/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { SpotifyAuth } from "../scripts/spotifyAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Home({ spotAuth }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const authCheckComplete = useRef(false); // Add this ref to track if auth check has run

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

      if (!localStorage.getItem("access_token")) {
        navigate("/login");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoading(false);
      navigate("/login");
    }
  }

  // Click handlers
  async function loginWithSpotifyClick() {
    await spotAuth.redirectToSpotifyAuthorize();
  }

  async function logoutClick() {
    localStorage.clear();
    window.location.href = spotAuth.redirectUrl;
  }

  //   async function refreshTokenClick() {
  //     const token = await spotAuth.refreshToken();
  //     spotAuth.currentToken.save(token);
  //     renderTemplate("oauth", "oauth-template", currentToken);
  //   }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Playlist Paladin Home</h1>
      <Link to="spotify">User Info</Link>
      <br />
      <button onClick={() => logoutClick()}>Logout</button>
    </div>
  );
}
