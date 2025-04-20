import { Component } from '@angular/core';
import { ClassroomService } from '../../../services/classroom.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent {  
  userId!: number;
  classes: any[]=[];
  constructor(
    private classroomService: ClassroomService,
    private userService : UserService
  ){}
  ngOnInit(): void {
    this.userId = this.userService.getUserId() ?? 0;
    this.loadAllClassByTeacher();
    
  }

  loadAllClassByTeacher() {
    this.classroomService.getClassByTeacher(this.userId).subscribe({
      next: (response) => {
        debugger
        this.classes = response;
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }
}
