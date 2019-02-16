import {
    TypeKeys,
    ActionTypes
} from '../actions'
import { IPetriNetViewState, ToolMode } from '../../../interfaces';
import { enableBatching } from 'redux-batched-actions';
import { IPlaceProps } from '../../Place'
import { ITransitionProps } from '../../Transition'

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
        case TypeKeys.LOAD_MODEL:
            return {
                ...state,
                model: action.model
            }

        case TypeKeys.SET_SELECTED:
            return {
                ...state,
                model: {
                    places: state.model.places.map((place) => {
                        if (place.guid === action.guid) {
                            place.selected = true
                        } else {
                            place.selected = false
                        }
                        return place
                    }),
                    transitions: state.model.transitions.map((trans) => {
                        if (trans.guid === action.guid) {
                            trans.selected = true
                        } else {
                            trans.selected = false
                        }
                        return trans
                    })
                }
            }
        case TypeKeys.UPDATE_POSITION:
            if (state.toolMode !== ToolMode.Move) { return state }
            const places = state.model.places;
            places.map((place: IPlaceProps) => {
                if (place.guid === action.guid) {
                    place.x = action.x;
                    place.y = action.y;
                }
                return place;
            });
            const transitions = state.model.transitions;
            transitions.map((transition: ITransitionProps) => {
                if (transition.guid === action.guid) {
                    transition.x = action.x;
                    transition.y = action.y;
                }
                return transition;
            })
            const viewSize = state.viewSize;
            if (action.x > viewSize.width - 100) {
                viewSize.width = action.x + 100
            }
            if (action.y > viewSize.height - 100) {
                viewSize.height = action.y + 100
            }

            return {
                ...state,
                model: {
                    places: places,
                    transitions: transitions
                },
                viewSize: viewSize
            };

        default:
            return state
    }
}