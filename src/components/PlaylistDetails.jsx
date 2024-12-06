import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function PlaylistDetails() {
  const fetchComplete = useRef(false); // Add this ref to track if fetches has run
  const { playlistid } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [artistIds, setArtistIds] = useState(null);
  const [songsByGenre, setSongsByGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fetchComplete.current) {
      fetchPlaylist();
      fetchComplete.current = true;
    }
  }, []);

  async function fetchPlaylist() {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistid}/tracks`,
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

    const tracks = new Set();
    data.items.forEach((item) => {
      const id = item.track.id;
      tracks.add(id);
    });

    setPlaylist(tracks);

    const artists = new Set();
    data.items.forEach((item) => {
      const id = item.track.artists[0].id;
      artists.add(id);
    });
    setArtistIds(artists);

    if (isLoading) {
      setIsLoading(false);
    }

    return data;
  }

  async function fetchGenres(artistIds = []) {
    const response = await fetch(
      `https://api.spotify.com/v1/artists?ids=${artistIds.join(",")}`,
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

    const data = response.json();

    if (isLoading) {
      setIsLoading(false);
    }

    return data;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(playlist);
  console.log(artistIds);

  return <div></div>;
}
