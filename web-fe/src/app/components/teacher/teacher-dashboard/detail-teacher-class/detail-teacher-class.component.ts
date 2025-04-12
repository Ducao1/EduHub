import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClassroomService } from '../../../../services/classroom.service';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";

@Component({
  selector: 'app-detail-teacher-class',
  standalone: true,
  imports: [RouterModule, TeacherNavBarComponent],
  templateUrl: './detail-teacher-class.component.html',
  styleUrl: './detail-teacher-class.component.scss'
})
export class DetailTeacherClassComponent implements OnInit {
  classId!: number;
  className: string = '';
  classDescription: string = '';

  constructor(
    private classroomService: ClassroomService,
    private route: ActivatedRoute
  ) {}

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
