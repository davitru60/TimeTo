import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoryPostResponse } from '../../../../core/interfaces/category.interface';
import { ProjectPostData } from '../../../../core/interfaces/project.interface';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ImageSelectorComponent } from '../../../../shared/components/ui/image-selector/image-selector.component';
import { LoaderComponent } from '../../../../shared/components/ui/loader/loader.component';
import { ToastFacade } from '../../../../shared/components/ui/toast/toast.facade';
import { SuccessProjectToastMessages } from '../../../../shared/components/ui/toast/toastMessages';
import { ProjectService } from '../../../projects/services/project.service';
import { ModalComponent } from './../../../../shared/components/ui/modal/modal.component';

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
    private toastFacade: ToastFacade
  ) {
    this.getImages();
  }

  closeModal() {
    this.projectForm.resetForm();
    this.isModalOpen = false;
    this.closeEvent.emit();
  }

  openImageModal() {
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

      this.toastFacade.showSuccessToast(`Imagen seleccionada: ${eventOrImage.name}`);

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
          this.toastFacade.showSuccessToast(SuccessProjectToastMessages.PROJECT_CREATE_MESSAGE);
          this.closeModal();
        }
      },
    });
  }
}
