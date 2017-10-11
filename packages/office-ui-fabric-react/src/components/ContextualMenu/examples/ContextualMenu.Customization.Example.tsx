import * as React from 'react';
import { DirectionalHint, ContextualMenuItemType, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { DefaultButton, IconButton, IButton } from 'office-ui-fabric-react/lib/Button';
import { FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import './ContextualMenuExample.scss';

export interface IContextualMenuSelectExampleState {
  selection?: { [key: string]: boolean };
}

let keys: string[] = ['none', 'bulb', 'run', 'plane', 'page', 'cake', 'soccer', 'home', 'emoji', 'work', 'coffee', 'people', 'stopwatch', 'music', 'lock'];

export class ContextualMenuCustomizationExample extends React.Component<{}, IContextualMenuSelectExampleState> {
  private _button: IButton | undefined;

  constructor() {
    super();

    this._onToggleSelect = this._onToggleSelect.bind(this);

    this.state = {
      selection: {},
    };
  }

  public render() {
    let { selection } = this.state;

    return (
      <DefaultButton
        componentRef={ (button) => this._button = button }
        className='ContextualMenuButton3'
        text='Click for ContextualMenu'
        menuProps={
          {
            shouldFocusOnMount: false,
            directionalHint: DirectionalHint.bottomLeftEdge,
            className: 'ms-ContextualMenu-customizationExample',
            items:
            [
              {
                key: 'newItem',
                name: 'New'
              },
              {
                key: 'upload',
                name: 'Upload'
              },
              {
                key: 'divider_1',
                itemType: ContextualMenuItemType.Divider
              },
              {
                key: 'charm',
                name: 'Charm',
                className: 'Charm-List',
                subMenuProps: {
                  arrowDirection: FocusZoneDirection.bidirectional,
                  items: [
                    {
                      key: keys[0],
                      name: 'None',
                      canCheck: true,
                      isChecked: selection![keys[0]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[1],
                      name: 'Lightbulb',
                      // onRender: this._renderCharmMenuItem,
                      // className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[1]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[2],
                      name: 'Running',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[2]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[3],
                      name: 'Airplane',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[3]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[4],
                      name: 'Page',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[4]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[5],
                      name: 'Cake',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[5]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[6],
                      name: 'Soccer',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[6]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[7],
                      name: 'Home',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[7]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[8],
                      name: 'Emoji2',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[8]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[9],
                      name: 'Work',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[9]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[10],
                      name: 'Coffee',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[10]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[11],
                      name: 'People',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[11]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[12],
                      name: 'Stopwatch',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[12]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[13],
                      name: 'MusicInCollectionFill',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[13]],
                      onClick: this._onToggleSelect
                    },
                    {
                      key: keys[14],
                      name: 'Lock',
                      onRender: this._renderCharmMenuItem,
                      className: 'ms-ContextualMenu-customizationExample-item',
                      canCheck: true,
                      isChecked: selection![keys[14]],
                      onClick: this._onToggleSelect
                    }
                  ]
                },
              },
              {
                key: 'categories',
                name: 'Categorize',
                subMenuProps: {
                  items: [
                    {
                      key: 'categories',
                      name: 'categories',
                      categoryList: [
                        {
                          name: 'Personal',
                          color: 'yellow'
                        },
                        {
                          name: 'Work',
                          color: 'green'
                        },
                        {
                          name: 'Birthday',
                          color: 'blue'
                        },
                        {
                          name: 'Spam',
                          color: 'grey'
                        },
                        {
                          name: 'Urgent',
                          color: 'red'
                        },
                        {
                          name: 'Hobbies',
                          color: 'black'
                        },
                      ],
                      onRender: this._renderCategoriesList
                    },
                    {
                      key: 'divider_1',
                      itemType: ContextualMenuItemType.Divider
                    },
                    {
                      key: 'clear',
                      name: 'Clear categories'
                    },
                    {
                      key: 'manage',
                      name: 'Manage categories'
                    }
                  ]
                },
              }
            ]
          }
        }

      />
    );
  }

  @autobind
  private _dismissMenu() {
    if (this._button) {
      this._button.dismissMenu();
    }
  }

  @autobind
  private _onToggleSelect(ev?: React.MouseEvent<HTMLButtonElement>, item?: IContextualMenuItem) {
    let { selection } = this.state;
    console.log('SELECTION-->', selection);

    selection![item!.key] = !selection![item!.key];

    this.setState({
      selection: selection
    });
  }

  @autobind
  private _renderCharmMenuItem(item: any) {
    // console.log(item.isChecked, item);
    return (
      <IconButton
        iconProps={ { iconName: item.name } }
        className='ms-ContextualMenu-customizationExample-icon ms-ContextualMenu-link'
        data-is-focusable={ true }
        onClick={ this._dismissMenu }
      />
    );
  }

  private _renderCategoriesList(item: any) {
    return (
      <ul className='ms-ContextualMenu-customizationExample-categoriesList'>
        <li className='ms-ContextualMenu-item'>
          { item.categoryList.map((category: any) =>
            <button className='ms-ContextualMenu-link' role='menuitem'>
              <div>
                <span
                  className='ms-ContextualMenu-icon ms-ContextualMenu-customizationExample-categorySwatch'
                  style={ { backgroundColor: category.color } }
                />
                <span className='ms-ContextualMenu-itemText'>
                  { category.name }
                </span>
              </div>
            </button>
          ) }
        </li>
      </ul>
    );
  }
}