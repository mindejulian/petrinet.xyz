import { IPlaceProps } from './components/Place'
import { ITransitionProps } from './components/Transition'

export enum ToolMode {
    Move,
    Transition,
    Place,
    AddConnection,
    Run
}

export interface ViewSize {
    width: number;
    height: number;
}

export interface IModel {
    title: string;
    places: IPlaceProps[];
    transitions: ITransitionProps[];
}

export interface IPetriNetViewState {
    model: IModel;
    toolMode: ToolMode;
    selectedForConnection: string | undefined;
    viewSize: ViewSize;
    mouseX: number;
    mouseY: number;
}

export interface RootState {
    petriView: IPetriNetViewState;
}