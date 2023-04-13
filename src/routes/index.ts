import express from "express";
import { DBTable, getKey, saveKey } from "../utils/jsonDB.utils";
import { readFile } from "fs/promises";

export const apiRouter = express.Router();

apiRouter.post("/getHabits", async (req, res, next) => {
  // const dataStr = await readFile("habitDB.json", { encoding: "utf8" });
  // const data = JSON.parse(dataStr);
  // const habits = data[req.body["date"]] || [];
  // res.send(habits);

  res.send((await getKey(DBTable.HABIT, req.body["date"])) || []);
});

apiRouter.post("/saveHabit", async (req, res, next) => {
  const habits = (await getKey(DBTable.HABIT, req.body["date"])) || [];
  if (habits.includes(req.body["habit"])) {
    res.status(400).send(false);
    return;
  }

  res.send(
    await saveKey(DBTable.HABIT, req.body["date"], [
      ...habits,
      req.body["habit"],
    ])
  );
});
