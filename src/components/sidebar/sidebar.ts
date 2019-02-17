import { Store, connectTo } from "aurelia-store";
import { pluck } from 'rxjs/operators';

import { State } from "../../state";
import { autoinject } from "aurelia-framework";

@autoinject
@connectTo<State>({
    selector: {
        message: (store) => store.state.pipe(pluck('message')),
        code: (store) => store.state.pipe(pluck('code')),
        result: (store) => store.state.pipe(pluck('result'))
    }
})
export class Sidebar {
    private consoleContent: HTMLDivElement;
    private codeContent: HTMLPreElement;
    private outputContent: HTMLDivElement;
    hasOutput: boolean = false;

    constructor(private store: Store<State>) {
        
    }

    messageChanged(newState: string, oldState: string) {
        if(newState && newState !== "" && newState !== oldState)
            this.consoleContent.insertAdjacentHTML("afterbegin", `${newState}<br>`);
    }

    codeChanged(newState: string, oldState: string) {
        this.codeContent.innerHTML = newState.trim();
    }

    resultChanged(newState: any, oldState: any) {
        if(newState != null) {
            this.outputContent.innerText = newState;
            this.hasOutput = true;
        } else {
            this.hasOutput = false;
        }
    }
}