type Handler<ReceiverMessages, ReceiverMessagesData> = <Message extends ReceiverMessages & keyof ReceiverMessagesData>(
    data: ReceiverMessagesData[Message]
) => void;

export class ThreadBridge<SenderCommands, SenderCommandsData, ReceiverMessages, ReceiverMessagesData> {
    private _source: Worker | Window;
    private _handlers: Map<ReceiverMessages, Handler<ReceiverMessages, ReceiverMessagesData>>;

    constructor(worker: Worker | Window) {
        this._source = worker;
        this._handlers = new Map();
        this._source.onmessage = this._onSourceMessage;
    }

    public postMessage<Command extends SenderCommands & keyof SenderCommandsData>(
        name: Command,
        args: SenderCommandsData[Command]
    ): void {
        this._source.postMessage({
            type: name,
            data: args,
        });
    }

    public onMessage<Message extends ReceiverMessages & keyof ReceiverMessagesData>(
        name: Message,
        handler: (data: ReceiverMessagesData[Message]) => void
    ) {
        this._handlers.set(name, handler as Handler<Message, ReceiverMessagesData>);
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
