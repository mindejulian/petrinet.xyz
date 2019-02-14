import React, { Component } from 'react';
import './index.css';
import { throws } from 'assert';
import { ToolMode } from '../PetriNetView';

export interface IPlaceProps {
    guid: string;
    title: string;
    x: number;
    y: number;
    tokens: number;
    updatePosition: (guid: string, x: number, y: number) => void;
    selected: boolean;
    setSelected: (guid: string) => void;
    setTitle: (guid: string, title: string) => void;
    imageUrl?: string;
    toolMode: ToolMode;
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
        if(this.props.toolMode.toString() !== ToolMode.Run.toString()) {
            var newTitle = prompt('New title?', this.props.title)
            if (newTitle !== null) {
                this.props.setTitle(this.props.guid, newTitle as string)
            }
        }
    }

    elementsForTokens = () => {
        if (this.props.tokens > 20) {
            return (<text
                x={this.props.x}
                y={this.props.y + 10}
                textAnchor="middle"
                className="place-token-number"
                onMouseDown={this.handleDragStart} 
                onDoubleClick={this.handleDoubleClick} >
                {this.props.tokens}
            </text>)
        }
        return Array.from({length: this.props.tokens}, (x, i) => i)
                    .map((tokenNo: number) => {
                            return (
                            <circle 
                                r="4"
                                cx={this.props.x - 20 + ((tokenNo % 5) * 10) }
                                cy={this.props.y - 15 + Math.floor(tokenNo / 5) * 10}
                                key={tokenNo}
                                className="place-token" />)
                        })
    }

    stateClasses = () => {
        var classes = ""
        switch (this.props.toolMode) {
            case ToolMode.Move: {
                classes += " circle-mode-move"
                break
            }
            case ToolMode.AddConnection: {
                classes += " circle-mode-add-connection"
            }
        }
        if (this.props.selected) {
            classes += " selected"
        }
        return classes
    }

    mainElement = () => {
        if (this.props.imageUrl !== undefined) {
            return (<image 
                x={this.props.x - 48} 
                y={this.props.y - 25} 
                href={this.props.imageUrl}
                width="96" 
                height="51"
                className={ this.stateClasses() } 
                onMouseDown={this.handleDragStart} 
                onDoubleClick={this.handleDoubleClick} /> )
        } else {
            return (<circle 
                r="40" 
                cx={this.props.x} 
                cy={this.props.y} 
                className={ "place-circle" + this.stateClasses() } 
                onMouseDown={this.handleDragStart} 
                onDoubleClick={this.handleDoubleClick} />)
        }

    }

    render() {
        return (
            <g>
                { this.mainElement() }
                { this.elementsForTokens() }

                <text 
                    x={this.props.x} 
                    y={this.props.y + 65} 
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