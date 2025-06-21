import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClassroomService } from '../../../../services/classroom.service';
import { CommonModule } from '@angular/common';
import { StudentNavBarComponent } from "../../student-nav-bar/student-nav-bar.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-student-class',
  standalone: true,
  imports: [
    CommonModule,
    StudentNavBarComponent,
    RouterModule,
    FormsModule
  ],
  templateUrl: './detail-student-class.component.html',
  styleUrl: './detail-student-class.component.scss'
})
export class DetailStudentClassComponent implements OnInit{
  classId!: number;
  className: string = '';
  classDescription: string = '';
  isCreatingAnnouncement = false;
  announcementContent = '';
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private classroomService: ClassroomService
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

  toggleAnnouncementCreator(state?: boolean): void {
    if (state !== undefined) {
      this.isCreatingAnnouncement = state;
    } else {
      this.isCreatingAnnouncement = !this.isCreatingAnnouncement;
    }
    if (!this.isCreatingAnnouncement) {
      this.announcementContent = '';
      this.selectedFile = null;
    }
  }

  postAnnouncement(): void {
    console.log('Posting announcement:', this.announcementContent);
    console.log('Attached file:', this.selectedFile);
    // Logic to call service will be added here in the future
    this.toggleAnnouncementCreator(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }
}
