import { response } from "express";
import { NUMBERS } from "../data/number.js";
import axios from "axios";

const NUMDIALER_URL = "http://localhost:4830/call";
const WEBHOOK_URL = "http://localhost:3000/api/hook";

const callQueue = [...NUMBERS];
let numCounter = 0;
export const activeCalls = [];
const MAX_CONCURRENT_CALLS = 3;

const makeCall = async (phone) => {
  try {
    const body = {
      phone: phone,
      webhookURL: WEBHOOK_URL,
    };

    const response = await axios.post(NUMDIALER_URL, body);
    return response.data;
  } catch (error) {
    console.log("Error in makeCall, ", error);
  }
};

export const startCalls = async () => {
  // Start new calls if we have room in the activeCalls list
  while (activeCalls.length < MAX_CONCURRENT_CALLS && callQueue.length > 0) {
    const nextNumber = callQueue.shift();

    let res = await makeCall(nextNumber);
    console.log(`Started call to ${nextNumber}, call ID: ${res.id}`);
    activeCalls.push({ id: res.id, phone: nextNumber, idx: numCounter });
    console.log("active calls length is: ", activeCalls.length);
    numCounter++;
  }
};
