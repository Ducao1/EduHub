import { Component } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  message: string = '';
  chat: { from: 'user' | 'ai', text: string, html?: string }[] = [];
  loading: boolean = false;
  showChatBox: boolean = false;

  constructor(private chatbotService: ChatbotService) {}

  toggleChatBox() {
    this.showChatBox = !this.showChatBox;
  }

  sendMessage() {
    if (!this.message.trim()) return;
    const userMsg = this.message;
    this.chat.push({ from: 'user', text: userMsg });
    this.loading = true;
    this.chatbotService.chatbot(userMsg).subscribe({
      next: (res) => {
        const aiText = res.respone || res.response || '';
        Promise.resolve(marked.parse(aiText)).then(aiHtml => {
          this.chat.push({ from: 'ai', text: aiText, html: aiHtml });
          this.loading = false;
        });
      },
      error: () => {
        this.chat.push({ from: 'ai', text: 'Xin lỗi, hệ thống AI đang bận. Vui lòng thử lại sau.' });
        this.loading = false;
      }
    });
    this.message = '';
  }
}