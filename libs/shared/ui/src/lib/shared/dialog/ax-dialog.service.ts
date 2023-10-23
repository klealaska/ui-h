import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
  Type,
} from '@angular/core';

import { AxDialogComponent } from './ax-dialog.component';
import { AxDialogConfig } from './ax-dialog-config';
import { AxDialogInjector } from './ax-dialog-injector';
import { AxDialogRef } from './ax-dialog-ref';

@Injectable()
export class AxDialogService {
  dialogComponentRef: ComponentRef<AxDialogComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  public open(componentType: Type<any>, config: AxDialogConfig, inputs: any): AxDialogRef {
    const dialogRef = this.appendDialogComponentToBody(config);

    this.dialogComponentRef.instance.childComponentType = componentType;
    this.dialogComponentRef.instance.childInputs = inputs;

    return dialogRef;
  }

  private appendDialogComponentToBody(config: AxDialogConfig): AxDialogRef {
    const map = new WeakMap();
    map.set(AxDialogConfig, config);

    const dialogRef = new AxDialogRef();
    map.set(AxDialogRef, dialogRef);

    const sub = dialogRef.afterClosed.subscribe(() => {
      // Close the dialog
      this.removeDialogComponentFromBody();
      sub.unsubscribe();
    });

    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AxDialogComponent);
    const componentRef = componentFactory.create(new AxDialogInjector(this.injector, map));
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.dialogComponentRef = componentRef;

    this.dialogComponentRef.instance.onClose.subscribe(() => {
      this.removeDialogComponentFromBody();
    });

    return dialogRef;
  }

  private removeDialogComponentFromBody(): void {
    this.appRef.detachView(this.dialogComponentRef.hostView);
    this.dialogComponentRef.destroy();
  }
}
