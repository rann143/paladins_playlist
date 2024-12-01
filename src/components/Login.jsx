export default function Login({ spotAuth }) {
  // Click handlers
  async function loginWithSpotifyClick() {
    await spotAuth.redirectToSpotifyAuthorize();
  }
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => loginWithSpotifyClick()}>
        Log in with Spotify
      </button>
    </div>
  );
}
