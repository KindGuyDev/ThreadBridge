export declare class ThreadBridge<SenderCommands, SenderCommandsData, ReceiverMessages, ReceiverMessagesData> {
    private _source;
    private _handlers;
    constructor(worker: Worker | Window);
    postMessage<Command extends SenderCommands & keyof SenderCommandsData>(name: Command, args: SenderCommandsData[Command]): void;
    onMessage<Message extends ReceiverMessages & keyof ReceiverMessagesData>(name: Message, handler: (data: ReceiverMessagesData[Message]) => void): void;
    destroy(): void;
    private _onSourceMessage;
}
