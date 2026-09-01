export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'reader' | 'author' | 'editor';
export type ArticleStatus = 'draft' | 'published' | 'archived';
export type CircleMemberRole = 'member' | 'moderator' | 'admin';
export type BookingStatus = 'confirmed' | 'cancelled';
export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          bio: string | null;
          avatar_url: string | null;
          role: UserRole;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      circles: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          cover_url: string | null;
          editor_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          cover_url?: string | null;
          editor_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          cover_url?: string | null;
          editor_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      circle_members: {
        Row: {
          id: string;
          circle_id: string;
          user_id: string;
          role: CircleMemberRole;
          joined_at: string;
        };
        Insert: {
          id?: string;
          circle_id: string;
          user_id: string;
          role?: CircleMemberRole;
          joined_at?: string;
        };
        Update: {
          id?: string;
          circle_id?: string;
          user_id?: string;
          role?: CircleMemberRole;
          joined_at?: string;
        };
      };
      circle_invitations: {
        Row: {
          id: string;
          circle_id: string;
          email: string;
          role: CircleMemberRole;
          invited_by: string;
          token: string;
          status: InvitationStatus;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          circle_id: string;
          email: string;
          role?: CircleMemberRole;
          invited_by: string;
          token?: string;
          status?: InvitationStatus;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          circle_id?: string;
          email?: string;
          role?: CircleMemberRole;
          invited_by?: string;
          token?: string;
          status?: InvitationStatus;
          created_at?: string;
          expires_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          circle_id: string;
          author_id: string;
          title: string;
          slug: string;
          content: Json;
          excerpt: string;
          cover_url: string | null;
          status: ArticleStatus;
          tags: string[];
          reading_time_min: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          circle_id: string;
          author_id: string;
          title: string;
          slug: string;
          content?: Json;
          excerpt: string;
          cover_url?: string | null;
          status?: ArticleStatus;
          tags?: string[];
          reading_time_min?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          circle_id?: string;
          author_id?: string;
          title?: string;
          slug?: string;
          content?: Json;
          excerpt?: string;
          cover_url?: string | null;
          status?: ArticleStatus;
          tags?: string[];
          reading_time_min?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          article_id: string;
          user_id: string;
          parent_id: string | null;
          content: string;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          user_id: string;
          parent_id?: string | null;
          content: string;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          user_id?: string;
          parent_id?: string | null;
          content?: string;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          article_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          article_id?: string;
          created_at?: string;
        };
      };
      availability_slots: {
        Row: {
          id: string;
          author_id: string;
          start_time: string;
          end_time: string;
          is_booked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          start_time: string;
          end_time: string;
          is_booked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          start_time?: string;
          end_time?: string;
          is_booked?: boolean;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          slot_id: string;
          reader_id: string;
          article_id: string | null;
          status: BookingStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slot_id: string;
          reader_id: string;
          article_id?: string | null;
          status?: BookingStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slot_id?: string;
          reader_id?: string;
          article_id?: string | null;
          status?: BookingStatus;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      book_slot_atomic: {
        Args: {
          p_slot_id: string;
          p_reader_id: string;
          p_article_id?: string;
          p_notes?: string;
        };
        Returns: {
          success: boolean;
          booking_id?: string;
          slot_id?: string;
          error_code?: string;
          message: string;
        };
      };
      cancel_booking_atomic: {
        Args: {
          p_booking_id: string;
          p_user_id: string;
        };
        Returns: {
          success: boolean;
          error_code?: string;
          message: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Circle = Database['public']['Tables']['circles']['Row'];
export type CircleMember = Database['public']['Tables']['circle_members']['Row'];
export type CircleInvitation = Database['public']['Tables']['circle_invitations']['Row'];
export type Article = Database['public']['Tables']['articles']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type AvailabilitySlot = Database['public']['Tables']['availability_slots']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];

export interface EnrichedBookingSession {
  id: string;
  slotId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTimezone: string;
  readerId: string;
  readerName: string;
  readerEmail: string;
  readerAvatar: string;
  articleId?: string;
  articleTitle?: string;
  articleSlug?: string;
  startTime: string; // ISO UTC
  endTime: string;   // ISO UTC
  status: BookingStatus;
  notes?: string;
}
