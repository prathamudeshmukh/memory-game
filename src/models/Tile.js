const KEY_DATA = 'data';
const KEY_ATTEMPT = 'attempt';
export const KEY_ATTEMPT_RESULT = 'result';
export const KEY_ATTEMPT_QUESTION = 'question';

export const ATTEMPT_RESULT_SUCCESS = 'success';
export const ATTEMPT_RESULT_FAIL = 'fail';
export const ATTEMPT_RESULT_NOT_ATTEMPTED = 'na';

export default class Tile {

    constructor(data) {
        this.tile = {
            [KEY_DATA]: data
        };
    }

    setAttempt(result, question) {
        this.tile[KEY_ATTEMPT] = {
            result, question
        }
    }

    getResult() {
        if (!this.tile[KEY_ATTEMPT]) {
            return ATTEMPT_RESULT_NOT_ATTEMPTED;
        }
        return this.tile[KEY_ATTEMPT][KEY_ATTEMPT_RESULT];
    }
}
