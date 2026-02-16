import type { Mission } from "@/types/database";
import { getMissionsAction, saveMissionAction as saveToServer } from "@/app/actions/mission-persistence";

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

export async function fetchMissions(): Promise<Mission[]> {
   // Use Server Action to read JSON file
   try {
       return await getMissionsAction();
   } catch (error) {
       console.error("Failed to fetch missions:", error);
       return [];
   }
}

export async function archiveMission(missionData: Record<string, unknown>): Promise<{ success: boolean; message: string; data?: Mission }> {
  // Basic validation mock
  if (!missionData || !missionData.mission_title || !missionData.xp_gained) {
     return { success: false, message: "CRITICAL ERROR: Data Corrupted. Missing vital mission parameters." };
  }
  
  const newMissionPayload: Mission = {
        id: crypto.randomUUID(),
        user_id: "local-user", 
        case_data: missionData as any,
        status: (missionData.outcome as string) === "Victory" ? "SUCCESS" : "FAILURE",
        xp_earned: (missionData.xp_gained as number) || 0,
        feedback_summary: "Mission concluded. Data archived.",
        created_at: new Date().toISOString()
  };

  try {
      const success = await saveToServer(newMissionPayload);
      
      if (!success) {
          throw new Error("Failed to write to JSON file");
      }

      return { 
        success: true, 
        message: "ARCHIVE SUCCESSFUL. Case closed.",
        data: newMissionPayload
      };

  } catch (error) {
       console.error("Archive Error:", error);
       return {
           success: false,
           message: "ARCHIVE FAILED. System error.",
       };
  }
}
