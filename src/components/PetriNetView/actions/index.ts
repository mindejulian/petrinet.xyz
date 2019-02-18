import { IModel, ToolMode } from "../../../interfaces"
import { string } from "prop-types";
import { IPlaceProps } from "../../Place";
import { ITransitionProps } from "../../Transition";

export enum TypeKeys {
    LOAD_MODEL = 'LOAD_MODEL',
    SET_SELECTED = 'SET_SELECTED',
    UPDATE_POSITION = 'UPDATE_POSITION',
    DELETE_SELECTED = 'DELETE_SELECTED',
    ADD_CONNECTION = 'ADD_CONNECTION',
    SET_TITLE = 'SET_TITLE',
    SET_SELECTED_FOR_CONNECTION = 'SET_SELECTED_FOR_CONNECTION',
    EXECUTE_TRANSITION = 'EXECUTE_TRANSITION',
    SET_MODE = 'SET_MODE',
    ADD_PLACE = 'ADD_PLACE',
    ADD_TRANSITION = 'ADD_TRANSITION'
}

export type ActionTypes =
    LoadModel |
    SetSelected |
    UpdatePosition |
    DeleteSelected |
    AddConnection |
    SetTitle |
    SetSelectedForConnection |
    ExecuteTransition |
    SetMode |
    AddPlace |
    AddTransition;

export interface LoadModel {
    type: TypeKeys.LOAD_MODEL,
    model: IModel
}

export interface SetSelected {
    type: TypeKeys.SET_SELECTED,
    guid: string
}

export interface UpdatePosition {
    type: TypeKeys.UPDATE_POSITION,
    guid: string,
    x: number,
    y: number
}

export interface DeleteSelected {
    type: TypeKeys.DELETE_SELECTED
}

export interface AddConnection {
    type: TypeKeys.ADD_CONNECTION,
    from: string,
    to: string
}

export interface SetTitle {
    type: TypeKeys.SET_TITLE,
    guid: string,
    title: string
}

export interface SetSelectedForConnection {
    type: TypeKeys.SET_SELECTED_FOR_CONNECTION,
    guid: string
}

export interface ExecuteTransition {
    type: TypeKeys.EXECUTE_TRANSITION,
    guid: string
}

export interface SetMode {
    type: TypeKeys.SET_MODE,
    mode: ToolMode
}

export interface AddPlace {
    type: TypeKeys.ADD_PLACE,
    place: IPlaceProps
}

export interface AddTransition {
    type: TypeKeys.ADD_TRANSITION,
    transition: ITransitionProps
}



// functions

export function loadModel(model: IModel): LoadModel {
    return {
        type: TypeKeys.LOAD_MODEL,
        model: model
    }
}

export function setSelected(guid: string): SetSelected {
    return {
        type: TypeKeys.SET_SELECTED,
        guid: guid
    }
}

export function updatePosition(guid: string, x: number, y: number): UpdatePosition {
    return {
        type: TypeKeys.UPDATE_POSITION,
        guid: guid,
        x: x,
        y: y
    }
}

export function deleteSelected(): DeleteSelected {
    return {
        type: TypeKeys.DELETE_SELECTED
    }
}

export function addConnection(from: string, to: string): AddConnection {
    return {
        type: TypeKeys.ADD_CONNECTION,
        from: from,
        to: to
    }
}

export function setTitle(guid: string, title: string): SetTitle {
    return {
        type: TypeKeys.SET_TITLE,
        guid: guid,
        title: title
    }
}

export function setSelectedForConnection(guid: string): SetSelectedForConnection {
    return {
        type: TypeKeys.SET_SELECTED_FOR_CONNECTION,
        guid: guid
    }
}

export function executeTransition(guid: string): ExecuteTransition {
    return {
        type: TypeKeys.EXECUTE_TRANSITION,
        guid: guid
    }
}

export function setMode(mode: ToolMode): SetMode {
    return {
        type: TypeKeys.SET_MODE,
        mode: mode
    }
}

export function addPlace(place: IPlaceProps): AddPlace {
    return {
        type: TypeKeys.ADD_PLACE,
        place: place
    }
}

export function addTransition(transition: ITransitionProps): AddTransition {
    return {
        type: TypeKeys.ADD_TRANSITION,
        transition: transition
    }
}