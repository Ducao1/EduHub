import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/requests/register.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  roleId: number = 1; // Default to STUDENT
  passwordVisible: boolean = false;
  availableRoles: any[] = [];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadAvailableRoles();
  }

  loadAvailableRoles() {
    this.userService.getAvailableRoles().subscribe({
      next: (roles: any) => {
        this.availableRoles = roles;
      },
      error: (error: any) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  register() {
    if (!this.fullName || !this.email || !this.password) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    this.isLoading = true;

    const registerDTO: RegisterDTO = {
      full_name: this.fullName,
      email: this.email,
      password: this.password,
      role_id: this.roleId
    };

    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        debugger
        this.isLoading = false;
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        debugger
        this.isLoading = false;
        console.error('Registration error:', error);
        const errorMessage = error?.error?.error || error?.error || 'Đăng ký thất bại';
        alert(errorMessage);
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
