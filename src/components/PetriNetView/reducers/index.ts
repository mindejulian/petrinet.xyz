import {
    TypeKeys,
    ActionTypes,
    setSelectedForConnection
} from '../actions'
import { IPetriNetViewState, ToolMode } from '../../../interfaces';
import { enableBatching } from 'redux-batched-actions';
import { IPlaceProps } from '../../Place'
import { ITransitionProps, InOutFunc } from '../../Transition'

export function appReducer(
    state: IPetriNetViewState = {
        model: {
            title: 'noname',
            places: [],
            transitions: []
        },
        toolMode: ToolMode.Move,
        selectedForConnection: undefined,
        viewSize: { width: 1000, height: 1000 },
        mouseX: 0,
        mouseY: 0
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
                    ...state.model,
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
                    ...state.model,
                    places: places,
                    transitions: transitions
                },
                viewSize: viewSize
            }

        case TypeKeys.DELETE_SELECTED:
            return {
                ...state,
                model: {
                    ...state.model,
                    places: state.model.places.filter((place: IPlaceProps) => {
                        return !place.selected
                    }),
                    transitions: state.model.transitions.filter((trans: ITransitionProps) => {
                        return !trans.selected
                    })
                }
            }

        case TypeKeys.ADD_CONNECTION:
            return {
                ...state,
                model: {
                    ...state.model,
                    transitions: state.model.transitions.map((trans: ITransitionProps) => {
                        if (trans.guid === action.from && state.model.places.find((p) => p.guid === action.to) !== undefined) {
                            let ioFunc = trans.outputs.find(f => f.guid === action.to);
                            if (ioFunc) {
                                trans.outputs = trans.outputs.map(ioFunc => {
                                    if (ioFunc.guid === action.to) {
                                        ioFunc.count++;
                                    }
                                    return ioFunc;
                                })
                            } else {
                                trans.outputs.push({ guid: action.to, count: 1 })
                            }
                        }
                        else if (trans.guid === action.to && state.model.places.find((p) => p.guid === action.from) !== undefined) {
                            let ioFunc = trans.inputs.find(f => f.guid === action.from);
                            if (ioFunc) {
                                trans.inputs = trans.inputs.map(ioFunc => {
                                    if (ioFunc.guid === action.from) {
                                        ioFunc.count++;
                                    }
                                    return ioFunc;
                                })
                            } else {
                                trans.inputs.push({ guid: action.from, count: 1 })
                            }
                        }
                        return trans
                    })
                },
                selectedForConnection: undefined,
                toolMode: ToolMode.Move
            }

        case TypeKeys.SET_TITLE:
            return {
                ...state,
                model: {
                    ...state.model,
                    places: state.model.places.map((place: IPlaceProps) => {
                        if (place.guid === action.guid) {
                            place.title = action.title;
                        }
                        return place
                    }),
                    transitions: state.model.transitions.map((transition: ITransitionProps) => {
                        if (transition.guid === action.guid) {
                            transition.title = action.title;
                        }
                        return transition
                    })
                }
            }

        case TypeKeys.SET_SELECTED_FOR_CONNECTION:
            return {
                ...state,
                selectedForConnection: action.guid
            }

        case TypeKeys.EXECUTE_TRANSITION:
            if (state.toolMode !== ToolMode.Run) { return state }
            const transitions2 = state.model.transitions;
            const transToExecute = transitions2.find((trans: ITransitionProps) => trans.guid === action.guid)
            const places2 = state.model.places
            if (transToExecute === undefined) {
                return state
            }
            var canExecute: boolean = true
            transToExecute.inputs.forEach((ioFunc: InOutFunc) => {
                const place = state.model.places.find((place: IPlaceProps) => place.guid === ioFunc.guid)
                if (place !== undefined && place.tokens < ioFunc.count) {
                    canExecute = false
                }
            })
            if (transToExecute !== undefined && canExecute) {
                transToExecute.inputs.map((ioFunc: InOutFunc) => {
                    places2.map((place: IPlaceProps) => {
                        if (place.guid === ioFunc.guid && place.tokens > 0) {
                            place.tokens -= ioFunc.count
                        }
                    })
                })
                transToExecute.outputs.map((ioFunc: InOutFunc) => {
                    places2.map((place: IPlaceProps) => {
                        if (place.guid === ioFunc.guid) {
                            place.tokens += ioFunc.count
                        }
                    })
                })
                return {
                    ...state,
                    model: {
                        ...state.model,
                        places: places2,
                        transitions: state.model.transitions
                    }
                }
            }
            return state

        case TypeKeys.SET_MODE:
            return {
                ...state,
                toolMode: action.mode
            }

        case TypeKeys.ADD_PLACE:
            return {
                ...state,
                model: {
                    ...state.model,
                    places: [...state.model.places, action.place],
                    transitions: state.model.transitions
                }
            }

        case TypeKeys.ADD_TRANSITION:
            return {
                ...state,
                model: {
                    ...state.model,
                    places: state.model.places,
                    transitions: [...state.model.transitions, action.transition]
                }
            }

        case TypeKeys.SET_MOUSE_POS:
            return {
                ...state,
                mouseX: action.x,
                mouseY: action.y
            }

        default:
            return state
    }
}