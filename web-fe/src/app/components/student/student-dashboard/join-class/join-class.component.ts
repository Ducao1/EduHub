import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { JoinClassDTO } from '../../../../dtos/requests/join-class.dto';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-join-class',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './join-class.component.html',
  styleUrl: './join-class.component.scss'
})
export class JoinClassComponent {
  code: any;
  classId!: number;
  userId!: number;
  constructor(
    private enrollmentService: EnrollmentService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.userService.getUserId() ?? 0 ;
  }

  joinClass() {
      const JoinClassDTO: JoinClassDTO = {
        student_id: this.userId,
        code: this.code,
      };
  
      this.enrollmentService.joinClass(JoinClassDTO).subscribe({
        next: (response: any) => {
          debugger
          alert("Tham gia lớp thành công!");
          this.router.navigate(['/student/dashboard']);
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
