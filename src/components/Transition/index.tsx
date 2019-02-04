import React, { Component } from 'react';
import './index.css';

export interface ITransitionProps {
    guid: string;
    title: string;
    x: number;
    y: number;
}

export class Transition extends Component<ITransitionProps, {}> {
    render() {
        return (
            <g>
                <rect 
                    x={this.props.x} 
                    y={this.props.y} 
                    width="12" 
                    height="50">
                </rect>

                <text 
                    x={this.props.x} 
                    y={this.props.y + 75} 
                    textAnchor="middle">
                    {this.props.title}
                </text>
            </g>
        )
    }
}
