import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Input() type: 'success' | 'warning' | 'error' = 'success';
  @Input() title: string = '';
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();
}
