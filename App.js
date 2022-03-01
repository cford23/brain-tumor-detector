import './App.css';
import React from 'react';
import { styled } from '@mui/material/styles';
import Header from "./Header";
import Button from "@mui/material/Button";
import { InfinitySpin } from 'react-loader-spinner';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';


const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress && <InfinitySpin color="#2196f3" />
    );
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.Input = styled('input')({
            display: 'none'
        });
        this.state = {
            selectedFile: false,
            showPrediction: false,
            showEvaluate: true,
            prediction: '',
            probability: ''
        };
    }

    // Handles when an image is selected to be uploaded
    onFileChange = event => {
        this.setState({
            selectedFile: event.target.files[0],
            showPrediction: false
        });
    };

    // Handles when an image is uploaded
    onFileUpload = () => {
        const formData = new FormData();
        formData.append("file", this.state.selectedFile);
        formData.append("filename", this.state.selectedFile.name)

        return fetch('http://localhost:5000/flask/upload', { method: 'POST', body: formData });
    };

    // Displays image and Evalutate Image button once file has been uploaded
    fileData = () => {
        if (this.state.selectedFile) {
            this.onFileUpload();
            return (
                <div>
                    <br />
                    <img src={URL.createObjectURL(this.state.selectedFile)} alt="uploadedImage" />
                    <br />
                    {this.state.showEvaluate && <Button onClick={this.evaluateImage} variant="outlined" component="span" color="inherit">Evaluate Image</Button>}
                    <LoadingIndicator />
                    {this.state.showPrediction && <h4>Prediction: {this.state.prediction} ({this.state.probability}% confidence)</h4>}
                </div>
            );
        }
        else {
            return (
                <div>
                    <br />
                    <h4>No file uploaded</h4>
                </div>
            );
        }
    };

    // Handles getting model prediction from Flask
    evaluateImage = () => {
        this.setState({
            showEvaluate: false,
            showPrediction: false
        });
        trackPromise(
            fetch('http://localhost:5000/flask/predict').then(res => res.json()).then(data => {
                this.setState({ 
                    prediction: data.label,
                    probability: data.probability,
                    showPrediction: true,
                    showEvaluate: true
                })
            })
        );
    };

    render() {
        return (
            <div className="App">
                <Header />
                <header className="App-header">
                    <label htmlFor="contained-button-file">
                        <this.Input onChange={this.onFileChange} accept="image/*" id="contained-button-file" type="file" />
                        <Button variant="outlined" component="span" color="inherit">
                            Upload Image
                        </Button>
                    </label>
                    {this.fileData()}
                </header>
            </div>
        );
    }
}

export default App;