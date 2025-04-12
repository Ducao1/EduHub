import { Component } from '@angular/core';
import { SubmissionService } from '../../../services/submission.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-submission',
  standalone: true,
  imports:[
    CommonModule
  ],
  templateUrl: './student-submission.component.html',
  styleUrls: ['./student-submission.component.css']
})
export class StudentSubmissionComponent {
  selectedFile: File | null = null;
  message = '';
  isUploading = false;

  constructor(private submissionService: SubmissionService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (!allowedTypes.includes(file.type)) {
        this.message = 'Chỉ chấp nhận file PDF hoặc Word!';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.message = 'File quá lớn! Giới hạn là 5MB.';
        return;
      }

      this.selectedFile = file;
      this.message = '';
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.message = 'Vui lòng chọn file!';
      return;
    }

    this.isUploading = true;
    this.submissionService.submitAssignment(1, 2, this.selectedFile)
      .subscribe({
        next: (response) => {
          this.message = 'Tải file thành công!';
          this.isUploading = false;
        },
        error: (error) => {
          this.message = error.message;
          this.isUploading = false;
        }
      });
  }
}
