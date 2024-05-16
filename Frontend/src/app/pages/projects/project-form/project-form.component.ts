import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { QuillModule } from 'ngx-quill';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { EditorOrderPut, FormFields, ImageAdd, ImageOrderPut } from '../interfaces/project.interface';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { combineLatest, map } from 'rxjs';

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
export class ProjectFormComponent {
  form: FormGroup;
  content: any = '';
  projectId: number = 0;

  isEditingText: boolean = false;
  isEditModalOpen: boolean[] = [];
  isAddModalOpen: boolean[] = [];

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
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      dynamicFields: this.fb.array([]),
    });
    this.projectId = this.route.snapshot.params['id'];
    this.loadProjectData(this.projectId);
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
        const fields = this.combineAndSortFields(images, texts);
        this.populateForm(fields);
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

  combineAndSortFields(images: any[], texts: any[]): FormFields[] {
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
        case 1:
          this.addImageField(field);
          break;

        case 2:
          this.addTextEditor(field);
          break;

        case 3:
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
    console.log('abriendo modal:', index);
    if (file) {
      this.dynamicFields.at(index).get('path')?.setValue(file);
    }
  }

  /*
  
  processEditorFields(): void {
    for (let i = 0; i < this.dynamicFields.length; i++) {
      const control = this.dynamicFields.at(i);
      if (control.get('type')?.value === 'editor') {
        const title = control.get('title')?.value || '';
        const content = control.get('content')?.value || '';
        const projTextId = control.get('proj_text_id')?.value || '';
  
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('projTextId', projTextId);
  
        console.log(`Datos del editor ${i + 1} a enviar:`);
        formData.forEach((value, key) => {
          console.log(key + ':', value);
        });
  
        this.projectService.addEditor(this.projectId, formData).subscribe(
          (response) => {
            console.log(`Editor ${i + 1} enviado con éxito:`, response);
          },
          (error) => {
            console.error(`Error al enviar el editor ${i + 1}:`, error);
          }
        );
      }
    }
  } */

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


  addNewImage(index: number): void {
    const field = this.dynamicFields.at(index);

    if (field.get('type')?.value === 'image') {
      const imageFile = field.get('path')?.value;
  
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('f_type_id', '1');
        formData.append('index', index.toString());
  
        this.uploadImage(formData);
      } else {
        console.warn(`Campo de imagen vacío: image_${index}`);
      }
    } else {
      console.error(`El campo en el índice ${index} no es de tipo imagen.`);
    }
  }
  

  addNewText(index: number): void {
  
  }

  addNewTextImage(index: number): void {
    
  }

  updateImageField(index: number): void {
    
  }

  updateTextField(index: number): void {
    const field = (this.form.get('dynamicFields') as FormArray).at(index) as FormGroup;
    const title = field?.get('title')?.value;
    const content = field?.get('content')?.value;
    
    console.log('Título:', title);
    console.log('Contenido:', content);
  }

  updateTextImageField(index: number): void {
    
  }
}
