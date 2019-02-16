import React, { Component } from 'react';
import './index.css';
import { Toolbar, IToolbarProps } from '../Toolbar';
import { Place, IPlaceProps } from '../Place';
import { Transition, ITransitionProps } from '../Transition';
import Line from '../Line';
import DemoNet from '../../nettemplates/demo.json';
import uuid from 'uuid';
import {
    IPetriNetViewState,
    ToolMode,
    IModel,
    ViewSize
} from '../../interfaces'
import { connect } from 'react-redux';
import { loadModel, addPlace, addToken, refresh } from './actions';


interface IPetriNetViewProps {
    model: IModel;
    toolMode: ToolMode;
    selectedForConnection: string | undefined;
    viewSize: ViewSize;
    loadModel: (model: IModel) => void;

}

class PetriNetView extends React.Component<IPetriNetViewProps, IPetriNetViewState> {


    updatePosition = (guid: string, x: number, y: number) => {
        if (this.props.toolMode !== ToolMode.Move) { return }
        const places = this.props.model.places;
        places.map((place: IPlaceProps) => {
            if (place.guid === guid) {
                place.x = x;
                place.y = y;
            }
            return place;
        });
        const transitions = this.props.model.transitions;
        transitions.map((transition: ITransitionProps) => {
            if (transition.guid === guid) {
                transition.x = x;
                transition.y = y;
            }
            return transition;
        })
        const viewSize = this.props.viewSize;
        if (x > viewSize.width - 100) {
            viewSize.width = x + 100
        }
        if (y > viewSize.height - 100) {
            viewSize.height = y + 100
        }

        this.setState({
            model: {
                places: places,
                transitions: transitions
            },
            viewSize: viewSize
        });
    }

    setSelected = (guid: string) => {
        const places = this.props.model.places;
        places.map((place: IPlaceProps) => {
            if (place.guid === guid) {
                place.selected = true;
            } else {
                place.selected = false;
            }
        });
        const transitions = this.props.model.transitions;
        transitions.map((transition: ITransitionProps) => {
            if (transition.guid === guid) {
                transition.selected = true;
            } else {
                transition.selected = false;
            }
        });
        this.setState({
            model: {
                places: places,
                transitions: transitions
            }
        });

        if (this.props.toolMode === ToolMode.AddConnection) {
            if (this.props.selectedForConnection !== undefined) {
                this.addConnection(this.props.selectedForConnection, guid)
            } else {
                this.setState({
                    selectedForConnection: guid
                })
            }
        }
    }

    deleteSelected = () => {
        var places = this.props.model.places;
        places = places.filter((place: IPlaceProps) => {
            return !place.selected
        })
        var transitions = this.props.model.transitions;
        transitions = transitions.filter((trans: ITransitionProps) => {
            return !trans.selected
        })

        this.setState({
            model: {
                places: places,
                transitions: transitions
            }
        })
    }

    addConnection = (from: string, to: string) => {
        const places = this.props.model.places
        const transitions = this.props.model.transitions

        transitions.map((trans: ITransitionProps) => {
            if (trans.guid === from && places.find((p) => p.guid === to) !== undefined) {
                trans.to.push(to)
            }
            else if (trans.guid === to && places.find((p) => p.guid === from) !== undefined) {
                trans.from.push(from)
            }
        })
        this.setState({
            model: {
                places: places,
                transitions: transitions
            },
            selectedForConnection: undefined
        })

        this.setModeMove(undefined)
    }

    setTitle = (guid: string, title: string) => {
        const places = this.props.model.places;
        places.map((place: IPlaceProps) => {
            if (place.guid === guid) {
                place.title = title;
            }
        });
        const transitions = this.props.model.transitions;
        transitions.map((transition: ITransitionProps) => {
            if (transition.guid === guid) {
                transition.title = title;
            }
        });
        this.setState({
            model: {
                places: places,
                transitions: transitions
            }
        });
    }

