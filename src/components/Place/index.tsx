import React, { Component } from 'react';
import './index.css';

export interface IPlaceProps {
    guid: string;
    title: string;
    x: number;
    y: number;
    updatePosition: (guid: string, x: number, y: number) => void;
    selected: boolean;
    setSelected: (guid: string) => void;
    setTitle: (guid: string, title: string) => void;
}

interface IPlaceState {
    xMouse: number;
    yMouse: number;
    xBias: number;
    yBias: number;
}

export class Place extends Component<IPlaceProps, IPlaceState> {

    constructor(props: IPlaceProps) {
        super(props);
        this.state = {
            xMouse: 0,
            yMouse: 0,
            xBias: 0,
            yBias: 0
        }
    }

    handleDragStart = (e: any) => {
        e.stopPropagation()
        this.props.setSelected(this.props.guid)
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

    handleDoubleClick = () => {
        var newTitle = prompt('New title?', this.props.title)
        if (newTitle !== null) {
            this.props.setTitle(this.props.guid, newTitle as string)
        }
    }

    render() {
        return (
            <g>
                <circle 
                    r="50" 
                    cx={this.props.x} 
                    cy={this.props.y} 
                    className={ this.props.selected ? "place-circle selected" : "place-circle" } 
                    onMouseDown={this.handleDragStart} 
                    onDoubleClick={this.handleDoubleClick} />

                <text 
                    x={this.props.x} 
                    y={this.props.y} 
                    textAnchor="middle" 
                    dy="0.3em" 
                    className="place-text"
                    onMouseDown={this.handleDragStart} 
                    onDoubleClick={this.handleDoubleClick} >
                        {this.props.title} 
                </text>
            </g>
        )
    }
}