import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { Message } from '../models/message.model';
import { PhoneFormatPipe } from '../pipes/phone-format.pipe';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, PhoneFormatPipe],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  to = '8777804236';
  body = '';
  messages: Message[] = [];
  showErrorDialog = false;
  sessionId = this.generateSessionId();
  pollingInterval = 5000;
  username: string | null = null;
  private pollingSubscription?: Subscription;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.userService.getCurrentUsername();

    // Redirect to login if not authenticated
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadMessages();
    this.startPolling();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  startPolling() {
    this.pollingSubscription = interval(this.pollingInterval)
      .pipe(
        switchMap(() => this.messageService.getMessages(this.sessionId))
      )
      .subscribe((msgs) => {
        this.messages = msgs;
      });
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  sendMessage() {
    if (!this.to || !this.body) return;

    this.messageService.sendMessage("+1" + this.to, this.body, this.sessionId).subscribe({
      next: (msg) => {
        this.messages.unshift(msg);
        this.clearForm();
      },
      error: (error) => {
        this.showErrorDialog = true;
      }
    });
  }

  clearForm() {
    this.body = '';
  }

  loadMessages() {
    this.messageService.getMessages(this.sessionId).subscribe((msgs) => {
      this.messages = msgs;
    });
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, ''); // digits only
    this.to = input.value;
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substring(2, 12);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
