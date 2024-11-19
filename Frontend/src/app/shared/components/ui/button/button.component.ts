import { CommonModule} from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() classes: string = '';
  @Input() param?: any;
  @Output() action?: any = new EventEmitter<any>();

  onClick() {
    this.action.emit(this.param);
  }
}
