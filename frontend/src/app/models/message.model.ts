export interface Message {
  _id?: string;
  user_id: string;
  to: string;
  from?: string;
  body: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}