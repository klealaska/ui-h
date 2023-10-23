import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellNavigationFeatureContainerComponent } from './shell-navigation-feature-container.component';
import { RouterModule } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthFacade } from '@ui-coe/shell/navigation/data-access';
import { ContentFacade } from '@ui-coe/shared/data-access/content';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShellNavigationFeatureContainerComponent', () => {
  let component: ShellNavigationFeatureContainerComponent;
  let fixture: ComponentFixture<ShellNavigationFeatureContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, HttpClientTestingModule],
      declarations: [ShellNavigationFeatureContainerComponent],
      providers: [provideMockStore(), AuthFacade, ContentFacade],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellNavigationFeatureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
