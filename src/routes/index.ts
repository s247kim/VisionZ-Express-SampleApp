import express from "express";
import { Pool } from "mysql2/promise";

export const apiRouter = express.Router();

apiRouter.post("/getHabits", async (req, res) => {
  const date = req.body["date"];
  if (
    !date ||
    typeof date !== "string" ||
    !/^20[0-3][0-9]-[0-9]{2}-[0-9]{2}$/.test(date)
  ) {
    res.status(400).end();
    return;
  }

  const dbConn = await (res.locals.pool as Pool).getConnection();

  try {
    const [results] = await dbConn.execute(
      `
SELECT h.habit_name FROM habit_records hr
JOIN habits h ON h.habit_id = hr.habit_id
WHERE hr.date = ?
    `,
      [date]
    );

    if (results instanceof Array) {
      res.send(results.map((x: any) => x.habit_name));
    } else {
      throw new TypeError("Wrong type from DB");
    }
  } catch (e) {
    res.status(500).end();
  } finally {
    dbConn.release();
  }
});

apiRouter.post("/saveHabit", async (req, res) => {
  const date = req.body["date"];
  const habitName = req.body["habit"];

  if (
    !date ||
    typeof date !== "string" ||
    !/^20[0-3][0-9]-[0-9]{2}-[0-9]{2}$/.test(date)
  ) {
    res.status(400).end();
    return;
  }

  if (!habitName || typeof habitName !== "string") {
    res.status(400).end();
    return;
  }

  const dbConn = await (res.locals.pool as Pool).getConnection();

  await dbConn.beginTransaction();
  try {
    await dbConn.execute(
      `
    INSERT INTO habits
    SET habit_name = ?
    ON DUPLICATE KEY UPDATE
    habit_id = habit_id;
        `,
      [habitName]
    );

    await dbConn.execute(
      `
    INSERT INTO habit_records
    SET date = ?, habit_id = (
        SELECT habit_id FROM habits
        WHERE habit_name = ?
    )
        `,
      [date, habitName]
    );

    await dbConn.commit();

    const [results] = await dbConn.execute(
      `
    SELECT h.habit_name FROM habit_records hr
    JOIN habits h ON h.habit_id = hr.habit_id
    WHERE hr.date = ?
        `,
      [date]
    );

    if (results instanceof Array) {
      console.log(results);
      res.send(results.map((x: any) => x.habit_name));
    } else {
      throw new TypeError("Wrong type from DB");
    }
  } catch (e: any) {
    await dbConn.rollback();

    if (e.code === "ER_DUP_ENTRY") {
      res.status(400).send("Duplicated habit");
      return;
    }

    res.status(500).end();
  } finally {
    dbConn.release();
  }
});
