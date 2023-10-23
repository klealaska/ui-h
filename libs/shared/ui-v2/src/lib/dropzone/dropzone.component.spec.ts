import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DropzoneComponent } from './dropzone.component';

describe('DropzoneComponent', () => {
  let component: DropzoneComponent;
  let fixture: ComponentFixture<DropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(DropzoneComponent);
    component = fixture.componentInstance;
    component.content = {
      linkText: 'Select',
      icon: 'description',
      message: 'files or drop here to upload.',
    };
    component.supportedFileTypes = '.png, .jpeg, .pdf';
    component.maxFileSize = 5;
    component.error = false;
    component.disabled = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct content', () => {
    expect(component).toBeTruthy();
    expect(component.content).toBeDefined();

    const linkText = fixture.debugElement.query(By.css('.container__link')).nativeElement;
    const icon = fixture.debugElement.query(By.css('.container__icon')).nativeElement;
    const message = fixture.debugElement.query(By.css('.container__message')).nativeElement;

    expect(linkText.textContent).toEqual('Select ');
    expect(icon.textContent).toEqual('description');
    expect(message.textContent).toEqual('files or drop here to upload.');
  });

  it('should display the correct configs', () => {
    expect(component).toBeTruthy();
    expect(component.supportedFileTypes).toBeDefined();
    expect(component.maxFileSize).toBeDefined();

    const supportedFileTypes = fixture.debugElement.query(
      By.css('#supportedFileTypes')
    ).nativeElement;
    const maxFileSize = fixture.debugElement.query(By.css('#maxFileSize')).nativeElement;

    expect(supportedFileTypes.textContent).toEqual(' .png, .jpeg, .pdf ');
    expect(maxFileSize.textContent).toEqual('5');
  });

  it('should have the disabled class when set to true', () => {
    expect(component).toBeTruthy();
    component.disabled = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.container--disabled')).toBeTruthy();
  });

  it('should not have the disabled class when set to false', () => {
    expect(component).toBeTruthy();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.container--disabled')).toBeFalsy();
  });

  it('should have the error class when set to true', () => {
    expect(component).toBeTruthy();
    component.error = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.container--error')).toBeTruthy();
  });

  it('should not have the error class when set to false', () => {
    expect(component).toBeTruthy();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.container--error')).toBeFalsy();
  });

  it('should call onFileDropped and emit data with FileList', async () => {
    const event = {
      FileList: {
        lastModified: 1672853020000,
        name: 'test-file.png',
        size: 48983,
        type: 'image/png',
      },
      length: 1,
      item: function () {
        return null;
      },
    };
    const spy = jest.spyOn(component.fileEvent, 'emit');

    component.onFileDropped(event);
    fixture.detectChanges();

    expect(spy).toBeCalledWith(event);
  });

  it('should call onFileUpload on change', async () => {
    const element = fixture.nativeElement;
    const input = element.querySelector('#fileUpload');

    jest.spyOn(component, 'onFileUpload');
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.onFileUpload).toHaveBeenCalled();
  });
});
