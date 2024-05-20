import { Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { FormFields } from '../interfaces/project.interface';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class DynamicFieldService {
  constructor(private fb: FormBuilder,private projectService: ProjectService) {}

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

  removeField(dynamicFields: FormArray, index: number): void {
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
              console.log('Imagen eliminada exitosamente.');
              this.updateFieldIndices(dynamicFields);
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
              console.log('Texto eliminado exitosamente.');
              this.updateFieldIndices(dynamicFields);
            } else {
              console.warn('No se pudo eliminar el texto.');
            }
          },
          (error) => {
            console.error('Error al eliminar la imagen:', error);
          }
        );

      break

      default:
        console.warn(`Tipo de campo desconocido o no soportado: ${fieldType}`);
        break;
    }
  }

  updateFieldIndices(dynamicFields: FormArray): void {
    dynamicFields.controls.forEach((control, i) => {
      control.get('index')?.setValue(i);
    });
  }
}