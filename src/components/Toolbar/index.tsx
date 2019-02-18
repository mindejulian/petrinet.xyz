import React, { Component } from 'react';
import './index.css';
import { ToolMode } from '../../interfaces';

export interface IToolbarProps {
    currentMode: ToolMode;
    setMode: (mode: ToolMode) => void;
    exportModelAsJSON: (e: any) => void;
}

export class Toolbar extends Component<IToolbarProps, {}> {

    setModeMove = (e: any) => {
        this.props.setMode(ToolMode.Move)
    }

    setModeTransition = (e: any) => {
        this.props.setMode(ToolMode.Transition)
    }

    setModePlace = (e: any) => {
        this.props.setMode(ToolMode.Place)
    }

    setModeConnection = (e: any) => {
        this.props.setMode(ToolMode.AddConnection)
    }

    setModeRun = (e: any) => {
        this.props.setMode(ToolMode.Run)
    }


    render() {
        return (
            <div className="toolbar">
                <button
                    className={"toolbar-button " + (this.props.currentMode.toString() === ToolMode.Move.toString() ? "selected" : "")}
                    onClick={this.setModeMove}>
                    Move
                </button>
                <button
                    className={"toolbar-button " + (this.props.currentMode.toString() === ToolMode.Transition.toString() ? "selected" : "")}
                    onClick={this.setModeTransition}>
                    Add transition
                </button>
                <button
                    className={"toolbar-button " + (this.props.currentMode.toString() === ToolMode.Place.toString() ? "selected" : "")}
                    onClick={this.setModePlace}>
                    Add place
                </button>
                <button
                    className={"toolbar-button " + (this.props.currentMode.toString() === ToolMode.AddConnection.toString() ? "selected" : "")}
                    onClick={this.setModeConnection}>
                    Add connection
                </button>
                <button
                    className={"toolbar-button " + (this.props.currentMode.toString() === ToolMode.Run.toString() ? "selected" : "")}
                    onClick={this.setModeRun}>
                    Run simulation
                </button>

                <button
                    className="toolbar-button"
                    onClick={this.props.exportModelAsJSON}>
                    Export as JSON
                </button>

            </div>
        );
    }
}

export default Toolbar;
