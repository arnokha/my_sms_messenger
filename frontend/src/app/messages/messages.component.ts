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

    // redirect to login if not authenticated
    if (!hasToken) {
      this.router.navigate(['/login']);
      return;
    }

    // load user data if not already loaded
    if (!this.userService.currentUser()) {
      this.userService.getMe().subscribe({
        next: (user) => {
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
      this.username = this.userService.getCurrentUsername();
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
        switchMap(() => this.messageService.getMessages())
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
    this.messageService.sendMessage("+1" + this.to, this.body).subscribe({
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
    this.messageService.getMessages().subscribe((msgs) => {
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
