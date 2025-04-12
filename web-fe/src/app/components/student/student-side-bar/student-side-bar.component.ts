import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-student-side-bar',
  imports: [
    CommonModule,
    FooterComponent,
    RouterModule,
    HeaderComponent,
  ],
  templateUrl: './student-side-bar.component.html',
  styleUrl: './student-side-bar.component.scss'
})
export class StudentSideBarComponent {

}
