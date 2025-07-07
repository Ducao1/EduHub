import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClassroomService } from '../../../../services/classroom.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-list-class',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './list-class.component.html',
  styleUrl: './list-class.component.scss'
})
export class ListClassComponent {
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

  cardBackgrounds: string[] = [
    '#eef2f7',
    '#ffffff',
    '#e6f3ff',
    '#f8f9fa',
    '#e9ecef',
    '#cfe6ff'
  ];

  cardTextColors: string[] = [
    '#0052B4',
    '#4a5fd1',
    '#007bff',
    '#6c757d',
    '#343a40',
    '#0056b3' 
  ];

  getCardBackground(index: number): string {
    return '#ffffff';
  }

  getCardTitleColor(index: number): string {
    return '#343a40';
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
