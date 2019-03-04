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
import {
    loadModel,
    setSelected,
    updatePosition,
    deleteSelected,
    addConnection,
    setTitle,
    setSelectedForConnection,
    executeTransition,
    setMode,
    addPlace,
    addTransition,
    setMousePosition
} from './actions';


interface IPetriNetViewProps {
    model: IModel;
    toolMode: ToolMode;
    selectedForConnection: string | undefined;
    viewSize: ViewSize;
    mouseX: number;
    mouseY: number;
    loadModel: (model: IModel) => void;
    setSelected: (guid: string) => void;
    updatePosition: (guid: string, x: number, y: number) => void;
    deleteSelected: () => void;
    addConnection: (from: string, to: string) => void;
    setTitle: (guid: string, title: string) => void;
    setSelectedForConnection: (guid: string) => void;
    executeTransition: (guid: string) => void;
    setMode: (mode: ToolMode) => void;
    addPlace: (place: IPlaceProps) => void;
    addTransition: (transition: ITransitionProps) => void;
    setMousePosition: (x: number, y: number) => void;
}

class PetriNetView extends React.Component<IPetriNetViewProps, IPetriNetViewState> {

    updatePosition = (guid: string, x: number, y: number) => {
        this.props.updatePosition(guid, x, y)
    }

    setSelected = (guid: string) => {
        this.props.setSelected(guid)

        if (this.props.toolMode === ToolMode.AddConnection) {
            if (this.props.selectedForConnection) {
                this.props.addConnection(this.props.selectedForConnection, guid)
            } else {
                this.props.setSelectedForConnection(guid)
            }
        }
    }

    deleteSelected = () => {
        this.props.deleteSelected()
    }

    setTitle = (guid: string, title: string) => {
        this.props.setTitle(guid, title)
    }

    executeTransition = (guid: string) => {
        this.props.executeTransition(guid)
    }

    // Toolbar callbacks

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
                    x: e.clientX - 6,
                    y: e.clientY - 20 - 95,
                    updatePosition: this.updatePosition,
                    selected: false,
                    setSelected: this.setSelected,
                    inputs: [],
                    outputs: [],
                    setTitle: this.setTitle,
                    executeTransition: this.executeTransition,
                    toolMode: this.props.toolMode
                }
                this.props.addTransition(transition)
                this.setSelected(guid)
                this.props.setMode(ToolMode.Move)
                break
            }
            case ToolMode.Place: {
                const guid = uuid.v4()
                let place: IPlaceProps = {
                    guid: guid,
                    title: "New place",
                    x: e.clientX,
                    y: e.clientY - 95,
                    tokens: 0,
                    updatePosition: this.updatePosition,
                    selected: false,
                    setSelected: this.setSelected,
                    setTitle: this.setTitle,
                    imageUrl: undefined,
                    toolMode: this.props.toolMode
                }
                this.props.addPlace(place)
                this.setSelected(guid)
                this.props.setMode(ToolMode.Move)
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

    handleMouseMove = (e: any) => {
        this.props.setMousePosition(e.pageX, e.pageY)
    }

    componentDidMount = () => {
        document.addEventListener("keydown", this.handleKeyPress, false);
        document.addEventListener("mousemove", this.handleMouseMove)
        this.props.loadModel(DemoNet as IModel);
    }

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress, false);
        document.removeEventListener("mousemove", this.handleMouseMove)
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
                    updatePosition={this.updatePosition}
                    selected={placeProps.selected}
                    setSelected={this.setSelected}
                    setTitle={this.setTitle}
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
                    updatePosition={this.updatePosition}
                    inputs={transProps.inputs}
                    outputs={transProps.outputs}
                    selected={transProps.selected}
                    setSelected={this.setSelected}
                    setTitle={this.setTitle}
                    executeTransition={this.executeTransition}
                    key={transProps.guid}
                    toolMode={this.props.toolMode} />
            );
        })
    }

    getLineElements = () => {
        return this.props.model.transitions.flatMap((transProps) => {
            const fromLines = transProps.inputs.map((placeId) => this.createLines(transProps, placeId, true));
            const toLines = transProps.outputs.map((placeId) => this.createLines(transProps, placeId, false));
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

    selectedForConnectionPosition = () => {
        if (!this.props.selectedForConnection) { return { x: 0, y: 0 } }
        const selectedPlace = this.props.model.places.find(place => place.guid === this.props.selectedForConnection)
        if (selectedPlace) {
            return selectedPlace
        }
        const selectedTransition = this.props.model.transitions.find(trans => trans.guid === this.props.selectedForConnection)
        if (selectedTransition) {
            return selectedTransition
        }
        return { x: 0, y: 0 }
    }

    renderModeSpecificItems = () => {
        switch (this.props.toolMode) {
            case ToolMode.AddConnection:
                if (this.props.selectedForConnection) {
                    let toTransition = (this.selectedForConnectionPosition() as IPlaceProps).tokens !== undefined
                    return (
                        <Line
                            x1={this.selectedForConnectionPosition().x}
                            y1={this.selectedForConnectionPosition().y + (toTransition ? 0 : 25)}
                            x2={this.props.mouseX}
                            y2={this.props.mouseY}
                            toTransition={toTransition}
                        />)
                } else {
                    return null
                }
                break
            default:
                return null
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
                    setMode={this.props.setMode}
                    exportModelAsJSON={this.exportModelAsJSON} />

                <svg
                    width={this.props.viewSize.width}
                    height={this.props.viewSize.height}
                    viewBox={"0 0 " + this.props.viewSize.width + " " + this.props.viewSize.height}
                    className="petrinet"
                    onMouseDown={this.handleMouseDown} >
                    {this.getSVGDefs()}
                    {this.getLineElements()}
                    {this.renderModeSpecificItems()}
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
        selectedForConnection: state.selectedForConnection,
        viewSize: state.viewSize,
        mouseX: state.mouseX,
        mouseY: state.mouseY
    }), dispatch => ({
        loadModel: (model: IModel) => dispatch(loadModel(model)),
        setSelected: (guid: string) => dispatch(setSelected(guid)),
        updatePosition: (guid: string, x: number, y: number) => dispatch(updatePosition(guid, x, y)),
        deleteSelected: () => dispatch(deleteSelected()),
        addConnection: (from: string, to: string) => dispatch(addConnection(from, to)),
        setTitle: (guid: string, title: string) => dispatch(setTitle(guid, title)),
        setSelectedForConnection: (guid: string) => dispatch(setSelectedForConnection(guid)),
        executeTransition: (guid: string) => dispatch(executeTransition(guid)),
        setMode: (mode: ToolMode) => dispatch(setMode(mode)),
        addPlace: (place: IPlaceProps) => dispatch(addPlace(place)),
        addTransition: (transition: ITransitionProps) => dispatch(addTransition(transition)),
        setMousePosition: (x: number, y: number) => dispatch(setMousePosition(x, y))
    })
)(PetriNetView)


