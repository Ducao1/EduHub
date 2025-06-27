import { Component, NgModule } from '@angular/core';
import { ClassroomService } from '../../../../services/classroom.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-class',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-class.component.html',
  styleUrl: './add-class.component.scss'
})
export class AddClassComponent {
  className = '';
  description = '';

  constructor(private classroomService: ClassroomService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  createClass() {
    this.classroomService.addClass(this.className, this.description).subscribe({
      next: (response) => {
        debugger
        alert('Lớp học được tạo thành công!');
        this.router.navigate(['/teacher/dashboard']);
      },
      error: (err) => {
        debugger
        alert('Lỗi khi tạo lớp: ' + err.message);
      }
    });
  }

  cancel() {
    this.router.navigate(['/teacher/dashboard']);
  }
}
