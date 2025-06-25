import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-nav-bar',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './teacher-nav-bar.component.html',
  styleUrl: './teacher-nav-bar.component.scss'
})
export class TeacherNavBarComponent {
  classId!: number;
  @Input() className: string = '';

  constructor(
    private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
  }
}
