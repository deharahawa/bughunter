import type { Mission } from "@/types/database";

// Mock delay to simulate network request
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


// Logic to parse the "LLM JSON"
export function parseMissionReport(jsonString: string): { valid: boolean; data?: any; error?: string } {
    try {
        const data = JSON.parse(jsonString);
        
        // Validation Schema (New Format)
        if (!data.mission_title) throw new Error("Missing 'mission_title'");
        if (!data.outcome) throw new Error("Missing 'outcome'");
        if (typeof data.xp_gained !== 'number') throw new Error("Invalid 'xp_gained' type");
        
        return { valid: true, data };
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Invalid JSON format";
        return { valid: false, error: errorMessage };
    }
}

// Keys
const STORAGE_KEY = "bughunter_missions";

export async function fetchMissions(): Promise<Mission[]> {
   // Client-side only check
   if (typeof window === "undefined") return [];
   
   await delay(500); // Simulate network
   const data = localStorage.getItem(STORAGE_KEY);
   return data ? JSON.parse(data) : [];
}

export async function archiveMission(missionData: Record<string, unknown>): Promise<{ success: boolean; message: string; data?: Mission }> {
  await delay(1500); // Simulate processing time

  // Basic validation mock
  if (!missionData || !missionData.mission_title || !missionData.xp_gained) {
     return { success: false, message: "CRITICAL ERROR: Data Corrupted. Missing vital mission parameters." };
  }
  
  const newMission: Mission = {
        id: crypto.randomUUID(),
        user_id: "mock-user-id",
        case_data: missionData as any,
        status: (missionData.outcome as string) === "Victory" ? "SUCCESS" : "FAILURE",
        xp_earned: (missionData.xp_gained as number) || 0,
        feedback_summary: "Mission concluded. Data archived.",
        created_at: new Date().toISOString()
  };

  // Save to LocalStorage
  if (typeof window !== "undefined") {
      const existing = localStorage.getItem(STORAGE_KEY);
      const missions = existing ? JSON.parse(existing) : [];
      missions.unshift(newMission); // Add to top
      localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
  }

  return { 
    success: true, 
    message: "ARCHIVE SUCCESSFUL. Case closed.",
    data: newMission
  };
}
