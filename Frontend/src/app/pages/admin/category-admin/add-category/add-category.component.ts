import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CategoryPostData,
  CategoryPostResponse,
} from '../../../../core/interfaces/category.interface';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { ToastFacade } from '../../../../shared/components/ui/toast/toast.facade';
import { SuccessCategoryToastMessages } from '../../../../shared/components/ui/toast/toastMessages';
import { CategoryFacade } from '../../facades/category.facade';

@Component({
  selector: 'app-add-category',
  standalone: true,
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
  imports: [CommonModule, FormsModule, ModalComponent, ButtonComponent],
})
export class AddCategoryComponent {
  @Input() isModalOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  category: CategoryPostData = {
    name: '',
  };

  constructor(
    private categoryFacade: CategoryFacade,
    private toastFacade: ToastFacade
  ) {}

  closeModal() {
    this.isModalOpen = false;
    this.closeEvent.emit();
  }

  createCategory() {
    this.categoryFacade.createCategory(this.category).subscribe({
      next: (response: CategoryPostResponse) => {
        if (response.success) {
          this.toastFacade.showSuccessToast(SuccessCategoryToastMessages.CATEGORY_CREATE_MESSAGE)
          this.closeModal();
        }
      },
    });
  }
}
