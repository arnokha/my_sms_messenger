import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message.model';
import { PhoneFormatPipe } from '../pipes/phone-format.pipe';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, PhoneFormatPipe],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  to = '';
  body = '';
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.loadMessages();
  }

  sendMessage() {
    if (!this.to || !this.body) return;

    this.messageService.sendMessage("+1" + this.to, this.body).subscribe((msg) => {
      this.messages.unshift(msg);
      this.clearForm();
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

}
