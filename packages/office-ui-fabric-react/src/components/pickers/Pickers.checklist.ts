import { ChecklistStatus } from '../../common/DocPage.types';

export const PickersStatus = {
  keyboardAccessibilitySupport: ChecklistStatus.unknown,
  markupSupport: ChecklistStatus.unknown,
  highContrastSupport: ChecklistStatus.fail,
  rtlSupport: ChecklistStatus.fail,
  testCoverage: ChecklistStatus.good
};
