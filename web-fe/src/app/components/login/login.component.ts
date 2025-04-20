import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { LoginDTO } from '../../dtos/login.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '0943220886';
  password: string = '123456';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
  ) { }

  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password
    };
  
    this.userService.login(loginDTO).subscribe({
      next: (response: any) => {
        debugger
        const token = response.token;
        this.tokenService.saveToken(token);
  
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        const phoneNumber = payload.phoneNumber;
        const role = payload.role;

        //them cho tien sau nay lay khong can decode token
        localStorage.setItem('id', userId.toString());
        localStorage.setItem('phoneNumber', phoneNumber);
        localStorage.setItem('role', role);
  
        if (role === "TEACHER") {
          this.router.navigate(['/teacher/dashboard']);
        } else if (role === "STUDENT") {
          this.router.navigate(['/student/dashboard']);
        } else {
          alert("Vai trò không hợp lệ!");
        }
      },
      error: (error: any) => {
        debugger
        alert(error.error);
      }
    });
  }
  
  
  

  createAccount() {
    debugger
    this.router.navigate(['/register']);
  }
}