    executeTransition = (guid: string) => {
        if (this.props.toolMode !== ToolMode.Run) { return }
        const transitions = this.props.model.transitions;
        const transToExecute = transitions.find((trans: ITransitionProps) => trans.guid === guid)
        const places = this.props.model.places;
        if (transToExecute !== undefined &&
            this.canExecute(transToExecute)) {

            transToExecute.from.map((placeGuid: string) => {
                places.map((place: IPlaceProps) => {
                    if (place.guid === placeGuid && place.tokens > 0) {
                        place.tokens -= 1
                    }
                })
            })
            transToExecute.to.map((placeGuid: string) => {
                places.map((place: IPlaceProps) => {
                    if (place.guid === placeGuid) {
                        place.tokens += 1
                    }
                })
            })
            this.setState({
                model: {
                    places: places,
                    transitions: this.props.model.transitions
                }
            })
        }
    }

    canExecute = (trans: ITransitionProps) => {
        var result: boolean = true
        trans.from.forEach((placeId) => {
            const place = this.props.model.places.find((place: IPlaceProps) => place.guid === placeId)
            if (place !== undefined && place.tokens < 1) {
                result = false
            }
        })
        return result
    }

    // Toolbar callbacks

    setModeMove = (e: any) => {
        this.setState({
            toolMode: ToolMode.Move
        })
    }

    setModeTransition = (e: any) => {
        this.setState({
            toolMode: ToolMode.Transition
        })
    }

    setModePlace = (e: any) => {
        this.setState({
            toolMode: ToolMode.Place
        })
    }

    setModeConnection = (e: any) => {
        this.setState({
            toolMode: ToolMode.AddConnection
        })
    }

    setModeRun = (e: any) => {
        this.setState({
            toolMode: ToolMode.Run
        })
    }

