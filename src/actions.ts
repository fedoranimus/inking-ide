import { State, initialState } from "./state";

export function updateContext(state: State, canvasContext: CanvasRenderingContext2D) {
    return { ...state, ... { canvasContext } };
}

export function processMessage(state: State, message: string) {
    return { ...state, ...{ message } };
}

export function updateCode(state: State, code: string) {
    return { ...state, ...{ code } };
}

export function updateResult(state: State, result: any) {
    return { ...state, ...{ result } };
}

export function resetState(state: State) {
    return initialState;
}