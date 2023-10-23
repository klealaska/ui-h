import { BuyerPayload } from '../../shared/interfaces';

export class QueryBuyers {
  static readonly type = '[HomeState] QueryBuyers';
}

export class UpdateBuyer {
  static readonly type = '[HomeState] UpdateBuyer';
  constructor(public values: BuyerPayload) {}
}

export class GetBuyersLookahead {
  static readonly type = '[HomeState] GetBuyersLookahead ';
  constructor(public text: string) {}
}

export class SetFilterBuyers {
  static readonly type = '[HomeState] SetFilterBuyers';
  constructor(public buyerName: string) {}
}

export class ClearFilterBuyers {
  static readonly type = '[HomeState] ClearFilterBuyers';
}

export class MassVoid {
  static readonly type = '[HomeState] MassVoid';
  constructor(public values: BuyerPayload) {}
}

export class UpdateFormStatus {
  static readonly type = '[HomeState] UpdateFormStatus';
  constructor(public resetForm: boolean) {}
}
