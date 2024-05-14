import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { QuillModule } from 'ngx-quill';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute} from '@angular/router';
import { combineLatest, map } from 'rxjs';
import {
  EditorOrderPut,
  FormFields,
  ImageAdd,
  ImageOrderPut,
} from '../interfaces/project.interface';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ButtonGroupComponent } from './button-group/button-group.component';


@Component({
  selector: 'app-project-form',
  standalone: true,
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    QuillModule,
    DragDropModule,
    ModalComponent,
    ButtonGroupComponent,
  ],
})
export class ProjectFormComponent implements OnInit {
  form: FormGroup;
  content: any = '';
  projectId: number = 0;

  isEditingText: boolean = false;
  isModalOpen = false;

  fields: FormFields[] = [];

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

  imageAdd: ImageAdd = {
    f_type_id: 0,
    index: 0,
    image: '',
  };

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ font: [] }],
      [{ color: [] }, { background: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      dynamicFields: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params['id'];
    this.loadProjectData(this.projectId);
  }

  get dynamicFields(): FormArray {
    return this.form.get('dynamicFields') as FormArray;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onChangedEditor(event: any): void {
    if (event.html) {
      this.content = event.html;
    }
  }

  loadProjectData(projectId: number): void {
    const imagesObservable = this.getImagesObservable(projectId);
    const textsObservable = this.getTextsObservable(projectId);

    combineLatest([imagesObservable, textsObservable]).subscribe(
      ([images, texts]) => {
        this.fields = this.combineAndSortFields(images, texts);
        this.populateForm(this.fields);
      },
      (error) => {
        console.error('Error al combinar datos:', error);
      }
    );
  }

  getImagesObservable(projectId: number) {
    return this.projectService.getProjectImages(projectId).pipe(
      map((response) => {
        if (response.success) {
          return response.data.images;
        } else {
          throw new Error('Error al obtener imágenes');
        }
      })
    );
  }

  getTextsObservable(projectId: number) {
    return this.projectService.getProjectTexts(projectId).pipe(
      map((response) => {
        if (response.success) {
          return response.data.texts;
        } else {
          throw new Error('Error al obtener textos');
        }
      })
    );
  }

  combineAndSortFields(images: any[], texts: any[]) {
    if (!Array.isArray(images) || !Array.isArray(texts)) {
      console.error('Error: Los datos no son arrays.');
      return [];
    }

    const combinedFields = [...images, ...texts].sort(
      (a, b) => a.index - b.index
    );
    return combinedFields;
  }

  populateForm(fields: FormFields[]): void {
    fields.forEach((field) => {
      switch (field.f_type_id) {
        case 1: // Imágenes
          this.addImageField(field);
          break;

        case 2: // Editores de texto
          this.addTextEditor(field);
          break;

        case 3: // Texto con imagen
          this.addTextImageField(field);
          break;

        default:
          console.warn('Tipo de campo desconocido:', field.f_type_id);
          break;
      }
    });
  }

  addImageField(field?: FormFields): void {
    const imagePath = field?.path || '';
    const projImgId = field?.proj_img_id || '';
    const index = field?.index || '';
    const fTypeId = field?.f_type_id || '';

    this.dynamicFields.push(
      this.fb.group({
        type: 'image',
        proj_img_id: projImgId,
        f_type_id: fTypeId,
        path: imagePath,
        index: index,
      })
    );
  }

  addTextEditor(field?: FormFields): void {
    const text = field?.text || '';
    const title = field?.title || '';
    const projTextId = field?.proj_text_id || '';
    const index = field?.index || '';

    this.dynamicFields.push(
      this.fb.group({
        type: 'editor',
        title,
        content: text,
        proj_text_id: projTextId,
        index: index,
      })
    );
  }

  addTextImageField(field?: FormFields): void {
    const text = field?.text || '';
    const image = field?.image || null;
    const index = field?.index || '';

    this.dynamicFields.push(
      this.fb.group({
        type: 'text-image',
        text,
        image,
        index: index,
      })
    );
  }

  removeField(index: number): void {
    const field = this.dynamicFields.at(index);
    const fieldType = field.get('type')?.value;
    const projTextId = field.get('proj_text_id')?.value;
    const projImgId = field.get('proj_img_id')?.value;

    this.dynamicFields.removeAt(index);

    switch (fieldType) {
      case 'image':
        this.projectService.deleteImage(projImgId).subscribe(
          (response) => {
            if (response.success) {
              console.log('Imagen eliminada exitosamente.');
              this.dynamicFields.removeAt(index);
              this.updateFieldIndices();
            } else {
              console.warn('No se pudo eliminar la imagen.');
            }
          },
          (error) => {
            console.error('Error al eliminar la imagen:', error);
          }
        );
        break;

      default:
        console.warn(`Tipo de campo desconocido o no soportado: ${fieldType}`);
        break;
    }
  }

  updateFieldIndices(): void {
    this.dynamicFields.controls.forEach((control, i) => {
      control.get('index')?.setValue(i);
    });
  }

  onDrop(event: CdkDragDrop<FormArray>): void {
    const previousOrder = this.dynamicFields.controls.map((control) => {
      return {
        type: control.get('type')?.value,
        proj_text_id: control.get('proj_text_id')?.value,
        proj_img_id: control.get('proj_img_id')?.value,
      };
    });

    moveItemInArray(
      this.dynamicFields.controls,
      event.previousIndex,
      event.currentIndex
    );

    // Update indices
    this.dynamicFields.controls.forEach((control, i) => {
      control.get('index')?.setValue(i);
    });

    const newOrder = this.dynamicFields.controls.map((control) => {
      return {
        type: control.get('type')?.value,
        proj_text_id: control.get('proj_text_id')?.value,
        proj_img_id: control.get('proj_img_id')?.value,
      };
    });


    const indexMapping = newOrder.map((newItem, i) => {
      const previousIndex = previousOrder.findIndex((oldItem) => {
        if (newItem.proj_img_id) {
          return oldItem.proj_img_id === newItem.proj_img_id;
        }
        if (newItem.proj_text_id) {
          return oldItem.proj_text_id === newItem.proj_text_id;
        }
        return false;
      });

      return {
        type: newItem.type,
        newIndex: i,
        previousIndex,
        proj_img_id: newItem.proj_img_id,
        proj_text_id: newItem.proj_text_id,
      };
    });

    // Now you have an accurate mapping of previous to new indices
    console.log('Updated field index mapping:', indexMapping);

    indexMapping.forEach((field) => {
      switch (field.type) {
        case 'image':
          this.imageOrder.proj_img_id = field.proj_img_id;
          this.imageOrder.previousIndex = field.previousIndex;
          this.imageOrder.newIndex = field.newIndex;
          this.updateImageOrder(this.imageOrder);
          break;

        case 'editor':
          this.editorOrder.proj_text_id = field.proj_text_id;
          this.editorOrder.previousIndex = field.previousIndex;
          this.editorOrder.newIndex = field.newIndex;
          this.updateEditorOrder(this.editorOrder);
          break;

        default:
          console.warn(`Unknown field type: ${field.type}`);
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

  submitForm(): void {
    if (!this.form.valid) {
      console.warn(
        'El formulario no es válido. Asegúrate de que todos los campos requeridos estén llenos.'
      );
      return;
    }
  
    this.dynamicFields.controls.forEach((field, index) => {
      const fieldType = field.get('type')?.value;
  
      switch (fieldType) {
        case 'image':
          this.imageAdd.f_type_id = 1;
          const imageFile = field.get('path')?.value;
          this.imageAdd.image = imageFile;
          this.imageAdd.index = index;
  
          if (imageFile) {
            const formData = new FormData();
            formData.append(`image`, this.imageAdd.image);
            formData.append('f_type_id', this.imageAdd.f_type_id.toString());
            formData.append('index', this.imageAdd.index.toString());
  
            this.uploadImage(formData);
          } else {
            console.warn(`Campo de imagen vacío: image_${index}`);
          }
          break;
  
        /* case 'editor':
          const title = field.get('title')?.value || '';
          const content = field.get('content')?.value || '';
          const projTextId = field.get('proj_text_id')?.value || '';
  
          const editorData = {
            title,
            content,
            projTextId,
            index,
          };
  
          this.projectService.uploadEditor(this.projectId, editorData).subscribe(
            (response) => {
              console.log('Editor enviado con éxito:', response);
            },
            (error) => {
              console.error('Error al enviar el editor:', error);
            }
          );
          break;
  
        case 'text-image':
          const text = field.get('text')?.value || '';
          const image = field.get('image')?.value || null;
  
          if (image) {
            const textImageFormData = new FormData();
            textImageFormData.append('text', text);
            textImageFormData.append('image', image);
            textImageFormData.append('index', index.toString());
  
            this.projectService.uploadTextImage(
              this.projectId,
              textImageFormData
            ).subscribe(
              (response) => {
                console.log('Texto e imagen enviados con éxito:', response);
              },
              (error) => {
                console.error('Error al enviar texto e imagen:', error);
              }
            );
          } else {
            console.warn(`Campo de imagen vacío para el campo 'text-image' en index ${index}`);
          }
          break; */
  
        default:
          console.warn(`Tipo de campo desconocido o no soportado: ${fieldType}`);
          break;
      }
    });
  }
  

  uploadImage(formData: FormData): void {
    this.projectService.addImageToProject(this.projectId, formData).subscribe(
      (response) => {
        console.log('Imagen subida con éxito:', response);
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }

  updateImageOrder(imageOrder: ImageOrderPut) {
    this.projectService.updateImageOrder(this.projectId, imageOrder).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Image order updated successfully');
        } else {
          console.warn('Failed to update order:', response);
        }
      },
      (error: any) => {
        console.error('Error while updating image order:', error);
      }
    );
  }

  updateEditorOrder(editorOrder: EditorOrderPut) {
    this.projectService
      .updateEditorOrder(this.projectId, editorOrder)
      .subscribe(
        (response: any) => {
          if (response.success) {
            console.log('Editor updated successfully');
          } else {
            console.warn('Failed to update editor order:', response);
          }
        },
        (error: any) => {
          console.error('Error while updating editor order:', error);
        }
      );
  }
}
