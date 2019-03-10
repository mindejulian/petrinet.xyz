import React, { Component } from 'react';
import './index.css';

export interface ILineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    count: number;
    toTransition: boolean;
}

class Line extends Component<ILineProps, {}> {

    markerUrl = () => {
        if (this.props.toTransition) {
            return 'url(#transitionHead)'
        }
        return 'url(#placeHead)'
    }

    countText = () => {
        if (this.props.count > 1) {
            return (
                <text
                    filter="url(#textBkg)"
                    x={Math.min(this.props.x1, this.props.x2) + Math.max(this.props.x1 - this.props.x2, this.props.x2 - this.props.x1) / 2 + (this.props.toTransition ? -10 : 10)}
                    y={Math.min(this.props.y1, this.props.y2) + Math.max(this.props.y1 - this.props.y2, this.props.y2 - this.props.y1) / 2 + (this.props.toTransition ? -10 : 10)}
                >
                    {this.props.count}
                </text>
            )
        }
    }

    render() {
        return (
            <g>
                <path
                    markerEnd={this.markerUrl()}
                    strokeWidth="3"
                    fill="none"
                    stroke="black"
                    d={'M' + this.props.x1 + ',' + this.props.y1 + ' ' + this.props.x2 + ',' + this.props.y2}>
                </path>
                {this.countText()}
            </g>

        );
    }
}

export default Line;