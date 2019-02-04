import React, { Component } from 'react';
import './index.css';

class Line extends Component {
    lineStyle = () => {
        return {
            top: this.props.top + 'px',
            left: this.props.left + 'px'
        }
    }

    render() {
        return (
            
            <line x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2} stroke="black"></line>
            
        )
    }
}

export default Line;