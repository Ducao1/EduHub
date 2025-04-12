import { Component } from '@angular/core';
import { ClassroomService } from '../../../../services/classroom.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-assign-exam',
  standalone: true,
    imports:[
      CommonModule,
      RouterModule,
      FormsModule
    ],
  templateUrl: './assign-exam.component.html',
  styleUrl: './assign-exam.component.scss'
})
export class AssignExamComponent {
  userId!: number;
  classes: any[]=[];
  constructor(
    private classroomService: ClassroomService,
    private userService : UserService,
    private route: ActivatedRoute
  ){

  }
  ngOnInit(){
    this.userId = this.userService.getUserId() ?? 0;
    this.loadClasses();
  }

  loadClasses(){
    this.classroomService.getClassByTeacher(this.userId).subscribe({
      next: (response) => {
        debugger
        this.classes = response;
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách lớp: ${err.message}`);
      }
    });
  }
}
