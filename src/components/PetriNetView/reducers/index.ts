import { combineReducers } from 'redux'
import { IModel } from '../../PetriNetView'
import {
    TypeKeys,
    ActionTypes
} from '../actions'

export function appReducer(
    state: IModel = {
        places: [],
        transitions: []
    },
    action: ActionTypes) {

    switch (action.type) {
        case TypeKeys.ADD_TOKEN:
            return {
                places: state.places.map((place) => {
                    if (place.guid === action.guid) {
                        place.tokens += action.amount
                    }
                    return place
                }),
                transitions: state.transitions
            }
        case TypeKeys.ADD_PLACE:
            return {
                places: state.places,
                transitions: state.transitions
            }

        default: return state
    }
}