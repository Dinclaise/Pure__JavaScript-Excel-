export class Emitter {
    constructor() {
        this.listeners = {}
    }

    // Уведомляем слушателей если они есть
    emit(event, ...args) {
        if (Array.isArray(this.listeners[event])) {
            return false;
        }
        this.listeners[event].forEach(listener => {
            listener(...args)
        })
        return true;
    }

    // Подписываемся на уведомление
    // Добавляем нового слушателя
    subscribe(event, fn) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
        return () => {
            this.listeners[event] = this.listeners[event].filter(listener => listener !== fn)
        }
    }
}


// Example test

// const emitter = new Emitter();

// emitter.subscribe('Boat', data => console.log(`Sub: ${data}`);
// emitter.emit('1232131', 42)
// )

