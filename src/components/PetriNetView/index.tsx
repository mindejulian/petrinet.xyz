import React, { Component } from 'react';
import './index.css';
import { Toolbar, IToolbarProps } from '../Toolbar';
import { Place, IPlaceProps } from '../Place';
import { Transition, ITransitionProps } from '../Transition';
import Line from '../Line';
import DemoNet from '../../nettemplates/test.js';
import uuid from 'uuid';

interface IPetriNetViewProps {

}

enum ToolMode {
    Move,
    Transition,
    Place    
}

interface IPetriNetViewState {
    places: IPlaceProps[];
    transitions: ITransitionProps[];
    toolMode: ToolMode;
}


class PetriNetView extends React.Component<IPetriNetViewProps, IPetriNetViewState> {
    
    constructor(props: IPetriNetViewProps) {
        super(props);
        var demoNet = DemoNet;
        let places = demoNet.places.map((place: any) => {
            place.updatePosition = this.updatePosition;
            place.selected = false;
            place.setSelected = this.setSelected;
            return place;
        });
        let transitions = demoNet.transitions.map((transition: any) => {
            transition.updatePosition = this.updatePosition;
            transition.selected = false;
            transition.setSelected = this.setSelected;
            return transition;
        })
        this.state = {
            places: places,
            transitions: transitions,
            toolMode: ToolMode.Move
        }
    }

    updatePosition = (guid: string, x: number, y: number) => {
        if (this.state.toolMode !== ToolMode.Move ) { return }
        const places = this.state.places;
        places.map((place: IPlaceProps) => {
            if (place.guid === guid) {
                place.x = x;
                place.y = y;
            }
            return place;
        });
        const transitions = this.state.transitions;
        transitions.map((transition: ITransitionProps) => {
            if (transition.guid === guid) {
                transition.x = x;
                transition.y = y;
            }
            return transition;
        })

        this.setState({
            places: places,
            transitions: transitions
        });
    }

    setSelected = (guid: string) => {
        const places = this.state.places;
        places.map((place: IPlaceProps) => {
            if(place.guid === guid) {
                place.selected = true;
            } else {
                place.selected = false;
            }
        });
        const transitions = this.state.transitions;
        transitions.map((transition: ITransitionProps) => {
            if (transition.guid === guid) {
                transition.selected = true;
            } else {
                transition.selected = false;
            }
        });
        this.setState({
            places: places,
            transitions: transitions
        });
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

    exportModelAsJSON = (e: any) => {
        let filename = "export.json";
        let contentType = "application/json;charset=utf-8;";
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(this.state)))], { type: contentType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            var a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(this.state));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    handleMouseDown = (e: any) => {
        switch (this.state.toolMode) {
            case ToolMode.Transition: {
                const guid = uuid.v4(); 
                let transition: ITransitionProps = {
                    guid: guid,
                    title: "New transition",
                    x: e.pageX - 6,
                    y: e.pageY - 80,
                    updatePosition: this.updatePosition,
                    selected: false,
                    setSelected: this.setSelected,
                    from: [],
                    to: []
                }
                var transitions = this.state.transitions
                transitions.push(transition);
                this.setSelected(guid);
                this.setState({
                    transitions: transitions
                });
                break
            }
            case ToolMode.Place: {
                const guid = uuid.v4()
                let place: IPlaceProps = {
                    guid: guid,
                    title: "New place",
                    x: e.pageX,
                    y: e.pageY,
                    updatePosition: this.updatePosition,
                    selected: false,
                    setSelected: this.setSelected
                }
                var places = this.state.places
                places.push(place)
                this.setSelected(guid)
                this.setState({
                    places: places
                })
                break
            }
            default: {
                return
            }
        }
    }

    getPlaceElements = () => {
        return this.state.places.map((placeProps) => {
            return (
            <Place 
                guid={placeProps.guid}
                title={placeProps.title} 
                x={placeProps.x} 
                y={placeProps.y}
                updatePosition={placeProps.updatePosition}
                selected={placeProps.selected}
                setSelected={placeProps.setSelected}
                key={placeProps.guid}/>
            );
        });
    }

    getTransitionElements = () => {
        return this.state.transitions.map((transProps) => {
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
                    key={transProps.guid} />
            );
        })
    }

    getLineElements = () => {
        return this.state.transitions.flatMap((transProps) => {
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
                refX='20.5' 
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
                <feFlood floodColor="rgba(255,255,255, 0.58)"/>
                <feComposite in="SourceGraphic" />
            </filter>
        </defs>)
    }
 
    createLines = (transProps: ITransitionProps, placeId: string, toTransition: boolean) => {
        const place = this.state.places.find((p) => p.guid === placeId)
        if (place !== undefined) {
            if (toTransition) {
                return (
                    <Line 
                        x1={place.x} 
                        y1={place.y} 
                        x2={transProps.x + 6} 
                        y2={transProps.y + 25}
                        toTransition={toTransition} />
                )
            }
            return (
                <Line 
                    x1={transProps.x + 6} 
                    y1={transProps.y + 25} 
                    x2={place.x} 
                    y2={place.y}
                    toTransition={toTransition} />
            )
        } 
    }


    render() {
        return (
        <div className="petri-net-view">
            <Toolbar
                setModeMove={this.setModeMove}
                setModeTransition={this.setModeTransition} 
                setModePlace={this.setModePlace}
                exportModelAsJSON={this.exportModelAsJSON} />
            <svg 
                width="1000" 
                height="1000" 
                viewBox="0 0 1000 1000" 
                onMouseDown={this.handleMouseDown} >
                { this.getSVGDefs() }
                { this.getLineElements() }
                { this.getPlaceElements() }
                { this.getTransitionElements() }
            </svg>
        </div>
        );
    }
}

export default PetriNetView;
