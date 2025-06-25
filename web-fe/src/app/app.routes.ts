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
import { ScoreComponent } from './components/student/score/score.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ListClassComponent } from './components/teacher/teacher-dashboard/list-class/list-class.component';
import { TeacherLayoutComponent } from './components/teacher/teacher-layout/teacher-layout.component';
import { StudentLayoutComponent } from './components/student/student-layout/student-layout.component';
import { ConfirmExamComponent } from './components/student/confirm-exam/confirm-exam.component';
import { ResultExamComponent } from './components/student/result-exam/result-exam.component';
import { ClassListExamComponent } from './components/teacher/exam/class-list-exam/class-list-exam.component';
import { SessionExamComponent } from './components/teacher/exam/session-exam/session-exam.component';
import { ListSubmissionAssignmentComponent } from './components/teacher/assignment/list-submission-assignment/list-submission-assignment.component';
import { ListScoreAssignmentComponent } from './components/teacher/assignment/list-score-assignment/list-score-assignment.component';
import { ListScoreExamComponent } from './components/teacher/exam/list-score-exam/list-score-exam.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  {
    path: 'student', component: StudentLayoutComponent, children: [
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'detail-class/:classId', component: DetailStudentClassComponent },
      { path: 'join-class', component: JoinClassComponent },
      { path: 'list-assignment/:classId', component: ListAssignmentComponent },
      { path: 'detail-assignment/:classId/:assignmentId', component: StudentDetailAssignmentComponent },
      { path: 'list-exam/:classId', component: ListExamComponent },
      { path: 'score/:classId', component: ScoreComponent },

    ]
  },

  {
    path: 'teacher', component: TeacherLayoutComponent, children: [
      // { path: 'dashboard', component: TeacherDashboardComponent },
      // { path: 'list-class', component: ListClassComponent },

      { path: 'dashboard', component: ListClassComponent },
      { path: 'add-class', component: AddClassComponent },
      { path: 'detail-class/:classId', component: DetailTeacherClassComponent },
      { path: 'class/:classId', component: ListStudentComponent },
      { path: 'class/:classId/add-student', component: AddStudentComponent },

      { path: 'detail-exam/:id', component: DetailExamComponent },
      { path: 'add-exam', component: AddExamComponent },
      { path: 'exam', component: ExamComponent },
      { path: 'add-question/:id', component: AddQuestionComponent },
      { path: 'update-question/:id', component: UpdateQuestionComponent },

      { path: 'assign-exam/:id', component: AssignExamComponent },
      { path: 'list-score/:id', component: ListScoreComponent },
      { path: 'class/exams/:classId', component: ClassListExamComponent },
      { path: 'exam-scores/:id', component: ListScoreComponent },

      { path: 'add-assignment/:id', component: AddAssignmentComponent },
      { path: 'assignments', component: TeacherListAssignmentComponent },
      { path: 'class/assignments/:classId', component: ClassListAssignmentComponent },
      { path: 'list-submission-assignment/:classId/:assignmentId', component: ListSubmissionAssignmentComponent },
      { path: 'assignment/:classId/:assignmentId/scores', component: ListScoreAssignmentComponent },
      { path: 'assignment/:assignmentId/submission/:studentId', component: DetailAssignmentComponent },
      { path: 'exam/:classId/:examId/scores', component: ListScoreExamComponent },
    ]
  },
  { path: 'try-exam/:examId', component: TryExamComponent },
  { path: 'take-exam/:examId/class/:classId', component: TakeExamComponent },
  { path: 'confirm-exam/:examId/class/:classId', component: ConfirmExamComponent },
  { path: 'result-exam/:id', component: ResultExamComponent },
  { path: 'session-exam/:examId/class/:classId', component: SessionExamComponent },
];
