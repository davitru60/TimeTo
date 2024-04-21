import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-field',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './image-field.component.html',
  styleUrl: './image-field.component.scss'
})
export class ImageFieldComponent {
  @Input() formGroup!: FormGroup;
  
  @Output() fileChange = new EventEmitter<File | null>();

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.[0]) {
      const file = fileInput.files[0];
      this.formGroup.get('fileName')?.setValue(file.name);
      this.fileChange.emit(file);
    }
  }
}
