import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Buscar...';
  @Output() search = new EventEmitter<string>();

  
  value: string = '';

  onInputChange(event: Event) {
    this.search.emit(this.value);
  }
}
