import { Injectable } from '@angular/core';
import { EditorOrderPut, ImageOrderPut } from '../../../core/interfaces/project.interface';
import { ProjectService } from './project.service';
import { FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class OnDropService {

  constructor(private projectService: ProjectService) { }

  onDrop(projectId: number, dynamicFields: FormArray, event: CdkDragDrop<FormArray>): void {
    console.log('onDrop called', { projectId, dynamicFields, event });
  
    const previousOrder = dynamicFields.controls.map((control) => {
      return {
        type: control.get('type')?.value,
        proj_text_id: control.get('proj_text_id')?.value,
        proj_img_id: control.get('proj_img_id')?.value,
      };
    });
  
    console.log('Previous Order:', previousOrder);
  
    moveItemInArray(
      dynamicFields.controls,
      event.previousIndex,
      event.currentIndex
    );
  
    console.log('Controls after move:', dynamicFields.controls);
  
    this.updateFieldIndices(dynamicFields);
  
    console.log('Field indices updated');
  
    const newOrder = dynamicFields.controls.map((control) => {
      return {
        type: control.get('type')?.value,
        proj_text_id: control.get('proj_text_id')?.value,
        proj_img_id: control.get('proj_img_id')?.value,
      };
    });
  
    console.log('New Order:', newOrder);
  
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
  
    console.log('Index Mapping:', indexMapping);
  
    indexMapping.forEach((field) => {
      console.log('Processing field:', field);
      switch (field.type) {
        case 'image':
          this.updateImageOrder(projectId, {
            proj_img_id: field.proj_img_id,
            previousIndex: field.previousIndex,
            newIndex: field.newIndex,
          });
          break;
        case 'editor':
          this.updateEditorOrder(projectId, {
            proj_text_id: field.proj_text_id,
            previousIndex: field.previousIndex,
            newIndex: field.newIndex,
          });
          break;
        default:
          console.warn(`Unknown field type: ${field.type}`);
          break;
      }
    });
  
    console.log('onDrop completed');
  }
  

  updateFieldIndices(dynamicFields: FormArray): void {
    dynamicFields.controls.forEach((control, i) => {
      control.get('index')?.setValue(i);
    });
  }


  updateImageOrder(projectId: number,imageOrder: ImageOrderPut) {
    this.projectService.updateImageOrder(projectId,imageOrder).subscribe(
      (response: any) => {

        if (response.success) {
          console.log('Image order updated successfully');
        } else {
          console.warn('Failed to update order:', response);
        }
      }
    );
  }

  updateEditorOrder(projectId: number,editorOrder: EditorOrderPut) {
    this.projectService.updateEditorOrder(projectId,editorOrder).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Editor updated successfully');
        } else {
          console.warn('Failed to update editor order:', response);
        }
      }
    );
  }
}
