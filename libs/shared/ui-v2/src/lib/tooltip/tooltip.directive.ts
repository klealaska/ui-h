import {
  Directive,
  ComponentRef,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from './tooltip.component';
import { Position, TooltipStyle, PointerPosition, TooltipPosition } from '@ui-coe/shared/types';

@Directive({
  selector: '[axTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input() axTooltip: string;
  @Input() axTooltipStyle: TooltipStyle;
  @Input() axTooltipImage: string;
  @Input() axTooltipPosition: TooltipPosition;
  @Input() axTooltipPointerPosition: PointerPosition;
  @Input() axDynamicOverflow: boolean;

  private overlayRef: OverlayRef;
  private position: Position;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef
  ) {}

  resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const width = entry?.contentRect?.width;
      let hideTooltip: boolean;

      if (this.axDynamicOverflow) {
        const overflowWidth = this.elementRef.nativeElement.scrollWidth;
        hideTooltip = overflowWidth <= width.toFixed(0);
      }

      if (hideTooltip) {
        if (this.overlayRef) {
          this.overlayRef.dispose();
        }
      } else {
        switch (this.axTooltipPosition) {
          case 'left':
            this.position = {
              originX: 'end',
              originY: 'center',
              overlayX: 'end',
              overlayY: 'center',
              offsetY: 0,
              offsetX: -width + -15,
            };
            break;
          case 'right':
            this.position = {
              originX: 'start',
              originY: 'center',
              overlayX: 'start',
              overlayY: 'center',
              offsetY: 0,
              offsetX: width + 15,
            };
            break;
          default:
            // do nothing
            break;
        }
        if (this.axTooltipPosition === 'above' && this.axTooltipPointerPosition === 'center') {
          this.position = {
            originX: this.axTooltipPointerPosition,
            originY: 'top',
            overlayX: this.axTooltipPointerPosition,
            overlayY: 'bottom',
            offsetY: -10,
            offsetX: 0,
          };
        } else if (
          this.axTooltipPosition === 'above' &&
          this.axTooltipPointerPosition === 'start'
        ) {
          this.position = {
            originX: this.axTooltipPointerPosition,
            originY: 'top',
            overlayX: this.axTooltipPointerPosition,
            overlayY: 'bottom',
            offsetY: -10,
            offsetX: width / 2 - 20,
          };
        } else if (this.axTooltipPosition === 'above' && this.axTooltipPointerPosition === 'end') {
          this.position = {
            originX: this.axTooltipPointerPosition,
            originY: 'top',
            overlayX: this.axTooltipPointerPosition,
            overlayY: 'bottom',
            offsetY: -10,
            offsetX: -width / 2 + 20,
          };
        } else if (
          this.axTooltipPosition === 'below' &&
          this.axTooltipPointerPosition === 'center'
        ) {
          this.position = {
            originX: this.axTooltipPointerPosition,
            originY: 'bottom',
            overlayX: this.axTooltipPointerPosition,
            overlayY: 'top',
            offsetY: 10,
            offsetX: 0,
          };
        } else if (
          this.axTooltipPosition === 'below' &&
          this.axTooltipPointerPosition === 'start'
        ) {
          this.position = {
            originX: this.axTooltipPointerPosition,
            originY: 'bottom',
            overlayX: this.axTooltipPointerPosition,
            overlayY: 'top',
            offsetY: 10,
            offsetX: width / 2 - 20,
          };
        } else if (this.axTooltipPosition === 'below' && this.axTooltipPointerPosition === 'end') {
          this.position = {
            originX: this.axTooltipPointerPosition,
            originY: 'bottom',
            overlayX: this.axTooltipPointerPosition,
            overlayY: 'top',
            offsetY: 10,
            offsetX: -width / 2 + 20,
          };
        }

        const positionStrategy = this.overlayPositionBuilder
          .flexibleConnectedTo(this.elementRef)
          .withPositions([this.position]);

        this.overlayRef = this.overlay.create({ positionStrategy });
      }
    }
  });

  @HostListener('mouseenter')
  show() {
    this.showTooltip();
  }
  @HostListener('focus')
  onFocus() {
    this.showTooltip();
  }
  @HostListener('mouseleave')
  hide() {
    this.hideTooltip();
  }
  @HostListener('click')
  onClick() {
    this.hideTooltip();
  }
  @HostListener('mousedown')
  onMousedown() {
    this.hideTooltip();
  }

  @HostListener('blur')
  onBlur() {
    this.hideTooltip();
  }

  ngOnInit(): void {
    this.resizeObserver.observe(this.elementRef?.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  showTooltip() {
    if (this.overlayRef) {
      if (!this.overlayRef.hasAttached() && (this.axTooltip || this.axTooltipImage)) {
        const tooltipRef: ComponentRef<TooltipComponent> = this.overlayRef.attach(
          new ComponentPortal(TooltipComponent)
        );
        tooltipRef.instance.tooltipText = this.axTooltip;
        tooltipRef.instance.tooltipStyle = this.axTooltipStyle;
        tooltipRef.instance.tooltipImage = this.axTooltipImage;
        tooltipRef.instance.tooltipPosition = this.axTooltipPosition;
        tooltipRef.instance.pointerPosition = this.axTooltipPointerPosition;
      }
    }
  }

  hideTooltip() {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}
