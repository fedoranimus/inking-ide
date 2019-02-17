import { Aurelia, PLATFORM } from 'aurelia-framework';
import { App } from './app';
import { initialState } from './state';
//import 'bulma/css/bulma.css';

export function configure(aurelia: Aurelia) {
    aurelia.use
            .standardConfiguration()
            .developmentLogging()
            .plugin(PLATFORM.moduleName('aurelia-store'),{
                initialState
            });

    aurelia.start().then(() => aurelia.setRoot(App));
}