import { Component } from '@angular/core';
import { Project } from '../../../core/interfaces/project.interface';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../../../shared/components/layout/navbar/navbar.component";

@Component({
    selector: 'app-project-preferences',
    standalone: true,
    templateUrl: './project-preferences.component.html',
    styleUrl: './project-preferences.component.scss',
    imports: [CommonModule, RouterLink, NavbarComponent]
})
export class ProjectPreferencesComponent {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {
    this.getRecommendedProjects();
  }

  getRecommendedProjects() {
    this.projectService
      .getRecommendedProjects()
      .subscribe((response: any) => {
        this.projects = response.data.recommendedProjects;
      });
  }
}