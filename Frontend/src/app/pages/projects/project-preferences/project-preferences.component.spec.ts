import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPreferencesComponent } from './project-preferences.component';

describe('ProjectPreferencesComponent', () => {
  let component: ProjectPreferencesComponent;
  let fixture: ComponentFixture<ProjectPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPreferencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
