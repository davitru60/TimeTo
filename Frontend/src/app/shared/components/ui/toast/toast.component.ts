import { Component } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastMessage } from './toast.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  toasts: ToastMessage[] = [];
  display = false;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toastState.subscribe((toast: ToastMessage) => {
      this.display = true;
      this.toasts.push(toast);
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t !== toast);
        if (this.toasts.length === 0) {
          this.display = false;
        }
      }, 1500);
    });
  }

  closeToast(toast: ToastMessage) {
    this.toasts = this.toasts.filter(t => t !== toast);
    if (this.toasts.length === 0) {
      this.display = false;
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-times-circle';
      case 'info':
        return 'fas fa-info-circle';
      case 'warning':
        return 'fas fa-exclamation-circle';
      default:
        return '';
    }
  }
}
