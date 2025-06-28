import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../interfaces/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approve-student',
  imports: [
    CommonModule
  ],
  templateUrl: './approve-student.component.html',
  styleUrl: './approve-student.component.scss'
})
export class ApproveStudentComponent {
  @Input() classId!: number;
  @Output() close = new EventEmitter<void>();

  students: User[] = [
    {
      id: 1,
      fullName: 'Nguyễn Văn A',
      email: 'vana@gmail.com',
      phoneNumber: '0123456789',
      password: '',
      role: { id: 1, name: 'STUDENT' },
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      fullName: 'Trần Thị B',
      email: 'thib@gmail.com',
      phoneNumber: '0123456790',
      password: '',
      role: { id: 1, name: 'STUDENT' },
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      fullName: 'Lê Văn C',
      email: 'vanc@gmail.com',
      phoneNumber: '0123456791',
      password: '',
      role: { id: 1, name: 'STUDENT' },
      avatar: ''
    }
  ];

  selectedIds: number[] = [];

  isAllSelected(): boolean {
    return this.selectedIds.length === this.students.length;
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selectedIds = [];
    } else {
      this.selectedIds = this.students.map(s => s.id);
    }
  }

  toggleSelect(id: number) {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter(sid => sid !== id);
    } else {
      this.selectedIds.push(id);
    }
  }

  onClose() {
    this.close.emit();
  }
}
