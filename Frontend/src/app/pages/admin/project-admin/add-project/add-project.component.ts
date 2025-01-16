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
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ImageSelectorComponent } from '../../../../shared/components/ui/image-selector/image-selector.component';

@Component({
  selector: 'app-add-project',
  standalone: true,
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    LoaderComponent,
    ButtonComponent,
    ImageSelectorComponent,
  ],
})
export class AddProjectComponent {
  @Input() isModalOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  project: ProjectPostData = {
    name: '',
    description: '',
    path: '',
  };

  images: any[] = [];

  isLoading = false;
  isImageModalOpen = false;
  imageOption: string = '';
  isDropdownOpen = false;
  selectedImage: string = '';

  @ViewChild('f', { static: false }) projectForm!: NgForm;
  imageModalStyle = 'lg:w-1/2';

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService
  ) {
    this.getImages();
  }

  closeModal() {
    this.projectForm.resetForm();
    this.isModalOpen = false;
    this.closeEvent.emit();
  }

  openImageModal(index: number) {
    this.isImageModalOpen = true;
    this.imageOption = '';
    this.isDropdownOpen = false;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
  }

  cancelImageUpload() {
    this.closeImageModal();
  }

  imageSelected() {
    this.closeImageModal();
  }

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  getImages() {
    this.projectService.getImages().subscribe({
      next: (response: any) => {
        this.images = response.data.images;
      },
    });
  }

  handleImageSelection(eventOrImage: any, isFile: boolean) {
    if (isFile) {
      const file = eventOrImage.target.files[0];
      if (file) {
        this.selectedImage = file;
      }
    } else {
      this.selectedImage = eventOrImage.name;
      this.project.path = eventOrImage.name;

      this.showSuccessToast(`Imagen seleccionada: ${eventOrImage.name}`);
    }
  }

  createProject() {
    this.isLoading = true;
    this.project.path = this.selectedImage;

    const formData = new FormData();

    formData.append('name', this.project.name);
    formData.append('description', this.project.description);
    formData.append('path', this.project.path);

    this.projectService.createProject(formData).subscribe({
      next: (response: CategoryPostResponse) => {
        if (response.success) {
          //this.isLoading = false;
          this.showSuccessToast('Proyecto creado exitosamente');
          this.closeModal();
        }
      },
    });
  }
}
