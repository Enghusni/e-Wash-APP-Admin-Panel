import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  headers: {
    Accept: "application/json",
  },
});

const request = async (options) => {
  try {
    // client.defaults.headers.common.Authorization = `Bearer ${getToken()}`;
    const onSuccess = (response) => response;

    const response = await client(options);
    return onSuccess(response);
  } catch (error) {
    throw error;
  }
};

export default request;
