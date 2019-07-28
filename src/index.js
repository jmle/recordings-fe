import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {

    state = {
        recordings: []
    };

    componentDidMount() {
        fetch('http://localhost:8080/recordings')
            .then(res => res.json())
            .then(data => {
                this.setState({recordings: data._embedded.recordings})
            })
            .catch(console.log)
    }

    render() {
        return (
            <div className="container recordings-engine">
                <h1>Recordings engine</h1>
                <div className="container search-form">
                    <SearchForm/>
                </div>
                <div className="container">
                    <Recordings recordings={this.state.recordings}/>
                </div>
            </div>
        )
    }
}

class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        fetch('http://localhost:8080/recordings' + SearchForm.getSearchString(formData));
    }

    static getSearchString = formData => {
        let str = "?";
        if (formData.get("beat")) str = str.concat("beat=").concat(encodeURIComponent(formData.get("beat")));
        if (formData.get("tempo")) str = str.concat("tempo=").concat(formData.get("tempo"));
        return str;
    };

    render() {
        return (
            <form id="jandepora" onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="form-group col">
                        <label htmlFor="tempoInput">Tempo</label>
                        <input type="search" name="tempo" className="form-control" id="tempoInput"
                               placeholder="Filter by tempo"/>
                    </div>
                    <div className="form-group col">
                        <label htmlFor="beatInput">Beat</label>
                        <input type="search" name="beat" className="form-control" id="beatInput"
                               placeholder="Filter by beat"/>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>
        )
    }
}

const Recordings = ({recordings}) => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th scope="col">Filename</th>
                <th scope="col">Date</th>
                <th scope="col">Tempo</th>
                <th scope="col">Beat</th>
                <th scope="col">Style</th>
                <th scope="col">Comments</th>
            </tr>
            </thead>
            <tbody>
            {recordings.map((recording) => (
                <Recording recording={recording}/>
            ))}
            </tbody>
        </table>
    )
};

const Recording = ({recording}) => {
    return (
        <tr>
            <th scope="row">{recording.filename}</th>
            <td>{recording.date}</td>
            <td>{recording.tempo}</td>
            <td>{recording.beat}</td>
            <td>{recording.style}</td>
            <td>{recording.comments}</td>
        </tr>
    )
};

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
