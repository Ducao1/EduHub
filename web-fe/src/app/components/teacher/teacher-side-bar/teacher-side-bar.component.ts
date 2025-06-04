import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-side-bar',
  imports: [
    CommonModule,
    RouterModule,
],
  templateUrl: './teacher-side-bar.component.html',
  styleUrl: './teacher-side-bar.component.scss'
})
export class TeacherSideBarComponent {

}
