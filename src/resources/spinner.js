export default class Spinner {
    constructor(){
        this.active = false;
    }

    on() {
        this.active = true;
    }

    off() {
        this.active = false;
    }
}