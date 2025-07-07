import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { User } from '../../interfaces/user';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { NotificationComponent } from '../notification/notification.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NotificationComponent,
        FormsModule
    ],
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
    dropdownOpen = false;
    userId!: number;
    userInfo: User | null = null;
    notificationType: 'success' | 'warning' | 'error' = 'success';
    notificationMessage: string = '';
    showConfirmSwitchPopup = false;
    searchText = '';
    users: any[] = [];
    filteredUsers: any[] = [];

    constructor(
        private router: Router,
        private userService: UserService,
        private tokenService: TokenService
    ) { }

    ngOnInit() {
        this.userId = this.userService.getUserId() ?? 0;
        if (this.userId) {
            this.userService.getUserById(this.userId).subscribe({
                next: (user) => this.userInfo = user,
                error: () => this.userInfo = null
            });
        }
        this.userService.getAllUsers().subscribe((data: any[]) => {
            this.users = data;
            this.filteredUsers = data;
        });
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }

    closeDropdown() {
        setTimeout(() => this.dropdownOpen = false, 150);
    }

    viewProfile(event: Event) {
        event.stopPropagation();
        this.dropdownOpen = false;
        this.router.navigate(['/admin/profile', this.userId]);
    }

    logout(event?: Event) {
        if (event) event.stopPropagation();
        this.tokenService.clearToken();
        this.router.navigate(['/login']);
    }

    closeNotification() {
        this.notificationMessage = '';
    }

    goToDashboard() {
        this.router.navigate(['/admin/dashboard']);
    }

    onSearch() {
        const value = this.searchText.toLowerCase();
        this.filteredUsers = this.users.filter(user =>
            (user.fullName && user.fullName.toLowerCase().includes(value)) ||
            (user.email && user.email.toLowerCase().includes(value)) ||
            (user.phoneNumber && user.phoneNumber.includes(value))
        );
    }
} 