import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.scss',
})
export class ImageSelectorComponent {
  @Input() isImageModalOpen: boolean = false;
  @Input() index!: number;

  @Output() toggleModal = new EventEmitter<number>();
  @Output() imageSelected = new EventEmitter<any>();

  imageOption: string | null = null;
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openImageModal() {
    this.toggleModal.emit(this.index);
    this.imageOption = '';
    this.isDropdownOpen = false;
  }

  onFileChange(event: any) {
    const file = event
    console.log("File",file)
  
    if (file) {
      this.imageSelected.emit(file);
    }
  }

  selectImageOption(option: string) {
    this.imageOption = option;
    this.isDropdownOpen = false;
  }
}
