import { readFile, writeFile } from "fs/promises";

export enum DBTable {
  HABIT = "habitDB.json",
}

export type TableSchema = {
  [DBTable.HABIT]: {
    [date: string]: string[];
  };
};

export const selectAll = async <Table extends DBTable>(
  table: Table
): Promise<TableSchema[Table]> => {
  const file = await readFile(table, { encoding: "utf8" });
  return JSON.parse(file);
};

export const getKey = async <Table extends DBTable>(
  table: Table,
  key: keyof TableSchema[Table]
): Promise<TableSchema[Table][keyof TableSchema[Table]]> => {
  const data = await selectAll(table);
  return data[key] || null;
};

export const saveKey = async <Table extends DBTable>(
  table: Table,
  key: keyof TableSchema[Table],
  value: TableSchema[Table][keyof TableSchema[Table]]
): Promise<boolean> => {
  const data = await selectAll(table);
  data[key] = value;
  await writeFile(table, JSON.stringify(data, null, 2));
  return true;
};
