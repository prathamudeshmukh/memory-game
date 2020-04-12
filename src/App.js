import React from 'react';
import './App.css';
import '../node_modules/picnic/picnic.min.css';
import MemoryPlayGround from "./components/MemoryPlayGround";
import _ from "underscore";
import {ANSWER_STATUS_RIGHT, ANSWER_STATUS_WRONG} from "./Constants";

const HIGHEST_SCORE_KEY = "HIGHEST_SCORE";

const ANSWER_STATUS_NONE = "NONE";

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
            answersGiven: [],
            roundInProgress:false,
            transitionDuration: this.memorizeTime
        };
        _.bindAll(this, "startGame", "onTileClick", "resetGame","gotoNextRound");
    }

    getMemoryData() {
        let memoryData = [];
        const memoryMetaData = [];
        const answersGiven = [];
        for (let row=0; row<this.rows; row++) {
            const newRow = [];
            answersGiven[row] = [];
            for (let col=0; col<this.columns; col++) {
                const number = this.getRandomInt(99);
                newRow.push(number);
                memoryMetaData.push(number);
                answersGiven[row].push(ANSWER_STATUS_NONE);
            }
            memoryData.push(newRow);
        }
        const questionsToBeAsked = this.getQuestionsToBeAsked(memoryMetaData);
        return {memoryData, memoryMetaData, questionsToBeAsked, answersGiven};
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    resetGame() {
        this.setState({
            questionsToBeAsked: [],
            answersGiven: [],
            memoryMetaData: [],
            memoryData: [],
            currentScore: 0,
            progressBar: 100,
            hideTiles: true,
            readComplete: false,
            showTilesTimer: this.memorizeTime,
            noOfWrongGuesses: 0,
            roundInProgress: false,
            transitionDuration: this.memorizeTime
        })
    }

    gotoNextRound(){
        const transitionDurationForNextRound = 1;
        this.setState({
            questionsToBeAsked: [],
            answersGiven: [],
            memoryMetaData: [],
            memoryData: [],
            progressBar: 100,
            hideTiles: true,
            readComplete: false,
            showTilesTimer: this.memorizeTime,
            noOfWrongGuesses: 0,
            roundInProgress: false,
            transitionDuration: transitionDurationForNextRound
        });
       setTimeout(this.startGame, transitionDurationForNextRound * 1000);
    }

    startGame() {
        if (this.state.roundInProgress) return;
        const { memoryData, memoryMetaData, questionsToBeAsked, answersGiven} = this.getMemoryData();
        this.setState( {
            hideTiles: false,
            memoryData,
            memoryMetaData,
            questionsToBeAsked,
            answersGiven,
            transitionDuration: this.memorizeTime,
            progressBar: 0,
            roundInProgress: true
        } );
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
        if (!this.state.roundInProgress) return;
        const { questionsToBeAsked, memoryData, memoryMetaData, answersGiven} = this.state;
        const latestGuessQuestion = questionsToBeAsked[questionsToBeAsked.length - 1];
        if (memoryData[row][col] === memoryMetaData[latestGuessQuestion]) {
            questionsToBeAsked.pop();
            const currentScore = this.state.currentScore + this.scoreIncrementFactor;
            let highestScore = this.state.highestScore;
            if (currentScore > this.state.highestScore) {
                highestScore = currentScore;
                localStorage.setItem(HIGHEST_SCORE_KEY, highestScore.toString())
            }
            answersGiven[row][col] = ANSWER_STATUS_RIGHT;
            this.setState( { questionsToBeAsked, currentScore, highestScore, answersGiven } );
            return;
        }
        answersGiven[row][col] = ANSWER_STATUS_WRONG;
        if (this.state.noOfWrongGuesses < this.noOfWrongGuessesAllowed) {
            this.setState({ noOfWrongGuesses: this.state.noOfWrongGuesses + 1, answersGiven });
            return;
        }
        this.setState({answersGiven, roundInProgress: false})
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
            <nav><span className={"brand"}>Memory Game</span></nav>
            <MemoryPlayGround
                memoryData={this.state.memoryData}
                rows={this.rows}
                columns={this.columns}
                hideTiles={this.state.hideTiles}
                onTileClick={this.onTileClick}
                answersGiven={this.state.answersGiven}
            />
            <div>{this.renderGuessRemaining()}</div>
            <div>{this.guessQuestion()}</div>
            <div>{this.renderScores()}</div>
            <div className="status-bar-border">
                <div className="status-bar-fill" style={{
                    width: `${this.state.progressBar}%`,
                    transitionDuration: `${this.state.transitionDuration}s`
                }} >
                    {this.state.showTilesTimer ? this.state.showTilesTimer : ""}
                </div>
            </div>
            <button onClick={this.startGame}>Start!</button>
            {(()=>{
                if(this.state.roundInProgress && this.state.questionsToBeAsked.length === 0) {
                    return <button onClick={this.gotoNextRound}>Next Round</button>
                }
            })()}
            <button onClick={this.resetGame}>Reset</button>
        </div>
    }
}
