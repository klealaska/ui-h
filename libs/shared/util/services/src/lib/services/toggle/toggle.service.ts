import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToggleService {
  private state = false;

  setState(data: boolean): void {
    this.state = data;
  }

  toggleState(): void {
    this.state = !this.state;
  }

  getToggledState(): boolean {
    return this.state;
  }
}
