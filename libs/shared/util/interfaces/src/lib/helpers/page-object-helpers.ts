import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Dictionary } from '@ngrx/entity';

export function getSelector(selectorId: string): string {
  return `[data-test-selector='${selectorId}']`;
}

// DOM Helpers
export function getElementBySelector<T>(
  fixture: ComponentFixture<T>,
  selectorValue: string
): DebugElement {
  const selector = getSelector(selectorValue);
  return fixture.debugElement.query(By.css(selector));
}

export function getAllBySelector<T>(
  fixture: ComponentFixture<T>,
  selectorValue: string
): DebugElement[] {
  const selector = getSelector(selectorValue);
  return fixture.debugElement.queryAll(By.css(selector));
}

export function getElementTextContent(debugElement: DebugElement): string {
  return debugElement.nativeElement.textContent;
}

export function getAppliedStyles(debugElement: DebugElement): string {
  return debugElement.nativeElement.classList.value;
}

// Form Helpers
export function setFormFieldValue(form: UntypedFormGroup, fieldName: string, value: unknown) {
  form.get(fieldName)?.setValue(value);
}

export function getFormField(form: UntypedFormGroup, fieldName: string) {
  return form.get(fieldName);
}

/**
 * Changes in components using OnPush strategy are only applied once when calling .detectChanges(),
 * This function solves this issue.
 */
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export async function runOnPushChangeDetection(fixture: ComponentFixture<any>): Promise<void> {
  const changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
  changeDetectorRef.detectChanges();
  return fixture.whenStable();
}

export function createDictionaryFromObjectArray<T>(
  objArray: T[],
  key: string | number
): Dictionary<T> {
  return objArray.reduce((accum, iter) => {
    accum[iter[key]] = iter;
    return accum;
  }, {} as { [key: string]: T });
}
