declare module "worker-loader!*" {
    class WebpackWorker extends Worker {
        constructor();
    }

    export default WebpackWorker;
}

declare const Tesseract: any;
declare const hljs: any;