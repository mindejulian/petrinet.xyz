import React, { Component } from 'react';
import './index.css';
import { throws } from 'assert';
import { ToolMode } from '../PetriNetView';

export interface ITransitionProps {
    guid: string;
    title: string;
    x: number;
    y: number;
    updatePosition: (guid: string, x: number, y: number) => void;
    from: string[];
    to: string[];
    selected: boolean;
    setSelected: (guid: string) => void;
    setTitle: (guid: string, title: string) => void;
    executeTransition: (guid: string) => void;
    toolMode: ToolMode;
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
        e.stopPropagation()
        this.props.executeTransition(this.props.guid)
        this.props.setSelected(this.props.guid);
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
        if(this.props.toolMode.toString() !== ToolMode.Run.toString()) {
            var newTitle = prompt('New title?', this.props.title)
            if (newTitle !== null) {
                this.props.setTitle(this.props.guid, newTitle as string)
            }
        }
    }

    stateClasses = () => {
        var classes = ""
        switch (this.props.toolMode) {
            case ToolMode.Move: {
                classes += " trans-mode-move"
                break
            }
            case ToolMode.Run: {
                classes += " trans-mode-run"
            }
            case ToolMode.AddConnection: {
                classes += " trans-mode-add-connection"
            }
        }
        if (this.props.selected) {
            classes += " selected"
        }
        return classes
    }
 
    render() {
        return (
            <g>
                <rect 
                    x={this.props.x} 
                    y={this.props.y} 
                    width="12" 
                    height="50" 
                    fill={this.props.selected ? 'red' : 'black'}
                    className={ "transition-rect" + this.stateClasses() }
                    onMouseDown={this.handleDragStart} 
                    onDoubleClick={this.handleDoubleClick} >
                </rect>

                <text 
                    x={this.props.x} 
                    y={this.props.y + 75} 
                    textAnchor="middle"
                    onMouseDown={this.handleDragStart}
                    className={ "transition-text" + this.stateClasses() }
                    filter="url(#textBkg)" 
                    onDoubleClick={this.handleDoubleClick}>
                    {this.props.title}
                </text>
            </g>
        )
    }
}
