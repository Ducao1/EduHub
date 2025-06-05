import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-side-bar',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './student-side-bar.component.html',
  styleUrl: './student-side-bar.component.scss'
})
export class StudentSideBarComponent {

}
