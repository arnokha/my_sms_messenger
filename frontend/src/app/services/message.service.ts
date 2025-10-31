import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/api/v1/messages';

  constructor(private http: HttpClient) {}

  sendMessage(to: string, body: string, session_id: string): Observable<Message> {
    
    return this.http.post<Message>(this.apiUrl, { message: { to, body, session_id } });
  }

  getMessages(sessionId: string): Observable<Message[]> {
    const params = new HttpParams().set('session_id', sessionId);
    return this.http.get<Message[]>(this.apiUrl, { params });    
  }
}