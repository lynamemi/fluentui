import * as React from 'react';
import { BaseComponent, KeyCodes, css, createRef } from '../../Utilities';
import { Callout, DirectionalHint } from '../../Callout';
import { ISuggestionModel } from '../../Pickers';
import {
  IBaseFloatingPicker,
  IBaseFloatingPickerProps,
  IBaseFloatingPickerSuggestionProps
} from './BaseFloatingPicker.types';
import { ISuggestionsControlProps } from './Suggestions/Suggestions.types';
import { SuggestionsControl } from './Suggestions/SuggestionsControl';
import { SuggestionsStore } from './Suggestions/SuggestionsStore';
import * as stylesImport from './BaseFloatingPicker.scss';
// tslint:disable-next-line:no-any
const styles: any = stylesImport;

export interface IBaseFloatingPickerState {
  queryString: string;
  suggestionsVisible?: boolean;
  didBind: boolean;
}

export class BaseFloatingPicker<T, P extends IBaseFloatingPickerProps<T>>
  extends BaseComponent<P, IBaseFloatingPickerState>
  implements IBaseFloatingPicker {
  protected selection: Selection;

  protected root = createRef<HTMLDivElement>();
  protected suggestionStore: SuggestionsStore<T>;
  protected suggestionsControl: SuggestionsControl<T>;
  protected SuggestionsControlOfProperType: new (props: ISuggestionsControlProps<T>) => SuggestionsControl<
    T
  > = SuggestionsControl as new (props: ISuggestionsControlProps<T>) => SuggestionsControl<T>;
  protected loadingTimer: number | undefined;
  // tslint:disable-next-line:no-any
  protected currentPromise: PromiseLike<any>;

  constructor(basePickerProps: P) {
    super(basePickerProps);

    this.suggestionStore = basePickerProps.suggestionsStore;
    this.state = {
      queryString: '',
      didBind: false
    };
  }

  public get inputText(): string {
    return this.state.queryString;
  }

  // tslint:disable-next-line:no-any
  public get suggestions(): any[] {
    return this.suggestionStore.suggestions;
  }

  public forceResolveSuggestion(): void {
    if (this.suggestionsControl && this.suggestionsControl.hasSuggestionSelected()) {
      this.completeSuggestion();
    } else {
      this._onValidateInput();
    }
  }

  public get currentSelectedSuggestionIndex(): number {
    return this.suggestionsControl ? this.suggestionsControl.currentSuggestionIndex : -1;
  }

  public get isSuggestionsShown(): boolean {
    return this.state.suggestionsVisible === undefined ? false : this.state.suggestionsVisible;
  }

  public onQueryStringChanged = (queryString: string): void => {
    if (queryString !== this.state.queryString) {
      this.setState({
        queryString: queryString
      });

      this.showPicker(true /*updateValue*/);
    }
  };

  public hidePicker = (): void => {
    if (this.props.onSuggestionsHidden && this.isSuggestionsShown) {
      this.props.onSuggestionsHidden();
    }

    this.setState({
      suggestionsVisible: false
    });
  };

  public showPicker = (updateValue: boolean = false): void => {
    if (this.props.onSuggestionsShown && !this.isSuggestionsShown) {
      this.props.onSuggestionsShown();
    }

    this.setState({
      suggestionsVisible: true
    });

    // Update the suggestions if updateValue == true
    if (updateValue) {
      const value = this.props.inputElement ? this.props.inputElement.value : '';
      if (value === '') {
        this.updateSuggestionWithZeroState();
      } else {
        this.updateValue(value);
      }
    }
  };

  public componentDidMount(): void {
    this._bindToInputElement();

    this._onResolveSuggestions = this._async.debounce(this._onResolveSuggestions, this.props.resolveDelay);
  }

  public componentDidUpdate(): void {
    this._bindToInputElement();
  }

  public componentWillUnmount(): void {
    this._unbindFromInputElement();
  }

  public completeSuggestion = (): void => {
    if (this.suggestionsControl && this.suggestionsControl.hasSuggestionSelected()) {
      this.onChange(this.suggestionsControl.currentSuggestion!.item);
    }
  };

  public updateSuggestions(suggestions: T[], forceUpdate: boolean = false): void {
    this.suggestionStore.updateSuggestions(suggestions);

    if (forceUpdate) {
      this.forceUpdate();
    }
  }

  public render(): JSX.Element {
    const { className } = this.props;
    return (
      <div ref={this.root} className={css('ms-BasePicker ms-BaseFloatingPicker', className ? className : '')}>
        {this.renderSuggestions()}
      </div>
    );
  }

  protected renderSuggestions(): JSX.Element | null {
    const TypedSuggestionsControl = this.SuggestionsControlOfProperType;
    return this.state.suggestionsVisible ? (
      <Callout
        className={styles.callout}
        isBeakVisible={false}
        gapSpace={5}
        target={this.props.inputElement}
        onDismiss={this.hidePicker}
        directionalHint={DirectionalHint.bottomLeftEdge}
        directionalHintForRTL={DirectionalHint.bottomRightEdge}
        calloutWidth={this.props.calloutWidth ? this.props.calloutWidth : 0}
      >
        <TypedSuggestionsControl
          onRenderSuggestion={this.props.onRenderSuggestionsItem}
          onSuggestionClick={this.onSuggestionClick}
          onSuggestionRemove={this.onSuggestionRemove}
          suggestions={this.suggestionStore.getSuggestions()}
          ref={this._resolveRef('suggestionsControl')}
          completeSuggestion={this.completeSuggestion}
          shouldLoopSelection={false}
          {...this.props.pickerSuggestionsProps as IBaseFloatingPickerSuggestionProps}
        />
      </Callout>
    ) : null;
  }

  protected onSelectionChange(): void {
    this.forceUpdate();
  }

  protected updateValue(updatedValue: string): void {
    if (this.props.onInputChanged) {
      (this.props.onInputChanged as (filter: string) => void)(updatedValue);
    }

    this._onResolveSuggestions(updatedValue);
  }

  protected updateSuggestionWithZeroState(): void {
    if (this.props.onZeroQuerySuggestion) {
      const onEmptyInputFocus = this.props.onZeroQuerySuggestion as (selectedItems?: T[]) => T[] | PromiseLike<T[]>;
      const suggestions: T[] | PromiseLike<T[]> = onEmptyInputFocus(this.props.selectedItems);
      this.updateSuggestionsList(suggestions);
    } else {
      this.hidePicker();
    }
  }

  protected updateSuggestionsList(suggestions: T[] | PromiseLike<T[]>, updatedValue?: string): void {
    const suggestionsArray: T[] = suggestions as T[];
    const suggestionsPromiseLike: PromiseLike<T[]> = suggestions as PromiseLike<T[]>;

    // Check to see if the returned value is an array, if it is then just pass it into the next function.
    // If the returned value is not an array then check to see if it's a promise or PromiseLike. If it is then resolve it asynchronously.
    if (Array.isArray(suggestionsArray)) {
      if (updatedValue !== undefined) {
        this.resolveNewValue(updatedValue, suggestionsArray);
      } else {
        this.updateSuggestions(suggestionsArray, true /*forceUpdate*/);
      }
    } else if (suggestionsPromiseLike && suggestionsPromiseLike.then) {
      this._updateSuggestionsVisible(updatedValue !== undefined && updatedValue !== '');

      // Ensure that the promise will only use the callback if it was the most recent one.
      const promise: PromiseLike<T[]> = (this.currentPromise = suggestionsPromiseLike);
      promise.then((newSuggestions: T[]) => {
        if (promise === this.currentPromise) {
          if (updatedValue !== undefined) {
            this.resolveNewValue(updatedValue, newSuggestions);
          } else {
            this.updateSuggestions(newSuggestions);

            this._updateSuggestionsVisible(newSuggestions.length > 0);
          }
          if (this.loadingTimer) {
            this._async.clearTimeout(this.loadingTimer);
            this.loadingTimer = undefined;
          }
        }
      });
    }
  }

  protected resolveNewValue(updatedValue: string, suggestions: T[]): void {
    this.updateSuggestions(suggestions);
    this._updateSuggestionsVisible(updatedValue !== '');
  }

  protected onChange(item: T): void {
    if (this.props.onChange) {
      (this.props.onChange as ((items: T) => void))(item);
    }
  }

  protected onSuggestionClick = (ev: React.MouseEvent<HTMLElement>, item: T, index: number): void => {
    this.onChange(item);
  };

  protected onSuggestionRemove = (ev: React.MouseEvent<HTMLElement>, item: T, index: number): void => {
    if (this.props.onRemoveSuggestion) {
      (this.props.onRemoveSuggestion as ((item: T) => void))(item);
    }

    if (this.suggestionsControl) {
      this.suggestionsControl.removeSuggestion(index);
    }
  };

  protected onKeyDown = (ev: MouseEvent): void => {
    if (
      !this.state.suggestionsVisible ||
      (this.props.inputElement && !(this.props.inputElement as HTMLElement).contains(ev.target as HTMLElement))
    ) {
      return;
    }
    const keyCode = ev.which;
    switch (keyCode) {
      case KeyCodes.escape:
        this.hidePicker();
        ev.preventDefault();
        ev.stopPropagation();
        break;

      case KeyCodes.tab:
      case KeyCodes.enter:
        if (!ev.shiftKey && !ev.ctrlKey && this.suggestionsControl && this.suggestionsControl.handleKeyDown(keyCode)) {
          ev.preventDefault();
          ev.stopPropagation();
        } else {
          this._onValidateInput();
        }
        break;

      case KeyCodes.del:
        if (
          this.props.onRemoveSuggestion &&
          this.suggestionsControl &&
          this.suggestionsControl.hasSuggestionSelected &&
          this.suggestionsControl.currentSuggestion
        ) {
          (this.props.onRemoveSuggestion as ((item: T) => void))(this.suggestionsControl.currentSuggestion!.item);

          this.suggestionsControl.removeSuggestion();
          this.forceUpdate();
        }
        ev.stopPropagation();
        break;

      case KeyCodes.up:
        if (this.suggestionsControl && this.suggestionsControl.handleKeyDown(keyCode)) {
          ev.preventDefault();
          ev.stopPropagation();
        }
        break;

      case KeyCodes.down:
        if (this.suggestionsControl && this.suggestionsControl.handleKeyDown(keyCode)) {
          ev.preventDefault();
          ev.stopPropagation();
        }
        break;
    }
  };

  private _onResolveSuggestions(updatedValue: string): void {
    const suggestions: T[] | PromiseLike<T[]> | null = this.props.onResolveSuggestions(
      updatedValue,
      this.props.selectedItems
    );

    if (suggestions !== null) {
      this.updateSuggestionsList(suggestions, updatedValue);
    }
  }

  private _onValidateInput = (): void => {
    if (this.state.queryString && this.props.onValidateInput && this.props.createGenericItem) {
      const itemToConvert: ISuggestionModel<T> = (this.props.createGenericItem as ((
        input: string,
        isValid: boolean
      ) => ISuggestionModel<T>))(
        this.state.queryString,
        (this.props.onValidateInput as ((input: string) => boolean))(this.state.queryString)
      );
      const convertedItems = this.suggestionStore.convertSuggestionsToSuggestionItems([itemToConvert]);
      this.onChange(convertedItems[0].item);
    }
  };

  private _updateSuggestionsVisible(shouldShow: boolean): void {
    if (shouldShow) {
      this.showPicker();
    } else {
      this.hidePicker();
    }
  }

  private _bindToInputElement(): void {
    if (this.props.inputElement && !this.state.didBind) {
      this.props.inputElement.addEventListener('keydown', this.onKeyDown);
      this.setState({ didBind: true });
    }
  }

  private _unbindFromInputElement(): void {
    if (this.props.inputElement && this.state.didBind) {
      this.props.inputElement.removeEventListener('keydown', this.onKeyDown);
      this.setState({ didBind: false });
    }
  }
}
