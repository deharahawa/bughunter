"use server";

import fs from "fs/promises";
import path from "path";
import { Mission } from "@/types/database";

const DB_PATH = path.join(process.cwd(), "missions.json");

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, "[]", "utf-8");
  }
}

export async function getMissionsAction(): Promise<Mission[]> {
  await ensureDbFile();
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data) as Mission[];
  } catch (error) {
    console.error("Error reading missions.json:", error);
    return [];
  }
}

export async function saveMissionAction(mission: Mission): Promise<boolean> {
  await ensureDbFile();
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    const missions = JSON.parse(data) as Mission[];
    
    // Add new mission to the beginning
    missions.unshift(mission);
    
    await fs.writeFile(DB_PATH, JSON.stringify(missions, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing to missions.json:", error);
    return false;
  }
}
