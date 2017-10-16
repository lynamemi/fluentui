/* tslint:disable:no-unused-variable */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
/* tslint:enable:no-unused-variable */
import * as ReactTestUtils from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import * as renderer from 'react-test-renderer';
import { KeyCodes } from '../../Utilities';

import { ComboBox } from './ComboBox';
import { IComboBox, IComboBoxOption } from './ComboBox.Props';

const DEFAULT_OPTIONS: IComboBoxOption[] = [
  { key: '1', text: '1' },
  { key: '2', text: '2' },
  { key: '3', text: '3' }
];

const DEFAULT_OPTIONS2: IComboBoxOption[] = [
  { key: '1', text: 'One' },
  { key: '2', text: 'Foo' },
  { key: '3', text: 'Bar' }
];

describe('ComboBox', () => {
  it('Renders ComboBox correctly', () => {
    const createNodeMock = (el: React.ReactElement<{}>) => {
      return {
        __events__: {}
      };
    };
    const component = renderer.create(
      <ComboBox options={ DEFAULT_OPTIONS } />,
      { createNodeMock }
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Can flip between enabled and disabled.', () => {
    let wrapper = mount(
      <ComboBox
        disabled={ false }
        label='testgroup'
        options={ DEFAULT_OPTIONS }
      />);
    let comboBoxRoot = wrapper.find('.ms-ComboBox');

    expect(comboBoxRoot.find('.ms-ComboBox.is-disabled').length).toEqual(0);
    expect(comboBoxRoot.find('[data-is-interactable=true]').length).toEqual(1);

    wrapper = mount(
      <ComboBox
        disabled={ true }
        label='testgroup'
        options={ DEFAULT_OPTIONS }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');

    expect(comboBoxRoot.find('.ms-ComboBox.is-disabled').length).toEqual(1);
    expect(comboBoxRoot.find('[data-is-interactable=false]').length).toEqual(1);
  });

  it('Renders no selected item in default case', () => {

    let wrapper = mount(
      <ComboBox
        label='testgroup'
        options={ DEFAULT_OPTIONS }
      />);
    let comboBoxRoot = wrapper.find('.ms-ComboBox');
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any> = comboBoxRoot.find('[role="combobox"]');

    expect(inputElement.text()).toEqual('');
  });

  it('Renders a selected item in uncontrolled case', () => {
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS }
      />);
    let comboBoxRoot = wrapper.find('.ms-ComboBox');
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any> = comboBoxRoot.find('input');

    expect(inputElement.props().value).toEqual('1');
  });

  it('Renders a selected item in controlled case', () => {
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        selectedKey='1'
        options={ DEFAULT_OPTIONS }
      />);
    let comboBoxRoot = wrapper.find('.ms-ComboBox');
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any> = comboBoxRoot.find('input');

    expect(inputElement.props().value).toEqual('1');
  });

  it('New options are not automatically added when allowFreeform on in controlled case', () => {
    let comboBoxRoot;
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any>;
    let comboBoxComponent: any;
    const returnUndefined = (): undefined => {
      return;
    };
    const setRef = (ref: IComboBox): void => {
      comboBoxComponent = ref;
    };

    let wrapper = mount(
      <ComboBox
        label='testgroup'
        options={ DEFAULT_OPTIONS }
        allowFreeform={ true }
        onChanged={ returnUndefined }
        componentRef={ setRef }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('change', { target: { value: 'f' } });
    inputElement.simulate('keydown', { which: KeyCodes.enter });
    expect((comboBoxComponent as React.Component<any, any>).state.currentOptions.length).toEqual(DEFAULT_OPTIONS.length);
  });

  it('New options are automatically added when allowFreeform on in uncontrolled case', () => {
    let comboBoxRoot;
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any>;
    let comboBoxComponent: any;
    const setRef = (ref: IComboBox): void => {
      comboBoxComponent = ref;
    };

    let wrapper = mount(
      <ComboBox
        label='testgroup'
        options={ DEFAULT_OPTIONS }
        allowFreeform={ true }
        componentRef={ setRef }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('change', { target: { value: 'f' } });
    inputElement.simulate('keydown', { which: KeyCodes.enter });
    let currentOptions = (comboBoxComponent as React.Component<any, any>).state.currentOptions;
    expect(currentOptions.length).toEqual(DEFAULT_OPTIONS.length + 1);
    expect(currentOptions[currentOptions.length - 1].text).toEqual('f');
  });

  it('Renders a default value with options', () => {
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        value='1'
        options={ DEFAULT_OPTIONS }
      />);
    let comboBoxRoot = wrapper.find('.ms-ComboBox');
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any> = comboBoxRoot.find('input');

    expect(inputElement.props().value).toEqual('1');
  });

  it('Renders a default value with no options', () => {
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        options={ [] }
        value='1'
      />);
    let comboBoxRoot = wrapper.find('.ms-ComboBox');
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any> = comboBoxRoot.find('input');

    expect(inputElement.props().value).toEqual('1');
  });

  it('Can change items in uncontrolled case', () => {
    let comboBoxRoot;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS }
      />);

    // Manually assign `offsetParent` and `scrollIntoView` since it doesn't exist without DOM
    let el = document.createElement('div') as Element;
    el.scrollIntoView = () => null;
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', { get: () => el });

    comboBoxRoot = wrapper.find('.ms-ComboBox');
    let buttonElement = comboBoxRoot.find('button');
    buttonElement.simulate('click');
    let secondItemElement: Element = wrapper.getDOMNode().ownerDocument.querySelector('.ms-ComboBox-option[data-index="1"]')!;

    ReactTestUtils.Simulate.click(secondItemElement);
    ReactTestUtils.Simulate.click(secondItemElement!);

    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any> = comboBoxRoot.find('input');
    expect(inputElement.props().value).toEqual('2');
  });

  it('Can insert text in uncontrolled case with autoComplete and allowFreeform on', () => {
    let comboBoxRoot;
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any>;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS2 }
        autoComplete='on'
        allowFreeform={ true }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('change', { target: { value: 'f' } });
    inputElement = comboBoxRoot.find('input');
    expect(inputElement.props().value).toEqual('Foo');
  });

  it('Can insert text in uncontrolled case with autoComplete on and allowFreeform off', () => {
    let comboBoxRoot;
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any>;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS2 }
        autoComplete='on'
        allowFreeform={ false }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('change', { target: { value: 'f' } });
    inputElement = comboBoxRoot.find('input');
    expect(inputElement.props().value).toEqual('Foo');
  });

  it('Can insert text in uncontrolled case with autoComplete off and allowFreeform on', () => {
    let comboBoxRoot;
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any>;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS2 }
        autoComplete='off'
        allowFreeform={ true }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('change', { target: { value: 'f' } });
    inputElement = comboBoxRoot.find('input');
    expect(inputElement.props().value).toEqual('f');
  });

  it('Can insert text in uncontrolled case with autoComplete and allowFreeform off', () => {
    let comboBoxRoot;
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any>;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS2 }
        autoComplete='off'
        allowFreeform={ false }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('keydown', { which: 'f' });
    inputElement = comboBoxRoot.find('input');
    expect(inputElement.props().value).toEqual('One');
  });

  it('Can change selected option with keyboard', () => {
    let comboBoxRoot;
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any>;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS2 }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('keydown', { which: KeyCodes.down });
    inputElement = comboBoxRoot.find('input');
    expect(inputElement.props().value).toEqual('Foo');
  });

  it('Cannot insert text while disabled', () => {
    let comboBoxRoot;
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any>;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS2 }
        disabled={ true }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('keydown', { which: KeyCodes.a });
    inputElement = comboBoxRoot.find('input');
    expect(inputElement.props().value).toEqual('One');
  });

  it('Cannot change selected option with keyboard while disabled', () => {
    let comboBoxRoot;
    let inputElement: ReactWrapper<React.InputHTMLAttributes<any>, any>;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS2 }
        disabled={ true }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('keydown', { which: KeyCodes.down });
    inputElement = comboBoxRoot.find('input');
    expect(inputElement.props().value).toEqual('One');
  });

  it('Cannot expand the menu when clicking on the input while disabled', () => {
    let comboBoxRoot;
    let inputElement;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS2 }
        disabled={ true }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    inputElement = comboBoxRoot.find('input');
    inputElement.simulate('click');
    expect(comboBoxRoot.find('.is-opened').length).toEqual(0);
  });

  it('Cannot expand the menu when clicking on the button while disabled', () => {
    let comboBoxRoot;
    let buttonElement;
    let wrapper = mount(
      <ComboBox
        label='testgroup'
        defaultSelectedKey='1'
        options={ DEFAULT_OPTIONS2 }
        disabled={ true }
      />);
    comboBoxRoot = wrapper.find('.ms-ComboBox');
    buttonElement = comboBoxRoot.find('button');
    buttonElement.simulate('click');
    expect(comboBoxRoot.find('.is-opened').length).toEqual(0);
  });
});
