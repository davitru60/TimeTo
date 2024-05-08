import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { QuillModule } from 'ngx-quill';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { EditorOrderPut, FormFields, ImageOrderPut } from '../interfaces/project.interface';
import { ButtonGroupComponent } from "./button-group/button-group.component";
import { ModalComponent } from "./modal/modal.component";


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
        ButtonGroupComponent,
        ModalComponent
    ]
})
export class ProjectFormComponent implements OnInit {
  form: FormGroup;
  content = new FormControl()
  projectId: number = 0;

  fields: FormFields[] = []

  isEditingText:boolean = false

  imageOrder: ImageOrderPut = {
    proj_img_id: 0,
    previousIndex: 0,
    newIndex: 0,

  }

  editorOrder: EditorOrderPut = {
    proj_text_id: 0,
    previousIndex: 0,
    newIndex: 0,
  }


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

  onChangedEditor(event: any): void {
    if (event.html) {
      this.content.setValue(event.html)
    }
  }

  loadProjectData(projectId: number): void {
    const imagesObservable = this.getImagesObservable(projectId);
    const textsObservable = this.getTextsObservable(projectId);

    combineLatest([imagesObservable, textsObservable]).subscribe(
      ([images, texts]) => {
        this.fields = this.combineAndSortFields(images, texts);
        this.populateForm(this.fields)

      },
      (error) => {
        console.error("Error al combinar datos:", error);
      }
    );
  }

  getImagesObservable(projectId: number) {
    return this.projectService.getProjectImages(projectId).pipe(
      map((response) => {
        if (response.success) {
          return response.data.images;

        } else {
          throw new Error("Error al obtener imágenes");
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
          throw new Error("Error al obtener textos");
        }
      })
    );
  }

  combineAndSortFields(images: any[], texts: any[]) {
    if (!Array.isArray(images) || !Array.isArray(texts)) {
      console.error("Error: Los datos no son arrays.");
      return [];
    }

    const combinedFields = [...images, ...texts].sort((a, b) => a.index - b.index);
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


    this.dynamicFields.push(
      this.fb.group({
        type: 'image',
        path: imagePath,
        proj_img_id: projImgId,
        index: index
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
        index: index
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
        index: index
      })
    );
  }

  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  

  removeField(index: number): void {
    const field = this.dynamicFields.at(index);
    const fieldType = field.get('type')?.value;
    const projTextId = field.get('proj_text_id')?.value;
    const projImgId = field.get('proj_img_id')?.value;
  

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

    console.log('Orden anterior:', previousOrder);

    moveItemInArray(this.dynamicFields.controls, event.previousIndex, event.currentIndex);

    // Actualizar índices
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

    console.log('Nuevo orden:', newOrder);

    // Crear mapeo de índices anteriores a nuevos
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

    console.log('Mapping de índices:', indexMapping);

    indexMapping.forEach((field) => {
      console.log(`Updating ${field.type}:`, field);
      switch (field.type) {
        case 'image':
          this.imageOrder.proj_img_id = field.proj_img_id;
          this.imageOrder.previousIndex = field.previousIndex;
          this.imageOrder.newIndex = field.newIndex;
          console.log('Actualizando orden de imagen:', field);
          this.updateImageOrder(this.imageOrder);
          break;

        case 'editor':
          this.editorOrder.proj_text_id = field.proj_text_id;
          this.editorOrder.previousIndex = field.previousIndex;
          this.editorOrder.newIndex = field.newIndex;
          console.log('Actualizando orden del editor:', field);
          this.updateEditorOrder(this.editorOrder);
          break;

        default:
          console.warn(`Tipo de campo desconocido: ${field.type}`);
          break;
      }
    });
  }

 onFileChange(event: any, index: number): void {
  const file = event.target.files[0]; // Solo usa el primer archivo
  if (file) {
    // Muestra información sobre el archivo y el índice
    console.log(`Archivo cargado en el índice ${index}:`, file.name, file.size, file.type);
  
    // Establece el valor del campo "value" con el archivo cargado
    this.dynamicFields.at(index).get('value')?.setValue(file);
    
    // Muestra el estado actual del FormArray
    console.log('Estado actual del FormArray:', this.dynamicFields.value);
  } else {
    console.warn(`No se cargó ningún archivo en el índice ${index}.`);
  }
}

  submitForm(): void {
    // Verifica si el formulario es válido
    if (!this.form.valid) {
      console.warn('El formulario no es válido. Asegúrate de que todos los campos requeridos estén llenos.');
      return;
    }
  
    const formData = new FormData();
    let validFields = 0;
  
    // Obtén el último elemento del FormArray
    const lastFieldIndex = this.dynamicFields.length - 1; // Índice del último elemento
    const lastField = this.dynamicFields.at(lastFieldIndex);
  
    if (!lastField) {
      console.warn('No se encontró el último campo para procesar.');
      return;
    }
  
    // Procesa el último campo según su tipo
    const fieldType = lastField.get('type')?.value;
  
    if (fieldType === 'image') {
      const file = lastField.get('value')?.value;
  
      if (file) {
        formData.append(`image_${lastFieldIndex}`, file); // Añade el archivo del último campo
        console.log(`Imagen agregada: image_${lastFieldIndex}`, file.name, file.size, file.type);
        validFields++;
      } else {
        console.warn(`Campo de imagen vacío en el índice ${lastFieldIndex}.`);
      }
    } else {
      console.warn(`Tipo de campo desconocido o no soportado: ${fieldType} en el índice ${lastFieldIndex}.`);
    }
  
    // Si hay al menos un campo válido, se procede con el envío
    if (validFields > 0) {
      this.imageServiceHandler(formData); // Maneja el envío del FormData
    } else {
      console.warn('No se encontraron campos válidos para procesar.');
    }
  }

  imageServiceHandler(formData: FormData): void {
    this.projectService.uploadImage(this.projectId, formData).subscribe(
      (response) => {
        console.log('Imagen subida con éxito:', response);
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }

  updateImageOrder(imageOrder: ImageOrderPut) {
    console.log("Image order", this.imageOrder)
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
    console.log("Editor order", this.editorOrder.newIndex)
    this.projectService.updateEditorOrder(this.projectId, editorOrder).subscribe(
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
    )

  }

}
