/* tslint:disable:no-unused-variable */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
/* tslint:enable:no-unused-variable */
import * as ReactTestUtils from 'react-dom/test-utils';
import * as renderer from 'react-test-renderer';

import {
  KeyCodes,
} from '../../Utilities';
import { Dropdown } from './Dropdown';
import { DropdownMenuItemType, IDropdownOption } from './Dropdown.Props';

const DEFAULT_OPTIONS: IDropdownOption[] = [
  { key: 'Header1', text: 'Header 1', itemType: DropdownMenuItemType.Header },
  { key: '1', text: '1' },
  { key: '2', text: '2' },
  { key: '3', text: '3' },
  { key: 'Divider1', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'Header2', text: 'Header 2', itemType: DropdownMenuItemType.Header },
  { key: '4', text: '4' },
  { key: '5', text: '5' },
  { key: '6', text: '6' },
];

describe('Dropdown', () => {

  describe('single-select', () => {

    it('Renders single-select Dropdown correctly', () => {
      const component = renderer.create(<Dropdown options={ DEFAULT_OPTIONS } />);
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('Can flip between enabled and disabled.', () => {

      let container = document.createElement('div');
      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;

      expect(dropdownRoot.className).not.toEqual(expect.stringMatching('is-disabled'));
      expect(dropdownRoot.getAttribute('data-is-focusable')).toEqual('true');

      ReactDOM.render(
        <Dropdown
          disabled={ true }
          label='testgroup'
          options={ DEFAULT_OPTIONS }
        />,
        container);

      expect(dropdownRoot.className).toEqual(expect.stringMatching('is-disabled'));
      expect(dropdownRoot.getAttribute('data-is-focusable')).toEqual('false');
    });

    it('Renders no selected item in default case', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('');
    });

    it('Renders a selected item if option specifies selected', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ [{ key: '1', text: '1', selected: true }, { key: '2', text: '2' },] }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1');
    });

    it('Renders a selected item in uncontrolled case', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          defaultSelectedKey='1'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1');
    });

    it('does not change the selected item in when defaultKey changes', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          defaultSelectedKey='1'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          defaultSelectedKey='2'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      expect(titleElement.textContent).toEqual('1');
    });

    it('Renders a selected item in controlled case', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          selectedKey='1'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1');
    });

    it('does change the selected item in when selectedKey changes', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          selectedKey='1'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          selectedKey='2'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      expect(titleElement.textContent).toEqual('2');
    });

    it('Can change items in uncontrolled case', () => {
      let container = document.createElement('div');
      let dropdownRoot: HTMLElement | undefined;

      document.body.appendChild(container);

      try {
        ReactDOM.render(
          <Dropdown
            label='testgroup'
            defaultSelectedKey='1'
            options={ DEFAULT_OPTIONS }
          />,
          container);
        dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;

        ReactTestUtils.Simulate.click(dropdownRoot);

        let secondItemElement = document.querySelector('.ms-Dropdown-item[data-index="2"]') as HTMLElement;
        ReactTestUtils.Simulate.click(secondItemElement);
      }
      finally {
        expect(dropdownRoot!.querySelector('.ms-Dropdown-title')!.textContent).toEqual('2');
      }
    });

    it('issues the onChanged callback when the selected item is different', () => {
      let container = document.createElement('div');
      let dropdownRoot: HTMLElement | undefined;

      document.body.appendChild(container);

      let onChangedSpy = jasmine.createSpy('onChanged');

      try {
        ReactDOM.render(
          <Dropdown
            label='testgroup'
            defaultSelectedKey='1'
            onChanged={ onChangedSpy }
            options={ DEFAULT_OPTIONS }
          />,
          container);
        dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;

        ReactTestUtils.Simulate.click(dropdownRoot);

        let secondItemElement = document.querySelector('.ms-Dropdown-item[data-index="2"]') as HTMLElement;
        ReactTestUtils.Simulate.click(secondItemElement);
      }
      finally {
        expect(onChangedSpy).toHaveBeenCalledWith(DEFAULT_OPTIONS[2], 2);
      }
    });

    it('issues the onDismiss callback when dismissing options callout', () => {
      let container = document.createElement('div');
      let dropdownRoot: HTMLElement | undefined;

      document.body.appendChild(container);

      let onDismissSpy = jasmine.createSpy('onDismiss');

      try {
        ReactDOM.render(
          <Dropdown
            label='testgroup'
            defaultSelectedKey='1'
            onDismiss={ onDismissSpy }
            options={ DEFAULT_OPTIONS }
          />,
          container);
        dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;

        ReactTestUtils.Simulate.click(dropdownRoot);

        let secondItemElement = document.querySelector('.ms-Dropdown-item[data-index="2"]') as HTMLElement;
        ReactTestUtils.Simulate.click(secondItemElement);
      }
      finally {
        expect(onDismissSpy).toHaveBeenCalledTimes(1);
      }
    });

    it('issues the onChanged callback when the selected item is different', () => {
      let container = document.createElement('div');
      let dropdownRoot: HTMLElement | undefined;

      document.body.appendChild(container);

      let onChangedSpy = jasmine.createSpy('onChanged');

      try {
        ReactDOM.render(
          <Dropdown
            label='testgroup'
            defaultSelectedKey='1'
            onChanged={ onChangedSpy }
            options={ DEFAULT_OPTIONS }
          />,
          container);
        dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;

        ReactTestUtils.Simulate.click(dropdownRoot);

        let secondItemElement = document.querySelector('.ms-Dropdown-item[data-index="1"]') as HTMLElement;
        ReactTestUtils.Simulate.click(secondItemElement);
      }
      finally {
        expect(onChangedSpy).not.toHaveBeenCalled();
      }
    });

    it('Will select the first valid item on keypress', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.down });

      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;
      expect(titleElement.textContent).toEqual('1');
    });

    it('Will select the first valid item on Home keypress', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.home });

      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;
      expect(titleElement.textContent).toEqual('1');
    });

    it('Will select the last valid item on End keypress', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.end });

      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;
      expect(titleElement.textContent).toEqual('6');
    });

    it('Will skip over headers and separators on keypress', () => {
      let container = document.createElement('div');
      let dropdownRoot;
      let titleElement;

      document.body.appendChild(container);
      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
        />,
        container);
      dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;

      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.down });
      titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;
      expect(titleElement.textContent).toEqual('1');

      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.down });
      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.down });
      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.down });
      titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;
      expect(titleElement.textContent).toEqual('4');
    });
  });

  describe('multi-select', () => {
    it('Renders multiselect Dropdown correctly', () => {
      const component = renderer.create(
        <Dropdown
          options={ DEFAULT_OPTIONS }
          multiSelect
        />);
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('Renders no selected item in default case', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
          multiSelect
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('');
    });

    it('Renders a selected item if option specifies selected', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ [{ key: '1', text: '1', selected: true }, { key: '2', text: '2' },] }
          multiSelect
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1');
    });

    it('Renders multiple selected items if multiple options specify selected', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ [{ key: '1', text: '1', selected: true }, { key: '2', text: '2', selected: true },] }
          multiSelect
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1, 2');
    });

    it('Renders a selected item in uncontrolled case', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          defaultSelectedKeys={ ['1', '2'] }
          multiSelect
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1, 2');
    });

    it('does not change the selected items when defaultSelectedKeys changes', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          defaultSelectedKeys={ ['1', '2'] }
          multiSelect
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1, 2');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          defaultSelectedKeys={ ['3', '4'] }
          multiSelect
          options={ DEFAULT_OPTIONS }
        />,
        container);

      expect(titleElement.textContent).toEqual('1, 2');
    });

    it('Renders selected items in controlled case', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          selectedKeys={ ['1', '3'] }
          multiSelect
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1, 3');
    });

    it('changes selected items in controlled case', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          selectedKeys={ ['1', '3'] }
          multiSelect
          options={ DEFAULT_OPTIONS }
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;

      expect(titleElement.textContent).toEqual('1, 3');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          selectedKeys={ ['2', '4'] }
          multiSelect
          options={ DEFAULT_OPTIONS }
        />,
        container);
      expect(titleElement.textContent).toEqual('2, 4');
    });

    it('Can change items in uncontrolled case', () => {
      let container = document.createElement('div');
      let dropdownRoot: HTMLElement | undefined;

      document.body.appendChild(container);

      try {
        ReactDOM.render(
          <Dropdown
            label='testgroup'
            defaultSelectedKeys={ ['1'] }
            multiSelect
            id='test'
            options={ DEFAULT_OPTIONS }
          />,
          container);
        dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;

        ReactTestUtils.Simulate.click(dropdownRoot);

        let secondItemElement = document.querySelectorAll('.ms-Dropdown-item[role="checkbox"]')[1] as HTMLElement;
        ReactTestUtils.Simulate.click(secondItemElement);
      }
      finally {
        expect(dropdownRoot!.querySelector('.ms-Dropdown-title')!.textContent).toEqual('1, 2');
      }
    });

    /*
    // I'm not sure why these two tests fail. I've manually verified the scenario, even manually through programatic clicks, but these
    // tests simply won't pass
    it('issues the onChanged callback when selecting an item', () => {
      let container = document.createElement('div');
      let dropdownRoot: HTMLElement | undefined;

      document.body.appendChild(container);

      let onChangedSpy = jasmine.createSpy('onChanged');

      try {
        ReactDOM.render(
          <Dropdown
            label='testgroup'
            defaultSelectedKeys={ ['1'] }
            multiSelect
            onChanged={ onChangedSpy }
            options={ DEFAULT_OPTIONS }
          />,
          container);
        dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;

        ReactTestUtils.Simulate.click(dropdownRoot);

        let secondItemElement = document.querySelectorAll('.ms-Dropdown-item[role="checkbox"]')[1] as HTMLElement;
        ReactTestUtils.Simulate.click(secondItemElement);
      }
      finally {
        expect(onChangedSpy).toHaveBeenCalledWith({ ...DEFAULT_OPTIONS[2], selected: true }, 2);
      }
    });

    it('issues the onChanged callback when unselecting an item', () => {
      let container = document.createElement('div');
      let dropdownRoot: HTMLElement | undefined;

      document.body.appendChild(container);

      let onChangedSpy = jasmine.createSpy('onChanged');

      try {
        ReactDOM.render(
          <Dropdown
            label='testgroup'
            defaultSelectedKeys={ ['1'] }
            multiSelect
            onChanged={ onChangedSpy }
            options={ DEFAULT_OPTIONS }
          />,
          container);
        dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;

        ReactTestUtils.Simulate.click(dropdownRoot);

        let firstItemElement = document.querySelectorAll('.ms-Dropdown-item[role="checkbox"]')[0] as HTMLElement;
        ReactTestUtils.Simulate.click(firstItemElement);
      }
      finally {
        expect(onChangedSpy).toHaveBeenCalledWith({ ...DEFAULT_OPTIONS[1], selected: false }, 1);
      }
    });
    */

    it('Will not select the first valid item on keypress', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
          multiSelect
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.down });

      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;
      expect(titleElement.textContent).toEqual('');
    });

    it('Will not select the first valid item on Home keypress', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
          multiSelect
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.home });

      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;
      expect(titleElement.textContent).toEqual('');
    });

    it('Will not select the last valid item on End keypress', () => {
      let container = document.createElement('div');

      ReactDOM.render(
        <Dropdown
          label='testgroup'
          options={ DEFAULT_OPTIONS }
          multiSelect
        />,
        container);
      let dropdownRoot = container.querySelector('.ms-Dropdown') as HTMLElement;
      ReactTestUtils.Simulate.keyDown(dropdownRoot, { which: KeyCodes.end });

      let titleElement = dropdownRoot.querySelector('.ms-Dropdown-title') as HTMLElement;
      expect(titleElement.textContent).toEqual('');
    });

  });
});
