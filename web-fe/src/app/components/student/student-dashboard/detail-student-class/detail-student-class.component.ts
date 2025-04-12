import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClassroomService } from '../../../../services/classroom.service';
import { CommonModule } from '@angular/common';
import { StudentNavBarComponent } from "../../student-nav-bar/student-nav-bar.component";

@Component({
  selector: 'app-detail-student-class',
  imports: [
    CommonModule,
    RouterModule,
    StudentNavBarComponent
],
  templateUrl: './detail-student-class.component.html',
  styleUrl: './detail-student-class.component.scss'
})
export class DetailStudentClassComponent {
  classId!: number;
  className: string = '';
  classDescription: string = '';

  constructor(
    private classroomService: ClassroomService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadClassInfo();
  }

  loadClassInfo() {
    this.classroomService.getClassById(this.classId).subscribe({
      next: (response) => {
        debugger
        this.className = response.name;
        this.classDescription = response.description;
      },
      error: (err) => {
        debugger
        console.error('Lỗi khi lấy thông tin lớp:', err);
      }
    });
  }
}
