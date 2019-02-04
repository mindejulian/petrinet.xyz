import React, { Component } from 'react';
import './index.css';

class Place extends Component {
    placepositionStyle = () => {
        return {
            top: this.props.top + 'px',
            left: this.props.left + 'px'
        }
    }

    render() {
        return (
            
            <g>
                <circle r="50" cx={this.props.x} cy={this.props.y} class="circle-back" />
                <text x={this.props.x} y={this.props.y} text-anchor="middle" dy="0.3em">
                    {this.props.title}
                </text>
            </g>
        )
    }
}

export default Place;