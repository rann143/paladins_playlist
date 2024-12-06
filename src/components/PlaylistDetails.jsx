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
      //fetchPlaylist();
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

    const artists = new Set();
    const genreToTracks = new Map();

    const getOrCreate = (key) => {
      if (!genreToTracks.has(key)) genreToTracks.set(key, new Set());
      return genreToTracks.get(key);
    };

    data.items.forEach(async (item) => {
      const id = item.track.id;
      const aId = item.track.artists[0].id;

      if (!artists.has(aId)) {
        artists.add(aId);
        const genres = await fetchGenres(aId);

        genres.forEach((genre) => {
          getOrCreate(genre);
          genreToTracks.get(genre).add(id);
        });
      }
    });

    setSongsByGenre(genreToTracks);

    if (isLoading) {
      setIsLoading(false);
    }

    return data;
  }

  async function fetchGenres(artistId) {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Could not get data`);
    }

    const data = await response.json();

    if (isLoading) {
      setIsLoading(false);
    }

    return data.genres;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  //   console.log(playlist);
  //   console.log(artistIds);
  console.log(songsByGenre);

  return <div></div>;
}
