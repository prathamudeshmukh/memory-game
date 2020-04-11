import React from 'react';
import './App.css';
import '../node_modules/picnic/picnic.min.css';
import MemoryPlayGround from "./components/MemoryPlayGround";
import _ from "underscore";

const HIGHEST_SCORE_KEY = "HIGHEST_SCORE";

export default class App extends React.Component {

    constructor(props){
        super(props);
        this.rows = 3;
        this.columns = 3;
        this.memorizeTime = 10;
        this.noOfQuestionsToBeAsked = 3;
        this.noOfWrongGuessesAllowed = 2;
        this.scoreIncrementFactor = 5;
        const highestScore = localStorage.getItem(HIGHEST_SCORE_KEY);
        this.state = {
            hideTiles: true,
            showTilesTimer: this.memorizeTime,
            memoryData: [],
            readComplete: false,
            guessQuestionsAlreadyAsked:[],
            progressBar: 100,
            noOfWrongGuesses: 0,
            currentScore: 0,
            highestScore: highestScore ? parseInt(highestScore) : 0,
        };
        _.bindAll(this, "startGame", "onTileClick")
    }

    getMemoryData() {
        let memoryData = [];
        const memoryMetaData = [];
        for (let row=0; row<this.rows; row++) {
            const newRow = [];
            for (let col=0; col<this.columns; col++) {
                const number = this.getRandomInt(99);
                newRow.push(number);
                memoryMetaData.push(number);
            }
            memoryData.push(newRow);
        }
        const questionsToBeAsked = this.getQuestionsToBeAsked(memoryMetaData);
        return {memoryData, memoryMetaData, questionsToBeAsked};
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    startGame() {
        const { memoryData, memoryMetaData, questionsToBeAsked} = this.getMemoryData();
        this.setState( { hideTiles: false, memoryData, memoryMetaData, questionsToBeAsked, progressBar: 0 } );
        this.showTilesTimerInterval = setInterval(() => {
            this.setState( {
                showTilesTimer: this.state.showTilesTimer - 1
            } )
        }, 1000);

        setTimeout(() => {
            this.setState({hideTiles: true, showTilesTimer: this.memorizeTime, readComplete: true });
            clearInterval(this.showTilesTimerInterval);
        }, this.memorizeTime * 1000)
    }

    guessQuestion(){
        if(this.state.readComplete){
            console.log("MemoryData", this.state.memoryData);
            console.log("questionsToBeAsked", this.state.questionsToBeAsked);
            console.log("memoryMetaData", this.state.memoryMetaData);

            const {questionsToBeAsked, memoryMetaData} = this.state;
            if (questionsToBeAsked.length === 0) {
                return 'Round over';
            }
            const memoryDataIndex = questionsToBeAsked[questionsToBeAsked.length - 1];
            return `Guess where was ${memoryMetaData[memoryDataIndex]}`
        }
    }

    numberGuess(questionsToBeAsked,memoryMetaData){
        const max = memoryMetaData.length;
        const index = this.getRandomInt(max);
        if (questionsToBeAsked.includes(index)) {
            return this.numberGuess(questionsToBeAsked,memoryMetaData);
        }
        return index;
    }

    getQuestionsToBeAsked(memoryMetaData) {
        const questionsToBeAsked = [];
        _.times(this.noOfQuestionsToBeAsked, ()=>{
            questionsToBeAsked.push(this.numberGuess(questionsToBeAsked, memoryMetaData));
        });
        return questionsToBeAsked;
    }

    onTileClick(row, col) {
        const { questionsToBeAsked, memoryData, memoryMetaData} = this.state;
        const latestGuessQuestion = questionsToBeAsked[questionsToBeAsked.length - 1];
        console.log('clicked on:'+ memoryData[row][col]);
        console.log('Expected :'+ memoryMetaData[latestGuessQuestion]);
        if (memoryData[row][col] === memoryMetaData[latestGuessQuestion]) {
            alert("success");
            questionsToBeAsked.pop();
            const currentScore = this.state.currentScore + this.scoreIncrementFactor;
            let highestScore = this.state.highestScore;
            if (currentScore > this.state.highestScore) {
                highestScore = currentScore;
                localStorage.setItem(HIGHEST_SCORE_KEY, highestScore.toString())
            }
            this.setState( { questionsToBeAsked, currentScore, highestScore } );
            return;
        }
        console.info("wrong guesses:",this.state.noOfWrongGuesses,this.noOfWrongGuessesAllowed);
        if (this.state.noOfWrongGuesses < this.noOfWrongGuessesAllowed) {
            alert("failure");
            this.setState({noOfWrongGuesses: this.state.noOfWrongGuesses + 1});
            return;
        }
        alert("GAME OVER");
    }

    renderGuessRemaining() {
        return <div>
            No Of Guesses remained:
            <span className="guess-no">
                {this.noOfWrongGuessesAllowed - this.state.noOfWrongGuesses}
            </span>
        </div>
    }

    renderScores() {
        return <div>
            <div>
                Current Score:
                <span className="current-score">
                    {this.state.currentScore}
                </span>
            </div>
            <div>
                Your Highest Score:
                <span className="highest-score">
                    {this.state.highestScore}
                </span>
            </div>
        </div>
    }

    render() {
        return <div className="App">
            <MemoryPlayGround
                memoryData={this.state.memoryData}
                rows={this.rows}
                columns={this.columns}
                hideTiles={this.state.hideTiles}
                onTileClick={this.onTileClick}
            />
            <div>{this.renderGuessRemaining()}</div>
            <div>{this.guessQuestion()}</div>
            <div>{this.renderScores()}</div>
            <div className="status-bar-border">
                <div className="status-bar-fill" style={{
                    width: `${this.state.progressBar}%`,
                    transitionDuration: `${this.memorizeTime}s`
                }} >
                    {this.state.showTilesTimer ? this.state.showTilesTimer : ""}
                </div>
            </div>
            <button onClick={this.startGame}>Start!</button>
        </div>
    }
}
