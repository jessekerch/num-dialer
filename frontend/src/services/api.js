import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

export const getNumbers = async () => {
  try {
    const { data } = await axios.get(BASE_URL + "/numbers");
    console.log("getNumbers got response ", data.numbers);
    return data.numbers;
  } catch (error) {
    console.log("api.js error ", error);
  }
};

export const callNumbers = async () => {
  try {
    const response = await axios.get(BASE_URL + "/startcalls");
    return response;
  } catch (error) {
    console.log("callNumbers api.js error ", error);
  }
};
