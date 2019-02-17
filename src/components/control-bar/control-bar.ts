import { Lemming } from '../../lib/lemming';
import { autoinject } from 'aurelia-framework';
import { State } from '../../state';
import { Store, connectTo } from 'aurelia-store';
import { processMessage, updateCode, updateResult, resetState } from '../../actions';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class ControlBar {
    private state: State;

    isProcessing: boolean = false;
    
    constructor(private lemming: Lemming, private store: Store<State>, private ea: EventAggregator) {
        this.store.state.subscribe(state => this.state = state);
    }

    writeSample() {
        this.ea.publish("writeSample");
    }

    clear() {
        this.ea.publish("clear");
        this.store.dispatch(resetState);
    }

    public recognize() {
        try {
            Tesseract.recognize(this.state.canvasContext, {
                lang: 'eng'
            })
            .progress((message: any) => {
                console.log(message);
                this.isProcessing = true;
                this.store.dispatch(processMessage, message.status);
            })
            .catch((err: Error) => { 
                console.error(err);
                this.store.dispatch(processMessage, err.message);
                this.isProcessing = false;
            })
            .then((result: any) => {
                console.log(result);
                result.symbols.forEach((symbol: any) => {
                    this.store.dispatch(processMessage, `Text: ${symbol.text}, Confidence: ${symbol.confidence}`);
                });
                this.store.dispatch(updateCode, result.text);
                this.isProcessing = false;
            });
        } catch(e) {
            this.store.dispatch(processMessage, "Recognization Failed");
        }
    }

    public interpret() {
        this.lemming.onTimeout(() => {
            this.store.dispatch(processMessage, "Timed Out");
        });
    
        this.lemming.onResult((result: any) =>{
            this.store.dispatch(updateResult, result);
        });
    
        this.lemming.onError((error: string) => {
            this.store.dispatch(processMessage, 'Oh noes! ' + error);
        });
    
        this.lemming.onCompleted(() =>{
            //alert('Completed');
            this.store.dispatch(processMessage, "Completed Interpretation");
        });

        this.lemming.run(this.state.code);
    }
}