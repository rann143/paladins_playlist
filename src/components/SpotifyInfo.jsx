import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SpotifyInfo({ spotAuth }) {
  const fetchComplete = useRef(false); // Add this ref to track if fetches has run
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  //const navigate = useNavigate();

  useEffect(() => {
    if (!fetchComplete.current) {
      // Only run if we haven't fetched
      getUserData();
      getRecentlyPlayed();
      getPlaylists();
      fetchComplete.current = true; // Mark as complete after first run
    }
  }, []);

  async function getUserData() {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Could not get user data: ${data.error} - ${data.error_description}`
      );
    }

    const data = await response.json();

    setUserData(data);

    if (isLoading) {
      setIsLoading(false);
    }

    return data;
  }

  async function getPlaylists() {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Could not get user data: ${data.error} - ${data.error_description}`
      );
    }

    const data = await response.json();

    setPlaylists(data.items);

    if (isLoading) {
      setIsLoading(false);
    }

    return data;
  }

  async function getRecentlyPlayed() {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Could not get user data: ${data.error} - ${data.error_description}`
      );
    }

    const data = await response.json();

    setRecentlyPlayed(data.items.slice(0, 5));

    if (isLoading) {
      setIsLoading(false);
    }

    return data;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const recents = recentlyPlayed.map((item, index) => {
    return (
      <li key={index}>
        <p>{item.track.name + " by " + item.track.artists[0].name}</p>
      </li>
    );
  });

  const myPlaylistNames = playlists.map((item, index) => {
    return (
      <li key={index}>
        <Link to={`/spotify/${item.id}`}>{item.name}</Link> | Songs:{" "}
        {item.tracks.total}
      </li>
    );
  });

  return (
    <div>
      <h1>Your Spotify Info</h1>
      <p>Name: {userData.display_name}</p>
      <p>Email: {userData.email}</p>
      <p>Followers: {userData.followers.total}</p>
      <a href={userData.external_urls.spotify} target="_blank">
        Open Spotify
      </a>

      <h2>Recently Played</h2>
      <ul>{recents}</ul>

      <h2>Playlists</h2>
      <div>
        <ul>{myPlaylistNames}</ul>
      </div>
    </div>
  );
}
