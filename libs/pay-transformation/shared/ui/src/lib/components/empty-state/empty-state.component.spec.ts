import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { EmptyStateComponent } from './empty-state.component';
// import * as CMS from ('apps/pay/pay-spa/src/assets/i18n/en.json');

const mockEmptyStateMessages = {
  messageHeader: 'Sorry, we didnt find a match.',
  messageSub: 'Double-check your entry and try again.',
};

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyStateComponent],
      imports: [MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    component.messageHeader = mockEmptyStateMessages.messageHeader;
    component.messageSub = mockEmptyStateMessages.messageSub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default text if none is passed', () => {
    const mainTitle = fixture.debugElement.query(By.css('.main'));
    const mainTitleText = mainTitle.nativeElement.innerHTML;
    expect(mainTitle).toBeTruthy();
    expect(mainTitleText).toBe(mockEmptyStateMessages.messageHeader);

    const subTitle = fixture.debugElement.query(By.css('.sub'));
    const subTitleText = subTitle.nativeElement.innerHTML;
    expect(subTitle).toBeTruthy();
    expect(subTitleText).toBe(mockEmptyStateMessages.messageSub);
  });

  it('should render with supplied text if it is passed', () => {
    component.messageHeader = 'Message Header 1';
    component.messageSub = 'Message Sub 1';
    fixture.detectChanges();

    const mainTitleText: HTMLElement = fixture.debugElement.query(By.css('.main')).nativeElement
      .innerHTML;
    expect(mainTitleText).toBe(component.messageHeader);

    const subTitleText: HTMLElement = fixture.debugElement.query(By.css('.sub')).nativeElement
      .innerHTML;
    expect(subTitleText).toBe(component.messageSub);
  });
});
