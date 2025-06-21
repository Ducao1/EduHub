import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StudentNavBarComponent } from "../student-nav-bar/student-nav-bar.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-score',
  imports: [
    CommonModule,
    StudentNavBarComponent
  ],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent implements OnInit {
  classId!: number;
  scores: any[] = [];

  constructor(
    private route: ActivatedRoute,
  ){
  }
  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
  }

}
