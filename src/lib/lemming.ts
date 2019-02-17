//import Worker from "worker-loader!./lemming.worker";

export interface ILemmingOptions {
    fileName: string;
    timeout: number;
    scripts: any[];
    enableXHR: boolean;
}

export class Lemming { 
    private options: ILemmingOptions = {
        fileName: 'dist/lemming.worker.js',
        timeout: 30000,
        scripts: [],
        enableXHR: false
    };
    
    constructor() {

    }

    private handleTimeout() { }

    private handleError(message: string | any) { }

    private handleCompleted() { }

    private handleResult(data: any) { }

    public run(script: string, options: ILemmingOptions = this.options) {
        const worker = new Worker(options.fileName);
        const handle = setTimeout(() => {
            worker.terminate();
            this.handleTimeout();
            this.handleCompleted();

        }, options.timeout);

        worker.addEventListener('message', (e) => {
            clearTimeout(handle);
            this.handleResult(e.data);
            this.handleCompleted();
        });

        worker.addEventListener('error', (e) => {
            clearTimeout(handle);
            this.handleError(e.message || e);
            this.handleCompleted();
        });

        const message = JSON.stringify({
            source: script,
            scripts: options.scripts,
            enableXHR: options.enableXHR
        });

        worker.postMessage(message);
    }

    public onResult(callback: any) {
        this.handleResult = callback;
    }
    
    public onTimeout(callback: any) {
        this.handleTimeout = callback;
    }
    
    public onError(callback: any) {
        this.handleError = callback;
    }
    
    public onCompleted(callback: any) {
        this.handleCompleted = callback;
    }    
}

// (function() {

//     /**
//      * Creates a `Lemming` object with the specified script. Calling {@link #run} on the resulting
//      * lemming will make it attempt to execute the script.
//      *
//      * @constructor
//      * @param {string} script The raw JavaScript source code to (attempt to) execute.
//      */
//     function Lemming(script: any) {
//       this.script = script;
//     }
  
//     /**
//      * Default options for {@link Lemming} objects.
//      */
//     Lemming.options = {
//       fileName: 'scripts/lemming.js',
  
//       timeout: 3000,
  
//       scripts: [],
  
//       enableXHR: false
//     };
  
//     /**
//      * Runs the {@link Lemming}'s associated JavaScript code. Execution will be terminated if the
//      * `timeout` option is exceeded.
//      *
//      * @param {Object=} options
//      */
//     Lemming.prototype.run = function(options: any) {
//       options = objectWithDefaults(options, Lemming.options);
  
//       var lemming = this,
//           worker  = new Worker(options.fileName),
//           handle  = setTimeout(function() {
  
//             worker.terminate();
//             lemming.handleTimeout();
//             lemming.handleCompleted();
  
//           }, options.timeout);
  
//       worker.addEventListener('message', function(e) {
//         clearTimeout(handle);
//         lemming.handleResult(e.data);
//         lemming.handleCompleted();
//       });
  
//       worker.addEventListener('error', function(e) {
//         clearTimeout(handle);
//         lemming.handleError(e.message || e);
//         lemming.handleCompleted();
//       });
  
//       var message = JSON.stringify({
//         source: this.script,
//         scripts: options.scripts,
//         enableXHR: options.enableXHR
//       });
  
//       worker.postMessage(message);
//     };
  
//     Lemming.prototype.onResult = function(callback: any) {
//       this.handleResult = callback;
//     };
  
//     Lemming.prototype.onTimeout = function(callback: any) {
//       this.handleTimeout = callback;
//     };
  
//     Lemming.prototype.onError = function(callback: any) {
//       this.handleError = callback;
//     };
  
//     Lemming.prototype.onCompleted = function(callback: any) {
//       this.handleCompleted = callback;
//     };
  
//     Lemming.prototype.handleResult =
//     Lemming.prototype.handleTimeout =
//     Lemming.prototype.handleError =
//     Lemming.prototype.handleCompleted = function() {};
  
//     /**
//      * Creates an object with all of the specified properties, falling back to the specified defaults.
//      *
//      * @private
//      */
//     function objectWithDefaults(properties: any, defaults: any) {
//       var object: any = {};
//       for (var p in properties) {
//         object[p] = properties[p];
//       }
//       for (var d in defaults) {
//         if (!object[d]) {
//           object[d] = defaults[d];
//         }
//       }
//       return object;
//     }
  
//     if (typeof WorkerGlobalScope !== 'undefined' && this instanceof WorkerGlobalScope) {
//       this.onmessage = function onmessage(e: any) {
//         var data = JSON.parse(e.data);
  
//         importScripts.apply(this, data.scripts);
  
//         if (!data.enableXHR) {
//           delete this.XMLHttpRequest;
//         }
  
//         var result = eval(data.source);
  
//         this.postMessage(result);
//       };
//     }
  
//     this.Lemming = Lemming;
  
//   }).call(this);