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
        this.state = DemoNet;
    }

    getPlaceElements = () => {
        return this.state.places.map((placeProps) => {
            return (
            <Place 
                title={placeProps.title} 
                x={placeProps.x} 
                y={placeProps.y}
                key={placeProps.title + '@' + placeProps.x + ',' + placeProps.y}/>
            );
        });
    }

    getTransitionElements = () => {
        return this.state.transitions.map((transProps) => {
            return (
                <Transition
                    title={transProps.title}
                    x={transProps.x}
                    y={transProps.y}
                    key={transProps.title + '@' + transProps.x + ',' + transProps.y} />
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
