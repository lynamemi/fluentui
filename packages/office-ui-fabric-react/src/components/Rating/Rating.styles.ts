import {
  getFocusStyle,
  hiddenContentStyle,
  HighContrastSelector,
} from '../../Styling';
import { IRatingStyleProps, IRatingStyles } from './Rating.types';

function _getColorWithHighContrast(color: string, highContrastColor: string) {
  return {
    color: color,
    selectors: {
      [HighContrastSelector]: {
        color: highContrastColor
      }
    }
  }
}

export function getStyles(props: IRatingStyleProps): IRatingStyles {
  const {
    disabled,
    readOnly,
    theme
  } = props;

  const {
    semanticColors,
    palette
  } = theme;

  const ratingSmallIconSize = '16px';
  const ratingLargeIconSize = '20px';

  const ratingStarUncheckedColor = palette.neutralTertiary;
  const ratingStarCheckedColor = semanticColors.bodyTextChecked;
  const ratingStarDisabledColor = semanticColors.disabledBodyText;

  return {
    root: [
      !disabled && !readOnly && {
        selectors: {
          // This is part 1 of highlighting all stars up to the one the user is hovering over
          '&:hover': {
            selectors: {
              '.ms-RatingStar-back': _getColorWithHighContrast(ratingStarCheckedColor, 'Highlight'),
            }
          }
        }
      }
    ],
    ratingStar: [
      'ms-RatingStar-container',
      {
        display: 'inline-block',
        position: 'relative'
      }
    ],
    ratingStarBack: [
      'ms-RatingStar-back',
      {
        // TODO: Use a proper semantic color for this
        color: ratingStarUncheckedColor,
        width: '100%'
      },
      disabled && _getColorWithHighContrast(ratingStarDisabledColor, 'GrayText')
    ],
    ratingStarFront: [
      'ms-RatingStar-front',
      {
        position: 'absolute',
        height: '100 %',
        left: '0',
        top: '0',
        textAlign: 'center',
        verticalAlign: 'middle',
        overflow: 'hidden',
      },
      _getColorWithHighContrast(ratingStarCheckedColor, 'Highlight')
    ],
    ratingButton: [
      getFocusStyle(theme, 0),
      'ms-Rating-button',
      {
        background: 'none',
        padding: '3px 3px 0px 0px',
        margin: '0px',
        border: 'none',
        cursor: 'pointer',
        selectors: {
          '&:disabled': {
            cursor: 'default'
          },
          '&[disabled]': {
            cursor: 'default'
          }
        }
      },
      !disabled && !readOnly && {
        selectors: {
          // This is part 2 of highlighting all stars up to the one the user is hovering over
          '&:hover ~ .ms-Rating-button': {
            selectors: {
              '.ms-RatingStar-back': _getColorWithHighContrast(ratingStarUncheckedColor, 'WindowText'),
              '.ms-RatingStar-front': _getColorWithHighContrast(ratingStarUncheckedColor, 'WindowText'),
            }
          }
        }
      },
      disabled && {
        cursor: 'default'
      },
    ],
    rootIsSmall: [
      'ms-Rating--small',
      {
        fontSize: ratingSmallIconSize,
        lineHeight: ratingSmallIconSize
      }
    ],
    rootIsLarge: [
      'ms-Rating--large',
      {
        fontSize: ratingLargeIconSize,
        lineHeight: ratingLargeIconSize
      }
    ],
    labelText: [
      'ms-Rating-labelText',
      hiddenContentStyle
    ],
    ratingFocusZone: [
      'ms-Rating-focuszone',
      {
        display: 'inline-block',
        paddingBottom: '1px'
      }
    ]
  };
}
