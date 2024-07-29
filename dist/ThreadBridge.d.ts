type ReceiverHandlerType<ReceiverMessages, ReceiverMessagesData> = <Message extends ReceiverMessages & keyof ReceiverMessagesData>(data: ReceiverMessagesData[Message]) => void;
export declare class ThreadBridge<SenderCommands, SenderCommandsData, ReceiverMessages, ReceiverMessagesData> {
    private _source;
    private _handlers;
    constructor(worker: Worker | Window);
    postMessage<Command extends SenderCommands & keyof SenderCommandsData>(name: Command, args: SenderCommandsData[Command]): void;
    onMessage<Message extends ReceiverMessages & keyof ReceiverMessagesData>(name: Message, handler: ReceiverHandlerType<Message, ReceiverMessagesData>): void;
    clearHandler<Message extends ReceiverMessages & keyof ReceiverMessagesData>(name: Message): void;
    clearAllHandlers(): void;
    private _onSourceMessage;
}
export declare namespace ThreadBridge {
    type ReceiverHandler<ReceiverMessages, ReceiverMessagesData> = ReceiverHandlerType<ReceiverMessages, ReceiverMessagesData>;
}
export {};
