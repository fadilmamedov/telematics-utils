import ReactDOM from 'react-dom/client';
import './index.css';
import { Application } from './Application';
import { FocusStyleManager } from '@blueprintjs/core';
import { RecoilRoot } from 'recoil';

FocusStyleManager.onlyShowFocusOnTabs();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <RecoilRoot>
    <Application />
  </RecoilRoot>
);
