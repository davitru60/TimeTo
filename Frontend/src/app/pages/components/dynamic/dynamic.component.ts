import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldComponent } from "../text-field/text-field.component";
import { ImageFieldComponent } from "../image-field/image-field.component";
import { NavbarComponent } from "../../../shared/navbar/navbar.component";

@Component({
    selector: 'app-dynamic',
    standalone: true,
    templateUrl: './dynamic.component.html',
    styleUrl: './dynamic.component.scss',
    imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, ImageFieldComponent, NavbarComponent]
})
export class DynamicComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      dynamicFields: this.fb.array([]),
    });
  }

  get dynamicFields(): FormArray {
    return this.form.get('dynamicFields') as FormArray;
  }

  addTextField(): void {
    this.dynamicFields.push(
      new FormGroup({
        type: new FormControl('text'),
        value: new FormControl('', [Validators.required]),
      })
    );
  }

  addImageField(): void {
    this.dynamicFields.push(
      new FormGroup({
        type: new FormControl('image'),
        file: new FormControl(null, [Validators.required]),
        fileName: new FormControl(''),
        description: new FormControl(''),
      })
    );
  }

  removeField(index: number): void {
    this.dynamicFields.removeAt(index);
  }

  clearAllFields(): void {
    this.dynamicFields.clear(); 
  }

  submitForm(): void {
    console.log('Formulario enviado:', this.form.value);
  }
}
