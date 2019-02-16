import { IModel } from "../../../interfaces"

export enum TypeKeys {
    LOAD_MODEL = 'LOAD_MODEL',
    SET_SELECTED = 'SET_SELECTED',
    UPDATE_POSITION = 'UPDATE_POSITION'
}

export type ActionTypes =
    LoadModel |
    SetSelected |
    UpdatePosition;

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