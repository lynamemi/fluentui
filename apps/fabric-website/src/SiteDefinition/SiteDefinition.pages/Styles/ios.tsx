import * as React from 'react';
import { INavPage, LoadingComponent } from '@uifabric/example-app-base/lib/index2';

export const stylesPagesIOS: INavPage[] = [
  {
    title: 'Styles',
    url: '#/styles/ios',
    isHiddenFromMainNav: true,
    component: () => <LoadingComponent title="Styles" />,
    getComponent: cb => require.ensure([], require => cb(require<any>('../../../pages/Overviews/StylesPage/StylesPage').StylesPage))
  }
];
