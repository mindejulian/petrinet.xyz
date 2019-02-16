import {
    TypeKeys,
    ActionTypes
} from '../actions'
import { IPetriNetViewState, ToolMode } from '../../../interfaces';
import { enableBatching } from 'redux-batched-actions';
import { Place } from '../../Place';

export function appReducer(
    state: IPetriNetViewState = {
        model: {
            places: [],
            transitions: []
        },
        toolMode: ToolMode.Move,
        selectedForConnection: undefined,
        viewSize: { width: 1000, height: 1000 }
    },
    action: ActionTypes): IPetriNetViewState {

    switch (action.type) {
        case TypeKeys.ADD_TOKEN:
            return {
                ...state,
                model: {
                    places: state.model.places.map((place) => {
                        if (place.guid === action.guid) {
                            place.tokens += action.amount
                        }
                        return place
                    }),
                    transitions: state.model.transitions
                }
            }
        case TypeKeys.ADD_PLACE:
            return {
                ...state,
                model: {
                    places: state.model.places,
                    transitions: state.model.transitions
                }
            }
        case TypeKeys.REFRESH:
            return state

        case TypeKeys.LOAD_MODEL:
            return {
                ...state,
                model: action.model
            }

        default:
            return state
    }
}