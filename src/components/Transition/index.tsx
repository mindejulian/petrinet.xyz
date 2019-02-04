import React, { Component } from 'react';
import './index.css';

export interface ITransitionProps {
    guid: string;
    title: string;
    x: number;
    y: number;
    updatePosition: (guid: string, x: number, y: number) => void;
}

interface ITransitionState {
    xMouse: number,
    yMouse: number,
    xBias: number,
    yBias: number
}

export class Transition extends Component<ITransitionProps, ITransitionState> {

    constructor(props: ITransitionProps) {
        super(props);
        this.state = {
            xMouse: 0,
            yMouse: 0,
            xBias: 0,
            yBias: 0
        }
    }

    handleDragStart = (e: any) => {
        this.setState({
            xMouse: e.pageX,
            yMouse: e.pageY,
            xBias: this.props.x - e.pageX,
            yBias: this.props.y - e.pageY
        })
        document.addEventListener('mousemove', this.handleDragMove);
        document.addEventListener('mouseup', this.handleDragEnd);
    }

    handleDragMove = (e: any) => {
        const xDiff = this.state.xMouse - e.pageX;
        const yDiff = this.state.yMouse - e.pageY;
        this.props.updatePosition(this.props.guid, e.pageX + this.state.xBias, e.pageY + this.state.yBias);
        this.setState({
            xMouse: this.props.x - xDiff,
            yMouse: this.props.y - yDiff
        })
    }

    handleDragEnd = () => {
        document.removeEventListener('mousemove', this.handleDragMove);
        document.removeEventListener('mouseup', this.handleDragEnd);
    }
 
    render() {
        return (
            <g>
                <rect 
                    x={this.props.x} 
                    y={this.props.y} 
                    width="12" 
                    height="50" 
                    onMouseDown={this.handleDragStart} >
                </rect>

                <text 
                    x={this.props.x} 
                    y={this.props.y + 75} 
                    textAnchor="middle"
                    onMouseDown={this.handleDragStart} >
                    {this.props.title}
                </text>
            </g>
        )
    }
}