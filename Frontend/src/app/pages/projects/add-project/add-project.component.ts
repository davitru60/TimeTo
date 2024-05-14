import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectPut } from '../interfaces/project.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm} from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { LoaderComponent } from "../../../shared/loader/loader.component";

@Component({
    selector: 'app-add-project',
    standalone: true,
    templateUrl: './add-project.component.html',
    styleUrl: './add-project.component.scss',
    imports: [CommonModule, FormsModule, ModalComponent, LoaderComponent]
})
export class AddProjectComponent {
  @Input() isModalOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() enviarProyectoEvent = new EventEmitter<void>();

  project: ProjectPut = {
    name: '',
    description: '',
    path: '',
  };

  touch: boolean = false;
  isLoading = false;

  @ViewChild('f', { static: false }) projectForm!: NgForm;

  constructor(private projectService: ProjectService) {}

  closeModal() {
    this.closeEvent.emit();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.project.path = file;
    }
  }

  createProject() {
    this.isLoading = true; // Activar pantalla de carga
    
    const formData = new FormData();
  
    formData.append('name', this.project.name);
    formData.append('description', this.project.description);
    formData.append('path', this.project.path);
  
    this.projectService.createProject(formData).subscribe(
      (response) => {
        this.isLoading = false; // Desactivar pantalla de carga
        this.closeModal();
      },
      (error) => {
       
      }
    );
  }

  onReset(form: NgForm) {
    form.reset();
  }
}
