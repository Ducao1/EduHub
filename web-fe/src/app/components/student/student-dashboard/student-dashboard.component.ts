import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../services/enrollment.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent {
  userId!: number;
  classes: any[] = [];

  constructor(private enrollmentService: EnrollmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getUserId() ?? 0;
    this.loadAllClassByStudent();
  }

  // Define an array of background colors based on the desired theme (blue, grey, white)
  cardBackgrounds: string[] = [
    '#eef2f7', // Very light blue-grey
    '#ffffff', // White
    '#e6f3ff', // Light blue
    '#f8f9fa', // Very light grey
    '#e9ecef', // Light grey
    '#cfe6ff'  // Slightly more vibrant light blue (matches profile border)
  ];

  // Define a corresponding array of text/primary colors for titles and links
  cardTextColors: string[] = [
    '#0052B4', // Dark blue (matches sidebar)
    '#4a5fd1', // Original primary blue
    '#007bff', // Bootstrap primary blue
    '#6c757d', // Muted grey
    '#343a40', // Dark grey
    '#0056b3'  // Darker blue for contrast
  ];

  getCardBackground(index: number): string {
    return '#ffffff'; // Set all card backgrounds to white
  }

  getCardTitleColor(index: number): string {
    // Use a consistent dark color for text
    return '#343a40'; // Dark grey for text
  }

  loadAllClassByStudent() {
    this.enrollmentService.getAllClassByStudentId(this.userId).subscribe({
      next: (response) => {
        debugger
        this.classes = response;
      },
      error: (error) => {
        debugger
        alert(`Lỗi khi lấy danh sách lớp: ${error.message}`);
      }
    });
  }
}
