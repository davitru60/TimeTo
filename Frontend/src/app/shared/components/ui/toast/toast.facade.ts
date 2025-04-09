import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ToastFacade {
  constructor(private toastService: ToastService) {}

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  showErrorToast(message:string){
    this.toastService.showToast({ text: message, type: 'error' });
  }

  showInfoToast(message:string){
    this.toastService.showToast({ text: message, type: 'info' });
  }
  
  showWarningToast(message:string){
    this.toastService.showToast({ text: message, type: 'warning' });
  }
}
