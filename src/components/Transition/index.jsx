import React, { Component } from 'react';
import './index.css';

class Transition extends Component {
    transitionStyle = () => {
        return {
            top: this.props.top + 'px',
            left: this.props.left + 'px'
        }
    }

    render() {
        return (
            <g>
                <rect x={this.props.x} y={this.props.y} width="12" height="50"></rect>
                <text x={this.props.x + 55} y={this.props.y} text-anchor="middle">
                    {this.props.title}
                </text>
            </g>
        )
    }
}

export default Transition;