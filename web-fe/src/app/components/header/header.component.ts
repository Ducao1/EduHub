import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isDropdownOpen: any;
  currentUser: any;
  email: string = 'abc@gmail.com';

  userName = 'Nguyễn Văn A';
  dropdownOpen = false;

  constructor(
    private router: Router
  ) { }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#userDropdown')) {
      this.isDropdownOpen = false;
    }
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
