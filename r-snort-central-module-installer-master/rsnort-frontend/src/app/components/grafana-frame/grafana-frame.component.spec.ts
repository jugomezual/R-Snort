import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaFrameComponent } from './grafana-frame.component';

describe('GrafanaFrameComponent', () => {
  let component: GrafanaFrameComponent;
  let fixture: ComponentFixture<GrafanaFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafanaFrameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafanaFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
