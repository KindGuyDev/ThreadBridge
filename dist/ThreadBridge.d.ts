export declare class ThreadBridge<Commands, Messages, onCommandData, onMessageData> {
    private _source;
    private _handlers;
    constructor(worker: Worker | Window);
    postMessage<Command extends Commands & keyof Messages>(name: Command, args: Messages[Command]): void;
    onMessage<Message extends onCommandData & keyof onMessageData>(name: Message, handler: (data: onMessageData[Message]) => void): void;
    destroy(): void;
    private _onSourceMessage;
}
