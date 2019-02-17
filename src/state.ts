export interface State {
    canvasContext: CanvasRenderingContext2D;
    code: string;
    message: string;
    result: any;
}

export const initialState: State = {
    canvasContext: null,
    code: "",
    message: "",
    result: null
}