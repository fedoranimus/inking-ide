import { autoinject, PLATFORM } from "aurelia-framework";
import { Store } from 'aurelia-store';
import { State } from "../../state";
import { updateContext } from "../../actions";
import { EventAggregator } from "aurelia-event-aggregator";

interface Position {
    x: number;
    y: number;
}

@autoinject
export class IdeCanvas {
    private ide: HTMLCanvasElement;
    private resizeEventHandler = () => this.resizeCanvas();

    private currentPosition: Position =  {
        x: null,
        y: null
    };

    constructor(private element: Element, private store: Store<State>, private ea: EventAggregator) {
        
    }

    attached() {
        this.resizeCanvas();
        this.ea.subscribe('writeSample', () => this.writeSampleText(this.ide.getContext("2d")));
        this.ea.subscribe('writeBubbleSort', () => this.writeBubbleSort(this.ide.getContext("2d")));
        this.ea.subscribe('clear', () => this.clearCanvas());

        PLATFORM.global.addEventListener("resize", this.resizeEventHandler, false);
    }

    detached() {
        PLATFORM.global.removeEventListener("resize", this.resizeEventHandler);
    }

    updateState() {
        this.store.dispatch(updateContext, this.ide.getContext('2d'));
    }

    private clearCanvas() {
        this.ide.getContext("2d").clearRect(0, 0, this.ide.width, this.ide.height);
        this.updateState();
    }

    private writeSampleText(ctx: CanvasRenderingContext2D) {
        ctx.font = '50px serif';
        ctx.fillText('var f = function\( x, y \) \{', 10, 50);
        ctx.fillText('\t return x + y;', 10, 100);
        ctx.fillText('\}', 10, 150);
        ctx.fillText('f\( 3, 4 \);', 10, 200);
        this.updateState();
    }

    private writeBubbleSort(ctx: CanvasRenderingContext2D) {
        ctx.font = '25px serif';
        ctx.fillText('function bubbleSort\(array\) \{', 10, 25);
        ctx.fillText('\tvar countOuter = 0;', 10, 50);
        ctx.fillText('\tvar countInner = 0;', 10, 75);
        ctx.fillText('\tvar countSwap = 0;', 10, 100);
        ctx.fillText('\tvar swapped;', 10, 125);
        ctx.fillText('\tdo {', 10, 150);
        ctx.fillText('\t\tcountOuter++;', 10, 175);
        ctx.fillText('\t\tswapped = false;', 10, 200);
        ctx.fillText('\t\tfor\(var i = 0; i < array.length; i++\) \{', 10, 225);
        ctx.fillText('\t\t\tcountInner++;', 10, 250);
        ctx.fillText('\t\t\tif\(array[i] && array[i + 1] && array[i] > array[i + 1]\) \{', 10, 275);
        ctx.fillText('\t\t\t\tcountSwap++;', 10, 300);
        ctx.fillText('\t\t\t\tswap\(array, i, i + 1\);', 10, 325);
        ctx.fillText('\t\t\t\tswapped = true;', 10, 350);
        ctx.fillText('\t\t\t\}', 10, 375);
        ctx.fillText('\t\t\}', 10, 400);
        ctx.fillText('\t\} while\(swapped\);', 10, 425);
        ctx.fillText('\tconsole.log\(\'outer:\', countOuter, \'inner:\', countInner, \'swap:\', countSwap\);', 10, 450);
        ctx.fillText('\treturn array;', 10, 475);
        ctx.fillText('\}', 10, 500);
        ctx.fillText('bubbleSort\(arrayRandom.slice\(\)\); // => outer: 9 inner: 90 swap: 21', 10, 525);
        ctx.fillText('bubbleSort\(arrayOrdered.slice\(\)\); // => outer: 1 inner: 10 swap: 0', 10, 550);
        ctx.fillText('bubbleSort\(arrayReversed.slice\(\)\); // => outer: 10 inner: 100 swap: 45', 10, 575);
        this.updateState();
    }

    drawMouse(event: MouseEvent) {
        if(event.buttons !== 1) return;
        this.draw(event);
    }

    drawTouch(event: TouchEvent) {
        event.preventDefault();
        if(event.touches.length <= 0) return;
        const firstTouch = event.touches[0];
        if(firstTouch.touchType === "stylus") {
            this.draw(firstTouch);
        }
    }

    draw(event: MouseEvent | Touch) {
        const ctx = this.ide.getContext("2d");
        ctx.beginPath(); // begin

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
      
        ctx.moveTo(this.currentPosition.x, this.currentPosition.y); // from
        this.setPosition(event);
        ctx.lineTo(this.currentPosition.x, this.currentPosition.y); // to
      
        ctx.stroke(); // draw it!
    }

    setPosition(event: MouseEvent | TouchEvent | Touch) {
        if(event instanceof MouseEvent || event instanceof Touch) {
            this.currentPosition.x = event.clientX;
            this.currentPosition.y = event.clientY - 50; // TODO: Get better way to account for header
        } else if(event instanceof TouchEvent) {
            const firstTouch = event.touches[0];
            if(firstTouch.touchType === "stylus") {
                this.currentPosition.x = firstTouch.clientX;
                this.currentPosition.y = firstTouch.clientY - 50; // TODO: Get better way to account for header
            }
        }
    }

    private resizeCanvas() {
        const tempImage = new Image();
        const dataUrl = this.ide.toDataURL();
        this.ide.width = this.ide.offsetWidth;
        this.ide.height = this.ide.offsetHeight;

        this.ide.getContext('2d').drawImage(tempImage, 0, 0);
        tempImage.src = dataUrl;

        // TODO: Redraw content, but don't update state
    }
}