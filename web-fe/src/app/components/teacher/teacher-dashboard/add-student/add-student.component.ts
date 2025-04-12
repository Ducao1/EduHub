import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { EnrollmentDTO } from '../../../../dtos/enrollment.dto';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.scss'
})
export class AddStudentComponent {
  classId!: number;
  phoneNumber!: string;

  constructor(
    private enrollmentService: EnrollmentService,
    private activedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.classId = Number(this.activedRoute.snapshot.paramMap.get('id'));
  }

  addStudent() {
    const enrollmentDTO: EnrollmentDTO = {
      class_id: this.classId,
      phone_number: this.phoneNumber,
    };

    this.enrollmentService.addStudent(enrollmentDTO).subscribe({
      next: (response: any) => {
        debugger
        alert('thêm sinh viên thành công');
        this.router.navigate(['/teacher/class', this.classId]);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger
        alert(error.error);
      }
    });
  }


}
