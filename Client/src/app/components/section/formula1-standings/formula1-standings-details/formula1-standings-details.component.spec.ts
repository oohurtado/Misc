import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formula1StandingsDetailsComponent } from './formula1-standings-details.component';

describe('Formula1StandingsDetailsComponent', () => {
  let component: Formula1StandingsDetailsComponent;
  let fixture: ComponentFixture<Formula1StandingsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formula1StandingsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Formula1StandingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
