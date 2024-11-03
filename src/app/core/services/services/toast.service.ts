import { Injectable } from '@angular/core';

export interface Toast {
	toastType: string;
  classname: string;
	toastMessage: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toastType: string;
	toasts: Toast[] = [];

	showInfo(toastMessage: string) {
		this.toasts.push({
      toastType: 'info',
      classname: 'border border-primary text-dark',
      toastMessage: toastMessage
    });
	}

  showSuccess(toastMessage: string){
    this.toasts.push({
      toastType: 'success',
      classname: 'bg-success text-light',
      toastMessage: toastMessage
    });
  }

  showError(toastMessage: string){
    this.toasts.push({
      toastType: 'error',
      classname: 'bg-danger text-light',
      toastMessage: toastMessage
    });
  }

  showWarning(toastMessage: string){
    this.toasts.push({
      toastType: 'warning',
      classname: 'bg-warning text-dark',
      toastMessage: toastMessage
    });
  }

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}