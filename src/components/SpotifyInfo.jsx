import { useEffect } from "react";

export default function SpotifyInfo({ spotAuth }) {
  useEffect(() => {
    getUserData();
  });

  async function getUserData() {
    const response = await fetch(
      "https://api.spotify.com/v1/playlists/7sUP1CdPipK3AJGdiYZ13I",
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
    console.log("number of songs: " + data.tracks.items.length);
    console.log("number of songs: " + data.name);

    return data;
  }
}
