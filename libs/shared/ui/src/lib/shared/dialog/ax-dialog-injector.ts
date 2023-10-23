import { Injector, Type, InjectionToken, InjectFlags } from '@angular/core';

export class AxDialogInjector implements Injector {
  constructor(private parentInjector: Injector, private additionalTokens: WeakMap<any, any>) {}

  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
  get(token: any, notFoundValue?: any): any;
  get(token: any, notFoundValue?: any): any {
    const value = this.additionalTokens.get(token);

    if (value) {
      return value;
    }

    return this.parentInjector.get<any>(token, notFoundValue);
  }
}
