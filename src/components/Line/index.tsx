import React, { Component } from 'react';
import './index.css';

export interface ILineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    toTransition: boolean;
}

class Line extends Component<ILineProps, {}> {

    markerUrl = () => {
        if (this.props.toTransition) {
            return 'url(#transitionHead)'
        }
        return 'url(#placeHead)'
    }

    render() {
        return (

            <path
                markerEnd={this.markerUrl()}
                strokeWidth="3"
                fill="none"
                stroke="black"
                d={'M' + this.props.x1 + ',' + this.props.y1 + ' ' + this.props.x2 + ',' + this.props.y2}>
            </path>

        );
    }
}

export default Line;