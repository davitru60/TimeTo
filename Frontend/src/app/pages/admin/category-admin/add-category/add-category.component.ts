import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from "../../../../shared/components/ui/modal/modal.component";
import { FormsModule } from '@angular/forms';
import { CategoryPostData, CategoryPostResponse } from '../../../../core/interfaces/category.interface';
import { ProjectService } from '../../../projects/services/project.service';
import { ToastService } from '../../../../shared/components/ui/toast/toast.service';
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";

@Component({
    selector: 'app-add-category',
    standalone: true,
    templateUrl: './add-category.component.html',
    styleUrl: './add-category.component.scss',
    imports: [CommonModule, FormsModule, ModalComponent, ButtonComponent]
})
export class AddCategoryComponent {
  @Input() isModalOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  category: CategoryPostData ={
    name: '',
  }

  constructor(private projectService: ProjectService, private toastService:ToastService){

  }

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  closeModal() {   
    this.isModalOpen = false;
    this.closeEvent.emit();
  }

  createCategory(){
    this.projectService.createCategory(this.category).subscribe(
      (response:CategoryPostResponse)=>{
        if(response.success){
          this.showSuccessToast('Categoría creada exitosamente');
          this.closeModal();
        }
      })
  }


}
