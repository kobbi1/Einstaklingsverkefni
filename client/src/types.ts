export type UiState = 'initial' | 'loading' | 'error' | 'data' | 'empty' | 'guest'

export type TheLeaderboard = {
    id: number;
    username: string;
    points: number;
  };


export type UserProfile = {
    id: number;
    username: string;
};

export type Entry = {
  id: number;
  title: string;
  content: string;
  is_public: boolean;
  created_at: string;
  user_id: number;
};


export type PublicEntry = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_public: boolean;
  username: string;
  total_points: number;
};
