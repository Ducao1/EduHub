import { Component, NgModule, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from "../header/header.component";
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/register.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  fullName: string;
  phoneNumber: string;
  password: string;
  // retypePassword: string;

  constructor(private router: Router, private userService: UserService) {
    debugger
    this.phoneNumber = '';
    this.password = '';
    // this.retypePassword = '';
    this.fullName = '';
  }

  register() {
    const message = `fullame: ${this.fullName}` +
      `phone: ${this.phoneNumber}` +
      `password: ${this.password}`;
    debugger
    const registerDTO: RegisterDTO = {
      "full_name": this.fullName,
      "phone_number": this.phoneNumber,
      "password": this.password,
    }

    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        debugger
        const confirmation = window
          .confirm('Đăng ký thành công, mời bạn đăng nhập. Bấm "OK" để chuyển đến trang đăng nhập.');
        if (confirmation) {
          this.router.navigate(['/login']);
        }
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        alert(error.error);
      }
    })

  }
}
