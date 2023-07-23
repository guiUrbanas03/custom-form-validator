export class Observer {
    updateObserver() {
        throw new Error("Must implement update() method")
    }
}


export class Subject {
    constructor() {
      this.observers = [];
    }

    addObserver(observer) {
      this.observers.push(observer);
    }

    notifyObservers(data) {
      this.observers.forEach((observer) => observer.updateObserver(data));
    }
}
