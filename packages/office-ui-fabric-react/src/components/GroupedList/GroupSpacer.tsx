import * as React from 'react';
import { css } from '../../Utilities';
import * as stylesImport from './GroupSpacer.scss';
const styles: any = stylesImport;

export interface IGroupSpacerProps {
  count: number;
  indentWidth?: number;
}

const SPACER_WIDTH = 36;

export const GroupSpacer = (props: IGroupSpacerProps) => {
  const { count, indentWidth = SPACER_WIDTH } = props;

  return count > 0 ? (
    <span className={css('ms-GroupSpacer', styles.root)} style={{ width: count * indentWidth }} />
  ) : null;
};
