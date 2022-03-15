import { LOGIN, LOGOUT } from "./types";
import axios from "../../utils/lib/axios";

export const login = (accessToken, permittedRoutes) => (dispatch) => {
  try {
    // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    axios.interceptors.request.use(
      function (config) {
        config.headers["Authorization"] = "Bearer " + accessToken;
        return config;
      },
      null,
      { synchronous: true }
    );

    // save to the session storage
    sessionStorage.setItem("accessToken", accessToken);

    dispatch({
      type: LOGIN,
      payload: {
        accessToken,

        routes: permittedRoutes,
      },
    });
  } catch (error) {}
};

export const logout = () => (dispatch) => {
  axios.interceptors.request.use(
    (config) => {
      // Do something before request is sent

      delete config.headers["Authorization"];
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  // remove items from session storage
  sessionStorage.removeItem("accessToken");

  // axios.defaults.headers.common.Authorization = null;

  setTimeout(() => {
    dispatch({
      type: LOGOUT,
    });
  }, 70);
};


