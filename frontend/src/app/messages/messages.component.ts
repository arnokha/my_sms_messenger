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
  to = '8777804236'; // default to a virtual twilio number
  body = '';
  messages: Message[] = [];
  showErrorDialog = false;
  sessionId = this.generateSessionId(); // TODO rm
  pollingInterval = 5000;
  username: string | null = null;
  private pollingSubscription?: Subscription;

  constructor(
    private messageService: MessageService,
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const hasToken = this.userService.isAuthenticated();
    console.log('Messages ngOnInit - hasToken:', hasToken);
    console.log('Messages ngOnInit - currentUser:', this.userService.currentUser());

    // redirect to login if not authenticated
    if (!hasToken) {
      this.router.navigate(['/login']);
      return;
    }

    // load user data if not already loaded
    if (!this.userService.currentUser()) {
      console.log('Loading user data via getMe()...');
      this.userService.getMe().subscribe({
        next: (user) => {
          console.log('getMe success in messages component:', user);
          this.username = user.username;
          this.loadMessages();
          this.startPolling();
        },
        error: (error) => {
          console.error('Failed to load user data:', error);
          this.router.navigate(['/login']);
        }
      });
    } else {
      console.log('User data already loaded');
      this.username = this.userService.getCurrentUsername();
      console.log('Username set to:', this.username);
      this.loadMessages();
      this.startPolling();
    }
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
    // TODO user token
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
    // TODO user token
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

  // TODO rm
  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substring(2, 12);
  }

  logout() {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Still navigate to login even if API call fails
        this.router.navigate(['/login']);
      }
    });
  }
}
