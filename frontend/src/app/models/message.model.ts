export interface Message {
  _id?: string;
  to: string;
  from?: string;
  body: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}