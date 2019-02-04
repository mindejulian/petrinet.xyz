import React, { Component } from 'react';
import './index.css';

export interface ILineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

class Line extends Component<ILineProps, {}> {
    render() {
        return (
            <g>
                <line 
                    x1={this.props.x1} 
                    y1={this.props.y1} 
                    x2={this.props.x2} 
                    y2={this.props.y2} 
                    stroke="black">
                </line>
            </g>
        );
    }
}

export default Line;