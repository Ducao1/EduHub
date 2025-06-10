import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StudentNavBarComponent } from "../student-nav-bar/student-nav-bar.component";

@Component({
  selector: 'app-score',
  imports: [
    CommonModule,
    StudentNavBarComponent
],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent {
scores: any[]=[];

}
