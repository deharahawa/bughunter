export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          total_xp: number
          rank: string
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          total_xp?: number
          rank?: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          total_xp?: number
          rank?: string
          created_at?: string
        }
      }
      cases: {
        Row: {
          id: string
          title: string
          description: string | null
          difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
          tech_stack: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
          tech_stack?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
          tech_stack?: string[] | null
          created_at?: string
        }
      }
      user_missions: {
        Row: {
          id: string
          user_id: string
          case_data: Json
          status: 'SUCCESS' | 'FAILURE'
          xp_earned: number
          feedback_summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          case_data: Json
          status: 'SUCCESS' | 'FAILURE'
          xp_earned?: number
          feedback_summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          case_data?: Json
          status?: 'SUCCESS' | 'FAILURE'
          xp_earned?: number
          feedback_summary?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Mission = Database['public']['Tables']['user_missions']['Row']
export type Case = Database['public']['Tables']['cases']['Row']
