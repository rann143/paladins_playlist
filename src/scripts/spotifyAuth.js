class SpotifyAuth {
  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // your clientId
    this.redirectUrl = "http://localhost:5173"; // your redirect URL - must be localhost URL and/or HTTPS
    this.authorizationEndpoint = "https://accounts.spotify.com/authorize";
    this.tokenEndpoint = "https://accounts.spotify.com/api/token";
    this.scope =
      "user-read-private playlist-modify-private user-library-modify user-library-read user-read-email";

    // not currently working properly
    this.currentToken = {
      get accessToken() {
        return localStorage.getItem("access_token") || null;
      },
      get refreshToken() {
        return localStorage.getItem("refresh_token") || null;
      },
      get expiresIn() {
        return localStorage.getItem("refresh_in") || null;
      },
      get expires() {
        return localStorage.getItem("expires") || null;
      },

      save(response) {
        const { access_token, refresh_token, expires_in } = response;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("expires_in", expires_in);

        const now = new Date();
        const expiry = new Date(now.getTime() + expires_in * 1000);
        localStorage.setItem("expires", expiry);
      },
    };
  }

  generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  redirectToSpotifyAuthorize = async () => {
    const code_verifier = this.generateRandomString(64);
    const hashed = await this.sha256(code_verifier);
    const codeChallenge = this.base64encode(hashed);

    window.localStorage.setItem("code_verifier", code_verifier);

    const authUrl = new URL(this.authorizationEndpoint);
    const params = {
      response_type: "code",
      client_id: this.clientId,
      scope: this.scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: this.redirectUrl,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  };

  getToken = async (authcode) => {
    const code_verifier = localStorage.getItem("code_verifier");

    const response = await fetch(this.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        grant_type: "authorization_code",
        code: authcode,
        redirect_uri: this.redirectUrl,
        code_verifier: code_verifier,
      }),
    });

    const data = await response.json();
    console.log("Token endpoint response:", data);

    if (!response.ok) {
      throw new Error(
        `Token exchange failed: ${data.error} - ${data.error_description}`
      );
    }

    return data;
  };

  refreshToken = async () => {
    const response = await fetch(this.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        grant_type: "refresh_token",
        refresh_token: this.currentToken.refresh_token,
      }),
    });

    return await response.json();
  };
}

export { SpotifyAuth };
