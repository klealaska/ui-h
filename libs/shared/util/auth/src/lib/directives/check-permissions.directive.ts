import { AfterViewInit, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[axCheckPermissions]',
})
export class CheckPermissionsDirective implements AfterViewInit {
  @Input() axCheckPermissions: string[] = [];
  @Input() axCheckPermissionsUser: string[] = [];

  constructor(private templateRef: TemplateRef<Element>, private viewContainer: ViewContainerRef) {}

  ngAfterViewInit(): void {
    const hasPermission: string[] = this.axCheckPermissions.filter(permission =>
      this.axCheckPermissionsUser.includes(permission)
    );

    if (hasPermission.length > 0) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
