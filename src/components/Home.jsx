/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { SpotifyAuth } from "../scripts/spotifyAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Home({ spotAuth }) {
  const navigate = useNavigate();
  const authCheckComplete = useRef(false); // Add this ref to track if auth check has run

  async function logoutClick() {
    localStorage.clear();
    window.location.href = spotAuth.redirectUrl;
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
