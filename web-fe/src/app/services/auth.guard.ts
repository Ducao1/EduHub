import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userData = this.userService.getUserData();
    const currentRole = userData?.currentRole;

    const requiredRole = route.data['role'];
    if (requiredRole && currentRole !== requiredRole) {
      if (currentRole === 'TEACHER') {
        this.router.navigate(['/teacher/dashboard']);
      } else if (currentRole === 'STUDENT') {
        this.router.navigate(['/student/dashboard']);
      } else if (currentRole === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }

    return true;
  }
} 