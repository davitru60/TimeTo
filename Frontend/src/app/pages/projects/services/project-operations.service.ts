import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { FormArray } from '@angular/forms';
import { TextPut } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectOperationsService {

  constructor(private projectService: ProjectService) { }

  addNewImage(projectId: number, index: number, dynamicFields: FormArray): void {
    const field = dynamicFields.at(index);
    if (field.get('type')?.value === 'image') {
      const imageFile = field.get('path')?.value;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('f_type_id', '1');
        formData.append('index', index.toString());

        this.projectService.addImageToProject(projectId, formData).subscribe(
          (response) => {
            console.log('Imagen subida con éxito:', response);

            if (response.success) {
              field.get('proj_img_id')?.setValue(response.data.result[0][0]);
            } else {
              console.warn('La respuesta del servidor indica que hubo un problema al subir la imagen.');
            }
          },
          (error) => {
            console.error('Error al subir la imagen:', error);
          }
        );
      } else {
        console.warn(`Campo de imagen vacío: image_${index}`);
      }
    } else {
      console.error(`El campo en el índice ${index} no es de tipo imagen.`);
    }
  }

  addNewText(projectId: number, index: number, dynamicFields: FormArray): void {
    const field = dynamicFields.at(index);
    if (field.get('type')?.value === 'editor') {
      const title = field?.get('title')?.value;
      const content = field?.get('content')?.value;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      this.projectService.addEditor(projectId, formData).subscribe(
        (response) => {
          console.log(`Editor enviado con éxito:`, response);
        },
        (error) => {
          console.error(`Error al enviar el editor :`, error);
        }
      );
      

    }
  }

  updateTextField(projectId: number, index: number, dynamicFields: FormArray): void {
    const field = dynamicFields.at(index);
    const title = field?.get('title')?.value;
    const text = field?.get('content')?.value;
    const proj_text_id = field?.get('proj_text_id')?.value;

    const textAdd: TextPut = {
      title: title,
      text: text,
      proj_text_id: proj_text_id,
      previousIndex: index
    };

    this.projectService.updateTextField(projectId, textAdd).subscribe(
      (response) => {
        console.log('Campo de texto actualizado con éxito:', response);
      },
      (error) => {
        console.error('Error al actualizar el campo de texto:', error);
      }
    );
  }

  
  
}
