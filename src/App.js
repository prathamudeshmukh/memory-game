import React from 'react';
import './App.css';
import '../node_modules/picnic/picnic.min.css';
import MemoryPlayGround from "./components/MemoryPlayGround";
import _ from "underscore";

export default class App extends React.Component {

    constructor(props){
        super(props);
        this.rows = 5;
        this.columns = 5;
        this.memorizeTime = 10;
        this.state = {
            hideTiles: true,
            showTilesTimer: this.memorizeTime,
            memoryData: []
        };
        _.bindAll(this, "startGame")
    }

    getMemoryData() {
        let memoryData = [];
        for (let row=0; row<this.rows; row++) {
            const row = [];
            for (let col=0; col<this.columns; col++) {
                row.push(this.getRandomInt());
            }
            memoryData.push(row);
        }
        return memoryData;
    }

    getRandomInt() {
        return Math.floor(Math.random() * Math.floor(99));
    }

    startGame() {
        const memoryData = this.getMemoryData();
        this.setState( { hideTiles: false, memoryData } );
        this.showTilesTimerInterval = setInterval(() => {
            this.setState( {showTilesTimer: this.state.showTilesTimer - 1} )
        }, 1000);

        setTimeout(() => {
            this.setState({hideTiles: true, showTilesTimer: this.memorizeTime});
            clearInterval(this.showTilesTimerInterval);
        }, this.memorizeTime * 1000)
    }

    render() {
        return <div className="App">
            <MemoryPlayGround memoryData={this.state.memoryData} rows={this.rows} columns={this.columns} hideTiles={this.state.hideTiles}/>
            <div>{this.state.showTilesTimer ? this.state.showTilesTimer : ""}</div>
            <button onClick={this.startGame}>Start!</button>
        </div>
    }
}
