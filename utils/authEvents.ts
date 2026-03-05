type AuthEventHandler = () => void;

class AuthEventEmitter {
    private handlers: AuthEventHandler[] = [];

    subscribe(handler: AuthEventHandler) {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter((h) => h !== handler);
        };
    }

    emitUnauthorized() {
        this.handlers.forEach((handler) => handler());
    }
}

export const authEvents = new AuthEventEmitter();
