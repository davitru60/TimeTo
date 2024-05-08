import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button-group',
  standalone: true,
  imports: [],
  templateUrl: './button-group.component.html',
  styleUrl: './button-group.component.scss'
})
export class ButtonGroupComponent {
  @Output() addImageField = new EventEmitter<void>();
  @Output() addTextEditor = new EventEmitter<void>();
  @Output() addTextImageField = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();

  onAddImageField() {
    this.addImageField.emit();
  }

  onAddTextEditor() {
    this.addTextEditor.emit();
  }

  onAddTextImageField() {
    this.addTextImageField.emit();
  }

  onSubmit() {
    this.submitForm.emit();
  }
}
