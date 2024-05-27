import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from "../../../../shared/components/ui/modal/modal.component";
import { FormsModule } from '@angular/forms';
import { CategoryPost } from '../../../projects/interfaces/project.interface';
import { ProjectService } from '../../../projects/services/project.service';
import { ToastService } from '../../../../shared/components/ui/toast/toast.service';

@Component({
    selector: 'app-add-category',
    standalone: true,
    templateUrl: './add-category.component.html',
    styleUrl: './add-category.component.scss',
    imports: [CommonModule,FormsModule, ModalComponent]
})
export class AddCategoryComponent {
  @Input() isModalOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  category: CategoryPost ={
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

  createProjectCategory(){
    this.projectService.createProjectCategory(this.category).subscribe(
      (subscribe:any)=>{
        this.showSuccessToast('Categoría creada exitosamente');
        this.closeModal();
      })
  }


}
