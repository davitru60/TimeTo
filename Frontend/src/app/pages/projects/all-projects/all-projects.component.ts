import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ProjectService } from '../services/project.service';
import { Project, ProjectResponse } from '../interfaces/project.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from "../../../shared/pagination/pagination.component";



@Component({
    selector: 'app-all-projects',
    standalone: true,
    templateUrl: './all-projects.component.html',
    styleUrl: './all-projects.component.scss',
    imports: [CommonModule, NavbarComponent, RouterLink, NgxPaginationModule, PaginationComponent]
})
export class AllProjectsComponent {
  projects: Project[] = [];
  currentPage = 1;
  itemsPerPage = 4;

  constructor(private projectService: ProjectService) {
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService
      .getAllProjects()
      .subscribe((response: ProjectResponse) => {
        this.projects = response.data.projects;
      });
  }

  get totalPages(): number {
    return Math.ceil(this.projects.length / this.itemsPerPage);
  }

  get paginatedProjects(): Project[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    return this.projects.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

  onItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1;
  }
}
