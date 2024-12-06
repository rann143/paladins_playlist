import App from "./App";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";

const routes = [
  {
    path: "/:name?/:playlistid?",
    element: <App />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
