import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import { QuillModule } from 'ngx-quill';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { EditorOrderPut, FormFields, ImageOrderPut} from '../../../core/interfaces/project.interface';
import { TextPutData } from '../../../core/interfaces/project-text.interface';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { combineLatest, map } from 'rxjs';
import { ProjectLoaderService } from '../services/project-loader.service';
import { DynamicFieldService } from '../services/dynamicfield.service';
import { ProjectInteractionsService } from '../services/project-interactions.service';
import { OnDropService } from '../services/on-drop.service';
import { editorModules } from '../../../core/conf/editor-config';
import { ToastComponent } from "../../../shared/components/ui/toast/toast.component";

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
        ToastComponent
    ]
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

  textAdd: TextPutData = {
    title: '',
    text: '',
    proj_text_id: '',
    previousIndex: 0
  }
  

  editorModules = editorModules

  constructor(
    private fb: FormBuilder,
    private onDropService : OnDropService,
    private projectLoaderService : ProjectLoaderService,
    private dynamicFieldService : DynamicFieldService,
    private projectInteractionsService: ProjectInteractionsService, 
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

  disableDrag() {
    this.isEditingText = true;
  
  }

  enableDrag() {
    this.isEditingText = false;
  }
  

  loadProjectData(projectId: number): void {
    const imagesObservable = this.projectLoaderService.getImagesObservable(projectId)
    const textsObservable = this.projectLoaderService.getTextsObservable(projectId)

    combineLatest([imagesObservable, textsObservable]).subscribe(
      ([images, texts]) => {
        const fields = this.projectLoaderService.combineAndSortFields(images,texts)
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
          this.dynamicFieldService.addTextEditorField(this.dynamicFields, field);
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
    this.dynamicFieldService.removeField(this.dynamicFields,index, this.projectId);
  }


  onDrop(event: CdkDragDrop<FormArray>): void {
    this.onDropService.onDrop(this.projectId,this.dynamicFields, event);
  }

  //Project operations
  addImageToProject(index: number): void {
    this.projectInteractionsService.addImageToProject(this.projectId, index, this.dynamicFields);
    this.closeAddModal(index)
  }

  addProjectTexts(index:number):void{
    this.projectInteractionsService.addProjectTexts(this.projectId,index,this.dynamicFields)
  
  }

  addNewTextImage(index: number): void {
    
  }

  updateImageField(index: number): void {
    this.projectInteractionsService.updateImageField(this.projectId, index, this.dynamicFields)
  }

  updateProjectTexts(index: number): void {
    this.projectInteractionsService.updateProjectTexts(this.projectId, index, this.dynamicFields);
    this.closeEditModal(index)
  }

  updateTextImageField(index: number): void {
    
  }
}
