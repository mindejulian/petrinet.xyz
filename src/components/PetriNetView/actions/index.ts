import { IPlaceProps } from "../../Place";
import { IModel } from "../../../interfaces"

export enum TypeKeys {
    ADD_TOKEN = 'ADD_TOKEN',
    ADD_PLACE = 'ADD_PLACE',
    REFRESH = 'REFRESH',
    LOAD_MODEL = 'LOAD_MODEL'
}

export type ActionTypes = AddToken | AddPlace | Refresh | LoadModel;

export interface AddToken {
    type: TypeKeys.ADD_TOKEN
    guid: string;
    amount: number
}

export interface AddPlace {
    type: TypeKeys.ADD_PLACE,
    place: IPlaceProps
}

export interface Refresh {
    type: TypeKeys.REFRESH
}

export interface LoadModel {
    type: TypeKeys.LOAD_MODEL,
    model: IModel
}

export function addToken(guid: string, amount: number): AddToken {
    return {
        type: TypeKeys.ADD_TOKEN,
        guid: guid,
        amount: amount
    }
}

export function addPlace(place: IPlaceProps): AddPlace {
    return {
        type: TypeKeys.ADD_PLACE,
        place: place
    }
}

export function refresh(): Refresh {
    return {
        type: TypeKeys.REFRESH
    }
}

export function loadModel(model: IModel): LoadModel {
    return {
        type: TypeKeys.LOAD_MODEL,
        model: model
    }
}