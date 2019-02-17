import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { State } from "./state";
import { updateContext, processMessage, updateCode, updateResult, resetState } from "./actions";

@autoinject
export class App {
    constructor(private store: Store<State>) {
        this.store.registerAction("updateContext", updateContext);
        this.store.registerAction("processMessage", processMessage);
        this.store.registerAction("updateCode", updateCode);
        this.store.registerAction("updateResult", updateResult);
        this.store.registerAction("resetState", resetState);
    }
}