import * as React from 'react';
import { INavPage, LoadingComponent } from '@uifabric/example-app-base/lib/index2';

export const stylesPagesAndroid: INavPage[] = [
  {
    title: 'Styles',
    url: '#/styles/android',
    isHiddenFromMainNav: true,
    component: () => <LoadingComponent title="Styles" />,
    getComponent: cb => require.ensure([], require => cb(require<any>('../../../pages/Overviews/StylesPage/StylesPage').StylesPage))
  }
];
