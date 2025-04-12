import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName = 'Nguyễn Văn A';
  dropdownOpen = false;

  handleAction(action: number) {
    switch (action) {
      case 0:
        console.log('Đi tới trang thông tin tài khoản');
        break;
      case 1:
        console.log('Đăng ký làm giáo viên');
        break;
      case 2:
        console.log('Đăng xuất');
        break;
    }
  }



toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

}
