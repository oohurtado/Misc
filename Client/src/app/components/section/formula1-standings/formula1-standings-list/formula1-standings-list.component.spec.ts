import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formula1StandingsListComponent } from './formula1-standings-list.component';

describe('Formula1StandingsListComponent', () => {
  let component: Formula1StandingsListComponent;
  let fixture: ComponentFixture<Formula1StandingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formula1StandingsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Formula1StandingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
