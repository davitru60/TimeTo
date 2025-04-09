import { Component } from '@angular/core';
import { ProjectService } from '../../projects/services/project.service';
import { Project, ProjectGetResponse } from '../../../core/interfaces/project.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-latest-projects',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './latest-projects.component.html',
  styleUrl: './latest-projects.component.scss',
})
export class LatestProjectsComponent {

  projects: Project[] = [];

  constructor(private projectService: ProjectService) {
    this.getLatestProjects();
  }

  getLatestProjects(){
    this.projectService
      .getAllProjects()
      .subscribe((response: ProjectGetResponse) => {
        if(response.success){
          this.projects = response.data.projects;
        }
      });
  }
}
