import Tile from "./Tile";
import _ from "underscore";
import {getRandomInt} from "../Util";

export default class Game {

    constructor(noOfQuestionsToBeAsked) {
        this.gameData = [];
        this.data = [];
        this.noOfQuestionsToBeAsked = noOfQuestionsToBeAsked;
    }

    setData(row, column, data) {
        this.gameData[row][column] = new Tile(data);
        this.data.push(data);
    }

    get(row, column) {
        return this.gameData[row][column];
    }

    getQuestionsToBeAsked(memoryMetaData) {
        const questionsToBeAsked = [];
        _.times(this.noOfQuestionsToBeAsked, ()=>{
            questionsToBeAsked.push(this.numberGuess(questionsToBeAsked, memoryMetaData));
        });
        return questionsToBeAsked;
    }

    numberGuess(questionsToBeAsked,memoryMetaData){
        const max = memoryMetaData.length;
        const index = getRandomInt(max);
        if (questionsToBeAsked.includes(index)) {
            return this.numberGuess(questionsToBeAsked,memoryMetaData);
        }
        return index;
    }
}
