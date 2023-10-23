import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avc-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit {
  @Input() date: string;
  localDate: string;

  ngOnInit(): void {
    this.setDateInLocalTime();
  }

  private setDateInLocalTime(): void {
    this.localDate = new Date(this.date + 'Z').toString();
  }
}