    exportModelAsJSON = (e: any) => {
        let filename = "export.json";
        let contentType = "application/json;charset=utf-8;";
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(this.props.model)))], { type: contentType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            var a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(this.props.model));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    handleMouseDown = (e: any) => {
        switch (this.props.toolMode) {
            case ToolMode.Transition: {
                const guid = uuid.v4();
                let transition: ITransitionProps = {
                    guid: guid,
                    title: "New transition",
                    x: e.pageX - 6,
                    y: e.pageY - 20,
                    updatePosition: this.updatePosition,
                    selected: false,
                    setSelected: this.setSelected,
                    from: [],
                    to: [],
                    setTitle: this.setTitle,
                    executeTransition: this.executeTransition,
                    toolMode: this.props.toolMode
                }
                var transitions = this.props.model.transitions
                transitions.push(transition);
                this.setSelected(guid);
                this.setState({
                    model: {
                        places: this.props.model.places,
                        transitions: transitions
                    }
                });
                this.setModeMove("")
                break
            }
            case ToolMode.Place: {
                const guid = uuid.v4()
                let place: IPlaceProps = {
                    guid: guid,
                    title: "New place",
                    x: e.pageX,
                    y: e.pageY,
                    tokens: 0,
                    updatePosition: this.updatePosition,
                    selected: false,
                    setSelected: this.setSelected,
                    setTitle: this.setTitle,
                    imageUrl: undefined,
                    toolMode: this.props.toolMode
                }
                var places = this.props.model.places
                places.push(place)
                this.setSelected(guid)
                this.setState({
                    model: {
                        places: places,
                        transitions: this.props.model.transitions
                    }
                })
                this.setModeMove("")
                break
            }
            default: {
                return
            }
        }
    }

    handleBkgClick = () => {
        this.setSelected("none")
    }

    handleKeyPress = (e: any) => {
        console.log(e.key)
        if (e.key === 'Backspace' || e.key === 'Delete') {
            this.deleteSelected()
        }
    }

    componentDidMount = () => {
        document.addEventListener("keydown", this.handleKeyPress, false);
        this.props.loadModel(DemoNet as IModel);
    }

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }

    getPlaceElements = () => {
        return this.props.model.places.map((placeProps) => {
            return (
                <Place
                    guid={placeProps.guid}
                    title={placeProps.title}
                    x={placeProps.x}
                    y={placeProps.y}
                    tokens={placeProps.tokens}
                    updatePosition={placeProps.updatePosition}
                    selected={placeProps.selected}
                    setSelected={placeProps.setSelected}
                    setTitle={placeProps.setTitle}
                    key={placeProps.guid}
                    imageUrl={placeProps.imageUrl}
                    toolMode={this.props.toolMode} />
            );
        });
    }

    getTransitionElements = () => {
        return this.props.model.transitions.map((transProps) => {
            return (
                <Transition
                    guid={transProps.guid}
                    title={transProps.title}
                    x={transProps.x}
                    y={transProps.y}
                    updatePosition={transProps.updatePosition}
                    from={transProps.from}
                    to={transProps.to}
                    selected={transProps.selected}
                    setSelected={transProps.setSelected}
                    setTitle={transProps.setTitle}
                    executeTransition={transProps.executeTransition}
                    key={transProps.guid}
                    toolMode={this.props.toolMode} />
            );
        })
    }

    getLineElements = () => {
        return this.props.model.transitions.flatMap((transProps) => {
            const fromLines = transProps.from.map((placeId) => this.createLines(transProps, placeId, true));
            const toLines = transProps.to.map((placeId) => this.createLines(transProps, placeId, false));
            return fromLines.concat(toLines);
        })
    }

    getSVGDefs = () => {
        return (
            <defs>
                <marker
                    id='placeHead'
                    orient='auto'
                    markerWidth='20'
                    markerHeight='40'
                    refX='17.5'
                    refY='4'>
                    <path d='M0,0 V8 L4,4 Z' fill='#555' />
                </marker>
                <marker
                    id='transitionHead'
                    orient='auto'
                    markerWidth='20'
                    markerHeight='40'
                    refX='12'
                    refY='4'>
                    <path d='M0,0 V8 L4,4 Z' fill='#555' />
                </marker>
                <filter x="0" y="0" width="1" height="1" id="textBkg">
                    <feFlood floodColor="rgba(238,238,238, 0.58)" />
                    <feComposite in="SourceGraphic" />
                </filter>
            </defs>)
    }

    createLines = (transProps: ITransitionProps, placeId: string, toTransition: boolean) => {
        const place = this.props.model.places.find((p) => p.guid === placeId)
        if (place !== undefined) {
            if (toTransition) {
                return (
                    <Line
                        x1={place.x}
                        y1={place.y}
                        x2={transProps.x}
                        y2={transProps.y + 25}
                        key={transProps.guid + '-' + place.guid}
                        toTransition={toTransition} />
                )
            }
            return (
                <Line
                    x1={transProps.x}
                    y1={transProps.y + 25}
                    x2={place.x}
                    y2={place.y}
                    key={transProps.guid + '-' + place.guid}
                    toTransition={toTransition} />
            )
        }
    }


    render() {
        return (
            <div
                className="petri-net-view"
                onMouseDown={this.handleBkgClick}
                onKeyPress={this.handleKeyPress}>
                <Toolbar
                    currentMode={this.props.toolMode}
                    setModeMove={this.setModeMove}
                    setModeTransition={this.setModeTransition}
                    setModePlace={this.setModePlace}
                    setModeAddConnection={this.setModeConnection}
                    exportModelAsJSON={this.exportModelAsJSON}
                    setModeRun={this.setModeRun} />

                <span>{this.props.toolMode.toString()}</span>

                <svg
                    width={this.props.viewSize.width}
                    height={this.props.viewSize.height}
                    viewBox={"0 0 " + this.props.viewSize.width + " " + this.props.viewSize.height}
                    className="petrinet"
                    onMouseDown={this.handleMouseDown} >
                    {this.getSVGDefs()}
                    {this.getLineElements()}
                    {this.getPlaceElements()}
                    {this.getTransitionElements()}
                </svg>
            </div>
        );
    }
}

export default connect(
    (state: IPetriNetViewState) => ({
        model: state.model,
        toolMode: state.toolMode,
        selectedForConnection: undefined,
        viewSize: state.viewSize
    }), dispatch => ({
        loadModel: (model: IModel) => dispatch(loadModel(model))
    })
)(PetriNetView)


