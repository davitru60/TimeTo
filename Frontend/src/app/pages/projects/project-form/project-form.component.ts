import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import {
  EditorOrderPut,
  FormFields,
  ImageOrderPut,
  Project,
  ProjectHomeImagePutData,
} from '../../../core/interfaces/project.interface';
import { TextPutData } from '../../../core/interfaces/project-text.interface';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { combineLatest } from 'rxjs';
import { ProjectLoaderService } from '../services/project-loader.service';
import { DynamicFieldService } from '../services/dynamicfield.service';
import { ProjectInteractionsService } from '../services/project-interactions.service';
import { OnDropService } from '../services/on-drop.service';
import { editorModules } from '../../../shared/conf/editor-config';
import { ToastComponent } from '../../../shared/components/ui/toast/toast.component';
import { ImageSelectorComponent } from '../../../shared/components/ui/image-selector/image-selector.component';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    DragDropModule,
    ModalComponent,
    ButtonGroupComponent,
    ToastComponent,
    ImageSelectorComponent
],
})
export class ProjectFormComponent {
  form: FormGroup;
  content: any = '';
  projectId: number = 0;
  imageOption: string = '';
  imageModalStyle = 'lg:w-1/2';



  isEditingText: boolean = false;
  isDropdownOpen = false;
  isEditModalOpen: boolean[] = [];
  isAddModalOpen: boolean[] = [];
  isImageModalOpen: boolean[] = [];

  fields: FormFields[] = [];
  images: any[] = [];

  imageOrder: ImageOrderPut = {
    proj_img_id: 0,
    previousIndex: 0,
    newIndex: 0,
  };

  editorOrder: EditorOrderPut = {
    proj_text_id: 0,
    previousIndex: 0,
    newIndex: 0,
  };

  textAdd: TextPutData = {
    title: '',
    text: '',
    proj_text_id: '',
    previousIndex: 0,
  };

  projectHomeImage: ProjectHomeImagePutData = {
    project_id: 0,
    path: '',
  };

  editorModules = editorModules;

  constructor(
    private fb: FormBuilder,
    private onDropService: OnDropService,
    private projectLoaderService: ProjectLoaderService,
    private dynamicFieldService: DynamicFieldService,
    private projectInteractionsService: ProjectInteractionsService,
    private route: ActivatedRoute,
    private toastService: ToastService,
     private projectService: ProjectService,
  ) {
    this.form = this.fb.group({
      dynamicFields: this.fb.array([]),
    });
    this.projectId = this.route.snapshot.params['id'];
    this.loadProjectData(this.projectId);
    this.getImages()
  }

  get dynamicFields(): FormArray {
    return this.form.get('dynamicFields') as FormArray;
  }

  openEditModal(index: number) {
    this.isEditModalOpen[index] = true;
  }

  closeEditModal(index: number) {
    this.isEditModalOpen[index] = false;
  }

  openAddModal(index: number) {
    this.isAddModalOpen[index] = true;
  }

  closeAddModal(index: number) {
    this.isAddModalOpen[index] = false;
  }

  openImageModal(index: number) {
    console.log(index)
    this.isImageModalOpen[index] = true;
    this.imageOption = '';
    this.isDropdownOpen = false;
  }

  closeImageModal(index: number) {
    this.isImageModalOpen[index] = false;
  }

  onChangedEditor(event: any): void {
    if (event.html) {
      this.content = event.html;
    }
  }

  disableDrag() {
    this.isEditingText = true;
  }

  enableDrag() {
    this.isEditingText = false;
  }

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  loadProjectData(projectId: number): void {
    const imagesObservable =
      this.projectLoaderService.getImagesObservable(projectId);
    const textsObservable =
      this.projectLoaderService.getTextsObservable(projectId);

    combineLatest([imagesObservable, textsObservable]).subscribe(
      ([images, texts]) => {
        const fields = this.projectLoaderService.combineAndSortFields(
          images,
          texts
        );
        this.populateForm(fields);
      },
      (error) => {
        console.error('Error al combinar datos:', error);
      }
    );
  }

  populateForm(fields: FormFields[]): void {
    fields.forEach((field) => {
      switch (field.f_type_id) {
        case 1:
          this.dynamicFieldService.addImageField(this.dynamicFields, field);
          break;

        case 2:
          this.dynamicFieldService.addTextEditorField(
            this.dynamicFields,
            field
          );
          break;

        case 3:
          this.dynamicFieldService.addTextImageField(this.dynamicFields, field);
          break;

        default:
          console.warn('Tipo de campo desconocido:', field.f_type_id);
          break;
      }
    });
  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.dynamicFields.at(index).get('path')?.setValue(file);
    }
  }

  getImages() {
    this.projectService.getImages().subscribe({
      next: (response: any) => {
        console.log(response)
        this.images = response.data.images;
      },
    });
  }

  //Form building
  addImageField() {
    this.dynamicFieldService.addImageField(this.dynamicFields);
  }

  addTextEditor() {
    this.dynamicFieldService.addTextEditorField(this.dynamicFields);
  }

  addTextImageField() {
    this.dynamicFieldService.addTextImageField(this.dynamicFields);
  }

  removeField(index: number): void {
    this.dynamicFieldService.removeField(
      this.dynamicFields,
      index,
      this.projectId
    );
  }

  onDrop(event: CdkDragDrop<FormArray>): void {
    this.onDropService.onDrop(this.projectId, this.dynamicFields, event);
  }

  //Project operations
  addImageToProject(index: number): void {
    this.projectInteractionsService.addImageToProject(
      this.projectId,
      index,
      this.dynamicFields
    );
    this.closeAddModal(index);
  }

  addProjectTexts(index: number): void {
    this.projectInteractionsService.addProjectTexts(
      this.projectId,
      index,
      this.dynamicFields
    );
  }

  addNewTextImage(index: number): void {}

  updateImageField(index: number): void {
    this.projectInteractionsService.updateImageField(
      this.projectId,
      index,
      this.dynamicFields
    );
  }

  updateProjectTexts(index: number): void {
    this.projectInteractionsService.updateProjectTexts(
      this.projectId,
      index,
      this.dynamicFields
    );
    this.closeEditModal(index);
  }

  updateTextImageField(index: number): void {}

  selectImage(image: any, index: number) {
    const field = this.dynamicFields.at(index); // Accede al campo en el FormArray
  
    if (field) {
      // Actualiza el valor del campo 'path' con la imagen seleccionada
      field.get('path')?.setValue(image.name);

      if(image.file){
        const url = URL.createObjectURL(image.file)
        field.get('path')?.setValue(url);
      }

      this.showSuccessToast(`Imagen seleccionada: ${image.name}`);
    } else {
      console.error(`No se encontró el campo para el índice: ${index}`);
    }
  }
}
