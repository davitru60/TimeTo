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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, filter, map } from 'rxjs';
import { EditorOrderPut, FormFields, ImageOrderPut } from '../interfaces/project.interface';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    QuillModule,
    DragDropModule,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit {
  form: FormGroup;
  content: any = '';
  projectId: number = 0;

  fields: FormFields[] = []

  imageOrder:ImageOrderPut = {
    proj_img_id: 0,
    previousIndex: 0,
    newIndex: 0,
    
  }
  
  editorOrder:EditorOrderPut = {
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
      this.content = event.html;
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

  populateForm(fields: FormFields []): void {
  
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

  removeField(index: number): void {
    this.dynamicFields.removeAt(index);

    this.dynamicFields.controls.forEach((control, i) => {
      control.get('index')?.setValue(i);
    });
  }

  onDrop(event: CdkDragDrop<FormArray>): void {
    const prevIndex = event.previousIndex;
    const newIndex = event.currentIndex;
    console.log("New index",newIndex)

    moveItemInArray(this.dynamicFields.controls, prevIndex, newIndex);

    this.dynamicFields.controls.forEach((control, i) => {
      control.get('index')?.setValue(i);
    });



    const reorderedFields = this.dynamicFields.controls.map((control) => {
      const type = control.get('type')?.value ?? 'unknown';
      const index = control.get('index')?.value;
      const proj_text_id = control.get('proj_text_id')?.value ?? null;
      const proj_img_id = control.get('proj_img_id')?.value ?? null;  
    
  
      if (type === 'image') {
        return { 
          type, 
          previousIndex: prevIndex, 
          newIndex: index, 
          proj_img_id,
          proj_text_id: null,
        };
      }
    

      if (type === 'editor') {
        return { 
          type, 
          previousIndex: prevIndex, 
          newIndex: index, 
          proj_text_id, 
          proj_img_id: null,
        };
      }
    
      return { 
        type, 
        previousIndex: prevIndex, 
        newIndex: index, 
        proj_text_id, 
        proj_img_id,
      };
    });


    reorderedFields.forEach((field) => {
      switch (field.type) {
        case 'image':
            this.imageOrder.proj_img_id= field.proj_img_id
            this.imageOrder.previousIndex=field.previousIndex
            this.imageOrder.newIndex=field.newIndex
            this.updateImageOrder(this.imageOrder)
          break;
  
        case 'editor':
          this.editorOrder.proj_text_id= field.proj_text_id
          this.editorOrder.previousIndex=field.previousIndex
          this.editorOrder.newIndex=field.newIndex
          this.updateEditorOrder(this.editorOrder)
          break;
  
        case 'text-image':
         
          break;
  
        default:
          console.warn(`Tipo de campo desconocido: ${field.type}`);
          break;
      }
    });


  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.dynamicFields.at(index).get('value')?.setValue(file);
    }
  }

  submitForm(): void {
    if (!this.form.valid) {
      console.warn(
        'El formulario no es válido. Asegúrate de que todos los campos requeridos estén llenos.'
      );
      return;
    }

    const formData = new FormData();
    let validFields = 0;

    this.dynamicFields.controls.forEach((field, index) => {
      const fieldType = field.get('type')?.value;

      switch (fieldType) {
        case 'image': {
          const file = field.get('value')?.value;
          if (file) {
            formData.append(`image_${index}`, file);
            console.log(`Imagen agregada: image_${index}`);
            validFields++;
          } else {
            console.warn(`Campo de imagen vacío: image_${index}`);
          }
          break;
        }

        default: {
          console.warn(
            `Tipo de campo desconocido o no soportado: ${fieldType}`
          );
          break;
        }
      }
    });

    if (validFields > 0) {
      this.imageServiceHandler(formData);
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

  updateImageOrder(imageOrder:ImageOrderPut) {
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
    this.projectService.updateEditorOrder(this.projectId,editorOrder).subscribe(
      (response:any)=>{
        if(response.success){
          console.log('Editor updated successfully');
        }else{
          console.warn('Failed to update editor order:', response);
        }
      },
      (error:any) =>{
        console.error('Error while updating editor order:', error);
      }
    )
    
  }
  
}
