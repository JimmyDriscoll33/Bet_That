export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bet_coins: number
          balance: number
          win_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bet_coins?: number
          balance?: number
          win_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bet_coins?: number
          balance?: number
          win_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          invite_code: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          invite_code?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          invite_code?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      bets: {
        Row: {
          id: string
          title: string
          description: string | null
          amount: number
          bet_coins: boolean
          category: string | null
          creator_id: string
          opponent_id: string
          group_id: string | null
          status: string
          winner_id: string | null
          third_party_verification: boolean
          verifier_id: string | null
          is_public: boolean
          end_date: string | null
          created_at: string
          updated_at: string
          image_url: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          amount: number
          bet_coins?: boolean
          category?: string | null
          creator_id: string
          opponent_id: string
          group_id?: string | null
          status?: string
          winner_id?: string | null
          third_party_verification?: boolean
          verifier_id?: string | null
          is_public?: boolean
          end_date?: string | null
          created_at?: string
          updated_at?: string
          image_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          amount?: number
          bet_coins?: boolean
          category?: string | null
          creator_id?: string
          opponent_id?: string
          group_id?: string | null
          status?: string
          winner_id?: string | null
          third_party_verification?: boolean
          verifier_id?: string | null
          is_public?: boolean
          end_date?: string | null
          created_at?: string
          updated_at?: string
          image_url?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          bet_id: string
          user_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          bet_id: string
          user_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          bet_id?: string
          user_id?: string
          text?: string
          created_at?: string
        }
      }
      evidence: {
        Row: {
          id: string
          bet_id: string
          user_id: string
          text: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bet_id: string
          user_id: string
          text?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bet_id?: string
          user_id?: string
          text?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          category: string
          max_tier: number
          tier_thresholds: number[]
          tier_rewards: number[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          category: string
          max_tier?: number
          tier_thresholds: number[]
          tier_rewards: number[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          category?: string
          max_tier?: number
          tier_thresholds?: number[]
          tier_rewards?: number[]
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          current_tier: number
          progress: number
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          current_tier?: number
          progress?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          current_tier?: number
          progress?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number | null
          bet_coins: number | null
          type: string
          description: string | null
          bet_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount?: number | null
          bet_coins?: number | null
          type: string
          description?: string | null
          bet_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number | null
          bet_coins?: number | null
          type?: string
          description?: string | null
          bet_id?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          group_id: string
          user_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          text?: string
          created_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
