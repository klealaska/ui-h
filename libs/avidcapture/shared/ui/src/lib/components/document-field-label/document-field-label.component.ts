import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xdc-document-field-label',
  templateUrl: './document-field-label.component.html',
  styleUrls: ['./document-field-label.component.scss'],
})
export class DocumentFieldLabelComponent implements OnInit {
  @Input() bold = false;
  @Input() size = 'md';
  @Input() text: string;
  @Input() textColor = 'default';
  @Input() uppercase = false;
  @Input() italics = false;
  @Input() hasPointer = false;
  @Input() id: string;

  ngOnInit(): void {
    this.id = this.id ?? `xdc-document-field-label-${new Date().getTime()}`;
  }
}
