import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScoreComponent } from './list-score.component';

describe('ListScoreComponent', () => {
  let component: ListScoreComponent;
  let fixture: ComponentFixture<ListScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
