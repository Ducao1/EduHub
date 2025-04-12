import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ExamComponent } from './components/teacher/exam/exam.component';
import { TeacherDashboardComponent } from './components/teacher/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';
import { AddClassComponent } from './components/teacher/teacher-dashboard/add-class/add-class.component';
import { JoinClassComponent } from './components/student/student-dashboard/join-class/join-class.component';
import { DetailExamComponent } from './components/teacher/exam/detail-exam/detail-exam.component';
import { DetailStudentClassComponent } from './components/student/student-dashboard/detail-student-class/detail-student-class.component';
import { DetailTeacherClassComponent } from './components/teacher/teacher-dashboard/detail-teacher-class/detail-teacher-class.component';
import { AddExamComponent } from './components/teacher/exam/add-exam/add-exam.component';
import { AddAssignmentComponent } from './components/teacher/assignment/add-assignment/add-assignment.component';
import { TeacherSideBarComponent } from './components/teacher/teacher-side-bar/teacher-side-bar.component';
import { StudentSideBarComponent } from './components/student/student-side-bar/student-side-bar.component';
import { AddStudentComponent } from './components/teacher/teacher-dashboard/add-student/add-student.component';
import { ListStudentComponent } from './components/teacher/teacher-dashboard/list-student/list-student.component';
import { TeacherListAssignmentComponent } from './components/teacher/assignment/teacher-list-assignment/teacher-list-assignment.component';
import { ClassListAssignmentComponent } from './components/teacher/assignment/class-list-assignment/class-list-assignment.component';
import { DetailAssignmentComponent } from './components/teacher/assignment/detail-assignment/detail-assignment.component';
import { StudentDetailAssignmentComponent } from './components/student/student-detail-assignment/student-detail-assignment.component';
import { AddQuestionComponent } from './components/teacher/exam/add-question/add-question.component';
import { UpdateQuestionComponent } from './components/teacher/exam/update-question/update-question.component';
import { TryExamComponent } from './components/teacher/exam/try-exam/try-exam.component';
import { ListExamComponent } from './components/student/list-exam/list-exam.component';
import { ListAssignmentComponent } from './components/student/list-assignment/list-assignment.component';
import { TakeExamComponent } from './components/student/take-exam/take-exam.component';
import { AssignExamComponent } from './components/teacher/exam/assign-exam/assign-exam.component';
import { ListScoreComponent } from './components/teacher/teacher-dashboard/list-score/list-score.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'student', component: StudentSideBarComponent, children:[
    { path: 'dashboard', component: StudentDashboardComponent },
    { path: 'detail-class/:id', component: DetailStudentClassComponent },
    { path: 'join-class', component: JoinClassComponent },
    { path: 'list-assignment/:id', component: ListAssignmentComponent },
    { path: 'detail-assignment/:id', component: StudentDetailAssignmentComponent },
    { path: 'list-exam/:id', component: ListExamComponent },
    { path: 'take-exam/:id', component: TakeExamComponent },
    {
      path: 'result-exam/:id',
      loadComponent: () => import('./components/student/result-exam/result-exam.component').then(m => m.ResultExamComponent)
    }    
  ]},

  { path: 'teacher', component: TeacherSideBarComponent, children: [
    { path: 'dashboard', component: TeacherDashboardComponent },

    { path: 'add-class', component: AddClassComponent },
    { path: 'detail-class/:id', component: DetailTeacherClassComponent },
    { path: 'class/:id', component: ListStudentComponent },
    { path: 'class/:id/add-student', component: AddStudentComponent },

    { path: 'detail-exam/:id', component: DetailExamComponent },
    { path: 'add-exam', component: AddExamComponent },
    { path: 'exam', component: ExamComponent },
    { path: 'add-question/:id', component: AddQuestionComponent },
    { path: 'update-question/:id', component: UpdateQuestionComponent },
    { path: 'try-exam/:id', component: TryExamComponent },
    { path: 'assign-exam/:id', component: AssignExamComponent },
    { path: 'list-score/:id', component: ListScoreComponent },

    { path: 'add-assignment/:id', component: AddAssignmentComponent },
    { path: 'assignments', component: TeacherListAssignmentComponent },
    { path: 'assignment/:id', component: ClassListAssignmentComponent },
    { path: 'detail-assignment/:id', component: DetailAssignmentComponent },
  ] 
},
];
