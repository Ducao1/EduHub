import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './student-nav-bar.component.html',
  styleUrl: './student-nav-bar.component.scss'
})
export class StudentNavBarComponent {
  classId!: number;
  @Input() className: string | undefined;

  constructor(
    private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
  }
}
