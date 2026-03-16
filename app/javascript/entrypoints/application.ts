import './application.css';
import * as Turbo from '@hotwired/turbo';
import { TurboMount } from 'turbo-mount';
import plugin, { registerComponent } from 'turbo-mount/react';

Turbo.start();

const turboMount = new TurboMount();

// React コンポーネントをここで登録していく
// import HelloWorld from '~/components/react/HelloWorld'
// registerComponent(turboMount, 'HelloWorld', HelloWorld)

export { plugin, registerComponent, turboMount };
