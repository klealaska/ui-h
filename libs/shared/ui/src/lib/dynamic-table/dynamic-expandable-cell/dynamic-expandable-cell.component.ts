import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TableDataDef } from '../../shared/models';

@Component({
  selector: 'ax-dynamic-expandable-cell',
  templateUrl: './dynamic-expandable-cell.component.html',
  styleUrls: ['./dynamic-expandable-cell.component.scss'],
})
export class DynamicExpandableCellComponent implements AfterViewInit {
  @Input() data: TableDataDef;
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  constructor(public componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit(): void {
    this.loadDynamicComponent();
  }

  get isRenderingDynamicComponent(): boolean {
    return this.data?.component?.type === 'component';
  }

  loadDynamicComponent(): void {
    if (!this.isRenderingDynamicComponent) {
      return;
    }
    const {
      type: componentType,
      inputs: inputsFn,
      outputs: outputsFn,
    } = this.data?.component?.value ? this.data.component.value : undefined;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    this.container.clear();

    const componentRef = this.container.createComponent<typeof componentType>(componentFactory);
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
  }
}
