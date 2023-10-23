import { Selector } from '@ngxs/store';
import { ClaimsQueries } from '@ui-coe/avidcapture/core/data-access';
import {
  Activity,
  ActivityTypes,
  AssociatedErrorMessage,
  CompositeDocument,
  DocumentLabelKeys,
  EscalationCategoryTypes,
  FieldAssociated,
  IndexedLabel,
  IngestionTypes,
  PdfJsRequest,
} from '@ui-coe/avidcapture/shared/types';
import { MenuOption } from '@ui-coe/shared/ui';

import { IndexingPageStateModel } from './indexing-page.model';
import { IndexingPageState } from './indexing-page.state';

export class IndexingPageSelectors {
  @Selector([IndexingPageState.data])
  static compositeData(state: IndexingPageStateModel): CompositeDocument {
    return state.compositeData;
  }

  @Selector([IndexingPageState.data])
  static originalCompositeData(state: IndexingPageStateModel): CompositeDocument {
    return state.originalCompositeData;
  }

  @Selector([IndexingPageState.data])
  static pdfFile(state: IndexingPageStateModel): PdfJsRequest {
    return state.pdfFile;
  }

  @Selector([IndexingPageState.data])
  static hasNewEscalations(state: IndexingPageStateModel): boolean {
    return state.hasNewEscalations;
  }

  @Selector([IndexingPageState.data])
  static buyerName(state: IndexingPageStateModel): string {
    const label: IndexedLabel = state.compositeData?.indexed?.labels?.find(
      (lbl: IndexedLabel) => lbl.label === DocumentLabelKeys.nonLookupLabels.BuyerName
    );
    return label?.value?.text ?? '';
  }

  @Selector([IndexingPageState.data])
  static latestFieldAssociation(state: IndexingPageStateModel): FieldAssociated {
    return state.latestFieldAssociation;
  }

  @Selector([IndexingPageState.data])
  static activityToDisplay(state: IndexingPageStateModel): Activity {
    const activities: Activity[] = state.compositeData?.indexed?.activities?.filter(
      activity =>
        activity.activity !== ActivityTypes.Save &&
        activity.activity !== ActivityTypes.CreateNewAccount &&
        activity.activity !== ActivityTypes.Swap &&
        activity.activity !== ActivityTypes.Update &&
        activity.escalation
    );
    return activities?.pop() || null;
  }

  @Selector([
    IndexingPageState.data,
    IndexingPageSelectors.activityToDisplay,
    ClaimsQueries.canSeeSaveButton,
  ])
  static saveInvoiceIsActive(
    state: IndexingPageStateModel,
    hasEscalation: Activity,
    canSeeSaveButton: boolean
  ): boolean {
    const ingestionType = state.compositeData?.indexed?.labels?.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.IngestionType
    ).value.text;

    return (
      canSeeSaveButton &&
      (ingestionType === IngestionTypes.Api ||
        (hasEscalation !== null && hasEscalation.activity !== ActivityTypes.CreateNewAccount))
    );
  }

  @Selector([IndexingPageState.data, ClaimsQueries.canSeeMoreActions])
  static moreActionsIsActive(_: IndexingPageStateModel, canSeeMoreActions: boolean): boolean {
    return canSeeMoreActions;
  }

  @Selector([IndexingPageState.data])
  static hasActivities(state: IndexingPageStateModel): boolean {
    return state.compositeData?.indexed?.activities?.length > 0 ? true : false;
  }

  @Selector([IndexingPageState.data])
  static associatedErrorMessage(state: IndexingPageStateModel): AssociatedErrorMessage {
    return state.associatedErrorMessage;
  }

  @Selector([IndexingPageState.data, ClaimsQueries.markAsList])
  static markAsChoices(_: IndexingPageStateModel, markAsList: string[]): MenuOption[] {
    const markAsChoices: MenuOption[] = [];
    markAsList.forEach(value => {
      if (value === EscalationCategoryTypes.RejectToSender) {
        return;
      }

      if (value === EscalationCategoryTypes.RecycleBin) {
        return;
      }

      markAsChoices.push({ text: value });
    });

    return markAsChoices;
  }

  @Selector([IndexingPageState.data])
  static isSwappedDocument(state: IndexingPageStateModel): boolean {
    const isSwappedDocument = state.compositeData?.indexed?.activities.find(
      act => act.activity === ActivityTypes.Swap
    );
    return isSwappedDocument ? true : false;
  }

  @Selector([IndexingPageState.data])
  static isReadOnly(state: IndexingPageStateModel): boolean {
    return state.isReadOnly;
  }

  @Selector([IndexingPageState.data])
  static swappedDocument(state: IndexingPageStateModel): PdfJsRequest {
    return state.swappedDocument;
  }

  @Selector([IndexingPageState.data])
  static updateFontFace(state: IndexingPageStateModel): boolean {
    return state.updateFontFace;
  }

  @Selector([IndexingPageState.data])
  static disableHighlight(state: IndexingPageStateModel): boolean {
    return state.disableHighlight;
  }

  @Selector([IndexingPageState.data])
  static hasChangedLabels(state: IndexingPageStateModel): boolean {
    return state.changedLabels?.length > 0;
  }
}
