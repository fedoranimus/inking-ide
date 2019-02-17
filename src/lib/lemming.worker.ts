const ctx: Worker = self as any;

ctx.onmessage = (e: any) => {
    const data = JSON.parse(e.data);

    //(self as any).importScripts.apply(this, data.scripts);

    if (!data.enableXHR) {
        delete this.XMLHttpRequest;
    }

    const result = eval(data.source);

    ctx.postMessage(result);
}