import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../../services/assignment.service';
import { AssignmentDTO } from '../../../../dtos/requests/assignment.dto';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './add-assignment.component.html',
  styleUrl: './add-assignment.component.scss'
})
export class AddAssignmentComponent {
  teacherId!: number;
  title = '';
  content = '';
  assignedDate!: Date;
  dueDate!: Date;
  classId!: number;
  attachment: File | null = null;

  constructor(
    private assignmentService: AssignmentService,
    private router : Router,
    private userService : UserService,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
    this.teacherId = this.userService.getUserId() ?? 0;
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Teacher ID:', this.teacherId);
    console.log('class ID: ',this.classId);
  }

  addAssignment() {
    const assignmentDTO: AssignmentDTO = {
      class_id: this.classId, 
      teacher_id: this.teacherId,
      title: this.title,
      content: this.content,
      assigned_date: this.assignedDate,
      due_date: this.dueDate
    };
    this.assignmentService.addAssignment(assignmentDTO).subscribe({
      next: (response)=>{
        debugger
        alert('Bài tập được tạo thành công!');
        this.router.navigate(['/teacher/assignments']); 
      },
      complete:()=> {
        debugger
      },
      error: (error) => {
        debugger
        alert(error.error)
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.attachment = file;
    }
  }

  resetDates() {
    this.assignedDate = null as any;
    this.dueDate = null as any;
  }

  cancel() {
    this.router.navigate(['/teacher/assignment', this.classId]);
  }
}
