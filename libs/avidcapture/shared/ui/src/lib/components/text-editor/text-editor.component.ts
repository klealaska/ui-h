import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'xdc-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit, OnDestroy, OnChanges {
  @Input() htmlTemplate = '';
  @Output() updateHtmlTemplate = new EventEmitter<string>();
  @Output() isValid = new EventEmitter<string>();
  private subscriptions: Subscription[] = [];
  editor: Editor;
  maxLength = 23000;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = new FormGroup({
    htmlTemplate: new FormControl({ value: this.htmlTemplate, disabled: false }, [
      Validators.required(),
      Validators.maxLength(this.maxLength),
    ]),
  });

  ngOnInit(): void {
    this.editor = new Editor();
    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.updateHtmlTemplate.emit(value.htmlTemplate);

        if (this.form.get('htmlTemplate').hasError('maxlength')) {
          this.isValid.emit('Max length exceeded.');
        } else if (this.form.get('htmlTemplate').hasError('required')) {
          this.isValid.emit('Email template cannot be empty.');
        } else {
          this.isValid.emit('');
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.htmlTemplate) {
      this.form.get('htmlTemplate').setValue(this.htmlTemplate);
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
