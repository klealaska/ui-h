import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TableColumnDef } from '../../shared/models/ax-table-column-def';

@Component({
  selector: 'ax-dynamic-table-cell',
  templateUrl: './dynamic-table-cell.component.html',
  styleUrls: ['./dynamic-table-cell.component.scss'],
})
export class DynamicTableCellComponent<T> implements AfterViewInit {
  @Input() columnDef: TableColumnDef;
  @Input() data: T;
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  // We know we will need a reference to this service, and so we inject it
  // in the constructor.
  constructor(
    public componentFactoryResolver: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  // We call the loadDynamicComponent(), because we want to make sure our table is
  // rendered before we try inserting anything into it.
  ngAfterViewInit(): void {
    this.loadDynamicComponent();
  }

  get isRenderingDynamicComponent(): boolean {
    return this.columnDef?.cellDef?.type === 'component';
  }

  loadDynamicComponent(): void {
    // Recall how in our config file, we defined a 'type' for our cellDef. This is where
    // we check for that. If we are just rendering plain text, we don't care to do this.
    // The template will handle this.
    if (!this.isRenderingDynamicComponent) {
      return;
    }

    // Destructure the component type and it's inputs function from the cell value.
    const {
      type: componentType,
      inputs: inputsFn,
      outputs: outputsFn,
    } = this.columnDef.cellDef.value;

    // This creates a reference to the generated component factory, so that we can
    // use its interface later.
    // From our example config file, this would only ever create a
    // DynamicComponent factory.
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    // Clear any previous components/views from the template. Since we are only appending
    // and never replacing, we have to do clear it each time we create/update the dynamic
    // component.
    this.container.clear();
    // Create a component attached to the container we just declared in the template.
    const componentRef = this.container.createComponent<typeof componentType>(componentFactory);

    // Set any @Inputs that the component has. In our example, the Dynamic Component
    // would receive the passed in @Input element: PeriodicElement data field.
    const componentInputs = inputsFn(this.data);
    Object.keys(componentInputs).forEach(key => {
      componentRef.instance[key] = componentInputs[key];
    });

    // Set any callback outputs that the component has. In our example, the Dynamic Component
    // would receive the function passed in output as callback functions.
    const componentOutputs = outputsFn ? outputsFn(this.data) : {};
    Object.keys(componentOutputs).forEach(key => {
      componentRef.instance[key] = componentOutputs[key];
    });

    this.changeDetectorRef.detectChanges();
  }
}
