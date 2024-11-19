import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalComponent } from './../../../../shared/components/ui/modal/modal.component';
import { ProjectPostData } from '../../../../core/interfaces/project.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProjectService } from '../../../projects/services/project.service';
import { LoaderComponent } from '../../../../shared/components/ui/loader/loader.component';
import { ToastService } from '../../../../shared/components/ui/toast/toast.service';
import { CategoryPostResponse } from '../../../../core/interfaces/category.interface';
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";

@Component({
  selector: 'app-add-project',
  standalone: true,
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss',
  imports: [CommonModule, FormsModule, ModalComponent, LoaderComponent, ButtonComponent],
})
export class AddProjectComponent {
  @Input() isModalOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  project: ProjectPostData = {
    name: '',
    description: '',
    path: '',
  };

  isLoading = false;

  @ViewChild('f', { static: false }) projectForm!: NgForm;

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService
  ) {}

  closeModal() {
    this.projectForm.resetForm();
    this.isModalOpen = false;
    this.closeEvent.emit();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.project.path = file;
    }
  }

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  createProject() {
    this.isLoading = true;

    const formData = new FormData();

    formData.append('name', this.project.name);
    formData.append('description', this.project.description);
    formData.append('path', this.project.path);

    this.projectService.createProject(formData).subscribe(
      (response: CategoryPostResponse) => {
        if (response.success) {
          //this.isLoading = false;
          this.showSuccessToast('Proyecto creado exitosamente');
          this.closeModal();
        }
      },
      (error) => {
        //this.isLoading = false;
      }
    );
  }
}
