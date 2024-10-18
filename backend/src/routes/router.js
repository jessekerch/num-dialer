import express from "express";
import { activeCalls, startCalls } from "../utils/helper.js";
import { NUMBERS } from "../data/number.js";

const router = express.Router();

let SSEres;

router.get("/sse", (req, res) => {
  console.log("Starting SSE");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const data = { message: "Hello from the server!" };
  SSEres = res;
  SSEres.write(`data: ${JSON.stringify(data)}\n\n`);
});

router.get("/startcalls", (req, res) => {
  console.log("Starting calls!");
  startCalls();
  res.status(200).send("Starting calls!");
});

router.get("/numbers", (req, res) => {
  const body = {
    numbers: NUMBERS,
  };
  console.log("In router.get /numbers: ", body);
  res.status(200).send(body);
});

router.post("/hook", (req, res) => {
  const { id, status } = req.body;
  console.log(`Received update: call ID ${id}, status: ${status}`);

  const callIndex = activeCalls.findIndex((call) => call.id === id);

  if (callIndex !== -1) {
    const newData = {
      number: activeCalls[callIndex].phone,
      status: status,
      idx: activeCalls[callIndex].idx,
    };
    SSEres.write(`data: ${JSON.stringify(newData)}\n\n`);
    res.sendStatus(200);

    if (status === "completed") {
      activeCalls.splice(callIndex, 1);
      console.log(`Call ID ${id} completed, starting a new one if available.`);

      startCalls();
    }
  } else {
    console.log("Error in /hook callIndex === -1");
  }

  if (activeCalls.length === 0) {
    console.log("ActiveCalls zero");
    SSEres.end();
  }
});

export { router };
