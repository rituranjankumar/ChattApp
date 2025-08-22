import axios from "axios";
import toast from "react-hot-toast";
import { store } from  "../slices/store/store";
  import { setUser } from  "../slices/ProfileSlice";
import { setToken } from "../slices/authSlice"
 

export const axiosInstance = axios.create({});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      toast.error(error?.response?.data?.message || "Please login again",
        {
            duration:2000,
        }
      );

      // Use store.dispatch, not useDispatch hook
      store.dispatch(setToken(null));
      store.dispatch(setUser(null));

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData ?? null,
    headers: headers ?? null,
    params: params ?? null,
  });
};
