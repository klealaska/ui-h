import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { InitApplication } from './core/actions/core.actions';

@Component({
  selector: 'avc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new InitApplication());
  }
}
