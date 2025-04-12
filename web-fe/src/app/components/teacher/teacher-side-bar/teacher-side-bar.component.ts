import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { TeacherNavBarComponent } from "../teacher-nav-bar/teacher-nav-bar.component";



@Component({
  selector: 'app-teacher-side-bar',
  imports: [
    CommonModule,
    FooterComponent,
    RouterModule,
    HeaderComponent,
],
  templateUrl: './teacher-side-bar.component.html',
  styleUrl: './teacher-side-bar.component.scss'
})
export class TeacherSideBarComponent {

}
