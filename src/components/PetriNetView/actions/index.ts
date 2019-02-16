import { IPlaceProps } from "../../Place";

export enum TypeKeys {
    ADD_TOKEN = 'ADD_TOKEN',
    ADD_PLACE = 'ADD_PLACE'
}

export type ActionTypes = AddToken | AddPlace;

export interface AddToken {
    type: TypeKeys.ADD_TOKEN
    guid: string;
    amount: number
}

export interface AddPlace {
    type: TypeKeys.ADD_PLACE,
    place: IPlaceProps
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