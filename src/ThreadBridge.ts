type Handler<onMessage, onData> = <Message extends onMessage & keyof onData>(data: onData[Message]) => void;

export class ThreadBridge<Commands, Messages, onCommandData, onMessageData> {
    private _source: Worker | Window;
    private _handlers: Map<onCommandData, Handler<onCommandData, onMessageData>>;

    constructor(worker: Worker | Window) {
        this._source = worker;
        this._handlers = new Map();
        this._source.onmessage = this._onSourceMessage;
    }

    public postMessage<Command extends Commands & keyof Messages>(name: Command, args: Messages[Command]): void {
        this._source.postMessage({
            type: name,
            data: args,
        });
    }

    public onMessage<Message extends onCommandData & keyof onMessageData>(
        name: Message,
        handler: (data: onMessageData[Message]) => void
    ) {
        this._handlers.set(name, handler as Handler<onCommandData, onMessageData>);
    }

    public destroy() {
        this._handlers.clear();
    }

    private _onSourceMessage = (event: MessageEvent): void => {
        const { type, data } = event.data;

        const handler = this._handlers.get(type);
        if (handler) handler(data);
    };
}
