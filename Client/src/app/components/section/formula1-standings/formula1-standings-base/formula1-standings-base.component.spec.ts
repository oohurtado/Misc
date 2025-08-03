import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formula1StandingsBaseComponent } from './formula1-standings-base.component';

describe('Formula1StandingsBaseComponent', () => {
  let component: Formula1StandingsBaseComponent;
  let fixture: ComponentFixture<Formula1StandingsBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formula1StandingsBaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Formula1StandingsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
