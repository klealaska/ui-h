import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextEditorComponent } from './text-editor.component';
import { NgxEditorModule } from 'ngx-editor';
import { ReactiveFormsModule } from '@angular/forms';
describe('TextEditorComponent', () => {
  let component: TextEditorComponent;
  let fixture: ComponentFixture<TextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextEditorComponent],
      imports: [NgxEditorModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('When does not exceeds maxLength and has a valid template ', () => {
      beforeEach(() => {
        jest.spyOn(component.updateHtmlTemplate, 'emit');
        jest.spyOn(component.isValid, 'emit');
        component.form.valueChanges.subscribe();
        component.ngOnInit();
        component.form.get('htmlTemplate').setValue('mockTemplate');
        fixture.detectChanges();
      });

      it('should emit updateHtmlTemplate', () => {
        expect(component.updateHtmlTemplate.emit).toHaveBeenNthCalledWith(1, '<p>mockTemplate</p>');
      });

      it('should emit isValid', () => {
        expect(component.isValid.emit).toHaveBeenNthCalledWith(1, '');
      });
    });

    describe('When has an empty template', () => {
      beforeEach(() => {
        jest.spyOn(component.updateHtmlTemplate, 'emit');
        jest.spyOn(component.isValid, 'emit');
        component.form.valueChanges.subscribe();
        component.ngOnInit();
        component.form.get('htmlTemplate').setValue('');
        fixture.detectChanges();
      });

      it('should emit updateHtmlTemplate', () => {
        expect(component.updateHtmlTemplate.emit).toHaveBeenNthCalledWith(1, '');
      });

      it('should emit Email template cannot be empty', () => {
        expect(component.isValid.emit).toHaveBeenNthCalledWith(
          1,
          'Email template cannot be empty.'
        );
      });
    });

    describe('When template exceeds max length', () => {
      beforeEach(() => {
        jest.spyOn(component.updateHtmlTemplate, 'emit');
        jest.spyOn(component.isValid, 'emit');

        component.form.get('htmlTemplate').setValue('mockTemplate');
        component.form.valueChanges.subscribe();

        component.ngOnInit();
      });

      it('should emit updateHtmlTemplate', () => {
        expect(component.updateHtmlTemplate.emit).toHaveBeenNthCalledWith(1, '<p>mockTemplate</p>');
      });
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.htmlTemplate = 'mockTemplate';
      component.ngOnChanges({
        htmlTemplate: new SimpleChange('mockTemplate', 'mockTemplate', true),
      });
    });

    it('should assing to form new htmlTemplateValue', () => {
      expect(component.form.get('htmlTemplate').value).toBe('<p>mockTemplate</p>');
    });
  });
});
