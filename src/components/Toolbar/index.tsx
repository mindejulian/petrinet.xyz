import React, { Component } from 'react';
import './index.css';

export interface IToolbarProps {
    setModeMove: (e: any) => void;
    setModeTransition: (e: any) => void;
    setModePlace: (e: any) => void;
    setModeAddConnection: (e: any) => void;
    exportModelAsJSON: (e: any) => void;
    setModeRun: (e: any) => void;
}

export class Toolbar extends Component<IToolbarProps, {}> {
    render() {
        return ( 
            <div className="toolbar">
                <button className="toolbar-button" onClick={this.props.setModeMove}>
                    Move
                </button>
                <button className="toolbar-button" onClick={this.props.setModeTransition}>
                    Add transition
                </button>
                <button className="toolbar-button" onClick={this.props.setModePlace}>
                    Add place
                </button>
                <button className="toolbar-button" onClick={this.props.setModeAddConnection}>
                    Add connection
                </button>
                <button className="toolbar-button" onClick={this.props.exportModelAsJSON}>
                    Export as JSON
                </button>
                <button className="toolbar-button" onClick={this.props.setModeRun}>
                    Run simulation
                </button>
            </div>
        );
    }
}

export default Toolbar;
