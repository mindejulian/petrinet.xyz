import React from 'react';
import { IModel, IPetriNetViewState } from '../../interfaces';
import DemoNet from '../../nettemplates/demo.json';
import PubSub from '../../nettemplates/pubsub.json';
import Mutex from '../../nettemplates/mutex.json';
import Machine from '../../nettemplates/machineshop.json';
import './index.css';
import { connect } from 'react-redux';
import { loadModel } from '../PetriNetView/actions';

interface IModelPickerProps {
    model: IModel,
    loadModel: (model: IModel) => void;
}

interface IModelPickerState {
    model: IModel;
    templates: IModel[];
}

class ModelPicker extends React.Component<IModelPickerProps, IModelPickerState> {

    constructor(props: IModelPickerProps) {
        super(props);
        this.state = {
            model: DemoNet as IModel,
            templates: [
                DemoNet as IModel,
                PubSub as IModel,
                Mutex as IModel,
                Machine as IModel]
        }
    }

    handleChange = (e: any) => {
        let chosenTemplate = this.state.templates.find(t => t.title === e.target.value);
        console.log('Chose: ', chosenTemplate!.title)
        this.props.loadModel(chosenTemplate as IModel);
    }

    renderTemplates = () => {
        return (
            {

            }
        )
    }

    render() {
        return (
            <div className="model-picker">
                Select model:
                <select name="modelPicker" id="modelPicker" onChange={this.handleChange}>
                    {this.state.templates.map((template: IModel) => {
                        return (
                            <option value={template.title} key={template.title}>{template.title}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
}

export default connect(
    (state: IPetriNetViewState) => ({
        model: state.model
    }), dispatch => ({
        loadModel: (model: IModel) => dispatch(loadModel(model))
    })
)(ModelPicker)