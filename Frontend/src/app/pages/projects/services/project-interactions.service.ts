import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { FormArray } from '@angular/forms';
import {
  TextPutData,
  TextPostData,
} from '../../../core/interfaces/project-text.interface';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectInteractionsService {
  constructor(
    private projectService: ProjectService,
    private toastService: ToastService
  ) {}

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  showErrorToast(message: string) {
    this.toastService.showToast({ text: message, type: 'error' });
  }

  addImageToProject(projectId: number,index: number,dynamicFields: FormArray): void {
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
            if (response.success) {
              field.get('proj_img_id')?.setValue(response.data.result[0][0]);
              this.showSuccessToast('Imagen subida correctamente');
            } else {
              this.showErrorToast('Error al subir la imagen');
              console.warn(
                'La respuesta del servidor indica que hubo un problema al subir la imagen.'
              );
            }
          },
          (error) => {
            console.error('Error al subir la imagen:', error);
          }
        );
      } else {
        this.showErrorToast('Campo de imagen vacío');
      }
    } else {
      this.showErrorToast('El elemento subido no es una imagen');
    }
  }

  addProjectTexts(projectId: number,index: number,dynamicFields: FormArray): void {
    const field = dynamicFields.at(index);
    if (field.get('type')?.value === 'editor') {
      const title = field?.get('title')?.value;
      const text = field?.get('content')?.value;
      const proj_text_id = field?.get('proj_text_id')?.value;

      const textAdd: TextPostData = {
        project_id: proj_text_id,
        f_type_id: 2,
        title: title,
        text: text,
        index: index,
      };

      this.projectService.addProjectTexts(projectId, textAdd).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccessToast('Texto creado con éxito');
          } else {
           
          }
          console.log(`Editor enviado con éxito:`, response);
        },

        error: (response:HttpErrorResponse) => {
          if(!response.ok){
            this.showErrorToast('Error al crear el texto');
          }
         
        },
      });
    }
  }

  updateImageField(projectId:number,index: number,dynamicFields: FormArray){
    const field = dynamicFields.at(index);
    if (field.get('type')?.value === 'image') {
      const imageFile = field.get('path')?.value;
  
      if(imageFile){
        const formData = new FormData();
        formData.append('image', imageFile);
        this.projectService.updateImageFromProject(projectId,formData).subscribe(
          (response) => {
            if (response.success) {
              this.showSuccessToast('Imagen actualizada con éxito');
            }else{
              this.showErrorToast('Error al actualizar la imagen');
            }
        })

      }
    }
  }

  updateProjectTexts(projectId: number,index: number,dynamicFields: FormArray): void {
    const field = dynamicFields.at(index);
    const title = field?.get('title')?.value;
    const text = field?.get('content')?.value;
    const proj_text_id = field?.get('proj_text_id')?.value;

    const textAdd: TextPutData = {
      title: title,
      text: text,
      proj_text_id: proj_text_id,
      previousIndex: index,
    };

    this.projectService.updateProjectTexts(projectId, textAdd).subscribe(
      (response) => {
        if (response.success) {
          this.showSuccessToast('Texto actualizado exitosamente');
        } else {
          this.showErrorToast('Error al actualizar el texto');
        }
      },
      (error) => {
        console.error('Error al actualizar el campo de texto:', error);
      }
    );
  }
}
