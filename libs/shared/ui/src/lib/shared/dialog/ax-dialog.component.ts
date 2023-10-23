import {
  Component,
  Type,
  OnDestroy,
  AfterViewInit,
  ComponentRef,
  ViewChild,
  ComponentFactoryResolver,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { AxInsertionDirective } from './ax-insertion.directive';
import { AxDialogRef } from './ax-dialog-ref';

@Component({
  templateUrl: './ax-dialog.component.html',
  styleUrls: ['./ax-dialog.component.scss'],
})
export class AxDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild(AxInsertionDirective) insertionPoint: AxInsertionDirective;

  componentRef: ComponentRef<any>;
  childComponentType: Type<any>;
  childInputs: any;

  private readonly onCloseSubject = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  onClose = this.onCloseSubject.asObservable();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cd: ChangeDetectorRef,
    private dialogRef: AxDialogRef
  ) {}

  ngAfterViewInit(): void {
    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  onOverlayClicked(): void {
    if (this.componentRef.instance.config?.disableClose) {
      return;
    }
    this.dialogRef.close();
  }

  onDialogClicked(evt: MouseEvent): void {
    evt.stopPropagation();
  }

  loadChildComponent(componentType: Type<any>): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    const viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    Object.assign(this.componentRef.instance, this.childInputs);
  }

  close(): void {
    this.onCloseSubject.next();
  }
}
