import React, { Component } from 'react';
import './index.css';
import { Place, IPlaceProps } from '../Place';
import { Transition, ITransitionProps } from '../Transition';
import Line from '../Line';
import DemoNet from '../../nettemplates/test.js';

interface IPetriNetViewProps {

}

interface IPetriNetViewState {
    places: IPlaceProps[];
    transitions: ITransitionProps[];
}


class PetriNetView extends React.Component<IPetriNetViewProps, IPetriNetViewState> {
    
    constructor(props: IPetriNetViewProps) {
        super(props);
        var demoNet = DemoNet;
        let places = demoNet.places.map((place: any) => {
            place.updatePosition = this.updatePosition;
            return place;
        });
        let transitions = demoNet.transitions.map((transition: any) => {
            return transition;
        })
        this.state = {
            places: places,
            transitions: transitions
        }
    }

    updatePosition = (guid: string, x: number, y: number) => {
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

    getPlaceElements = () => {
        return this.state.places.map((placeProps) => {
            return (
            <Place 
                guid={placeProps.guid}
                title={placeProps.title} 
                x={placeProps.x} 
                y={placeProps.y}
                updatePosition={this.updatePosition}
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
                    updatePosition={this.updatePosition}
                    key={transProps.guid} />
            );
        })
    }

    render() {
        return (
        <div className="petri-net-view">
            <svg width="1000" height="1000" viewBox="0 0 1000 1000">
                { this.getPlaceElements() }
                { this.getTransitionElements() }
            </svg>
        </div>
        );
    }
}

export default PetriNetView;
