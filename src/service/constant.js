import { notification } from "antd";
import axios from "axios";

const container = document.getElementById("carekernel-inquiry-widget");
const { organisationid,clientkey } = container.dataset;
const API_KEY = clientkey;

export const fetcher = async (url, params) => {
  try {
    const response = await axios.get(url, {
      headers: { "x-api-key": API_KEY, "x-org-id": organisationid },
      params,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized access.");
    }
    throw error;
  }
};
export const headers = {
  "x-api-key": API_KEY,
  "x-org-id": organisationid,
};
export const openNotification = (message, isError, description = "") => {
  const fn = isError ? "error" : "success";

  notification[fn]({
    message,
    description,
    placement: "bottom",
  });
};
