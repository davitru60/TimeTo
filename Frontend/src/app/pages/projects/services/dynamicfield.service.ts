import { Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { FormFields } from '../../../core/interfaces/project.interface';
import { ProjectService } from './project.service';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class DynamicFieldService {
  constructor(private fb: FormBuilder,private projectService: ProjectService, private toastService: ToastService) {}


  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  addImageField(dynamicFields: FormArray, field?: FormFields): void {
    const imagePath = field?.path || '';
    const projImgId = field?.proj_img_id || '';
    const index = field?.index || '';
    const fTypeId = field?.f_type_id || '';

    dynamicFields.push(
      this.fb.group({
        type: 'image',
        proj_img_id: projImgId,
        f_type_id: fTypeId,
        path: imagePath,
        index: index,
      })
    );
  }

  addTextEditorField(dynamicFields: FormArray, field?: FormFields): void {
    const text = field?.text || '';
    const title = field?.title || '';
    const projTextId = field?.proj_text_id || '';
    const index = field?.index || '';

    dynamicFields.push(
      this.fb.group({
        type: 'editor',
        title,
        content: text,
        proj_text_id: projTextId,
        index: index,
      })
    );
  }

  addTextImageField(dynamicFields: FormArray, field?: FormFields): void {
    const text = field?.text || '';
    const image = field?.image || null;
    const index = field?.index || '';

    dynamicFields.push(
      this.fb.group({
        type: 'text-image',
        text,
        image,
        index: index,
      })
    );
  }

  removeField(dynamicFields: FormArray, index: number, projectId: number): void {
    const field = dynamicFields.at(index);
    const fieldType = field.get('type')?.value;
    const projImgId = field.get('proj_img_id')?.value;
    const projTextId = field.get('proj_text_id')?.value;
  
    dynamicFields.removeAt(index);
  
    switch (fieldType) {
      case 'image':
        this.projectService.deleteImage(projImgId).subscribe(
          (response) => {
            if (response.success) {
              this.showSuccessToast("Imagen eliminada correctamente");
              this.updateFieldIndices(dynamicFields, projectId);
            } else {
              console.warn('No se pudo eliminar la imagen.');
            }
          },
          (error) => {
            console.error('Error al eliminar la imagen:', error);
          }
        );
        break;
  
      case 'editor':
        this.projectService.deleteProjectTexts(projTextId).subscribe(
          (response) => {
            if (response.success) {
              this.showSuccessToast("Texto eliminado correctamente");
              this.updateFieldIndices(dynamicFields, projectId);
            } else {
              console.warn('No se pudo eliminar el texto.');
            }
          },
          (error) => {
            console.error('Error al eliminar el texto:', error);
          }
        );
        break;
  
      default:
        console.warn(`Tipo de campo desconocido o no soportado: ${fieldType}`);
        break;
    }
  }
  
  updateFieldIndices(dynamicFields: FormArray, projectId: number): void {
    dynamicFields.controls.forEach((control, i) => {
      const fieldType = control.get('type')?.value;
      const projImgId = control.get('proj_img_id')?.value;
      const projTextId = control.get('proj_text_id')?.value;
      const previousIndex = control.get('index')?.value;
  
      const updateObject = {
        previousIndex: previousIndex,
        newIndex: i,
        proj_img_id: projImgId || null,
        proj_text_id: projTextId || null
      };
  
      console.log('Updating index:', updateObject);
  
      control.get('index')?.setValue(i);
  
      switch (fieldType) {
        case 'image':
          this.projectService.updateImageOrder(projectId, updateObject).subscribe(
            (response) => {
              if (response.success) {
                console.log(`Image index updated successfully for proj_img_id: ${projImgId}`);
              } else {
                console.warn(`Failed to update image index for proj_img_id: ${projImgId}`);
              }
            },
            (error) => {
              console.error(`Error updating image index for proj_img_id: ${projImgId}`, error);
            }
          );
          break;
  
        case 'editor':
          this.projectService.updateEditorOrder(projectId, updateObject).subscribe(
            (response) => {
              if (response.success) {
                console.log(`Editor index updated successfully for proj_text_id: ${projTextId}`);
              } else {
                console.warn(`Failed to update editor index for proj_text_id: ${projTextId}`);
              }
            },
            (error) => {
              console.error(`Error updating editor index for proj_text_id: ${projTextId}`, error);
            }
          );
          break;
  
        default:
          console.warn(`Unknown field type: ${fieldType}`);
          break;
      }
    });
  }
  
}