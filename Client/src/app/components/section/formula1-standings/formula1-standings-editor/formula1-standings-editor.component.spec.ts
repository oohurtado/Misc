import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formula1StandingsEditorComponent } from './formula1-standings-editor.component';

describe('Formula1StandingsEditorComponent', () => {
  let component: Formula1StandingsEditorComponent;
  let fixture: ComponentFixture<Formula1StandingsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formula1StandingsEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Formula1StandingsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
