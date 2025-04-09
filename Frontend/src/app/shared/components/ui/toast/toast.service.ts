import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastMessage } from './toast.interface';



@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toastState = this.toastSubject.asObservable();

  showToast(message: ToastMessage) {
    this.toastSubject.next(message);
  }
}
