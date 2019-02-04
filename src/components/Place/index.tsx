import React, { Component } from 'react';
import './index.css';

export interface IPlaceProps {
    title: string;
    x: number;
    y: number;
}

export class Place extends Component<IPlaceProps, {}> {
    render() {
        return (
            <g>
                <circle r="50" 
                        cx={this.props.x} 
                        cy={this.props.y} 
                        className="circle-back" />

                <text x={this.props.x} 
                    y={this.props.y} 
                    textAnchor="middle" 
                    dy="0.3em">
                    {this.props.title}
                </text>
            </g>
        )
    }
}