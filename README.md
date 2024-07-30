# ThreadBridge

A utility TypeScript library that simplifies bi-directional communication between the main thread and web workers with full type safety. This lightweight implementation extends the default API and requires no additional libraries. Use the same codebase to facilitate seamless and strongly-typed data exchange in both directions. Of course, it can be used in one direction if, for some reason, you do not want to use it for bi-directional communication

## Install

Install the library using npm:

```bash
npm install threadbridge
```

## Demo

[codesandbox](https://codesandbox.io/p/devbox/threadbridge-example-637n9h)

## Usage

This API was designed to be used in both the MainThread and WebWorker simultaneously. First, commands and messages are defined, followed by the data associated with them.

```ts
// Types.ts
export enum SenderCommands {
    Ping,
}

export interface SenderCommandsData {
    [SenderCommands.Ping]: { value: number };
}

export enum ReceiverMessages {
    Pong,
}

export interface ReceiverMessagesData {
    [ReceiverMessages.Pong]: { value: number };
}
```

Initialize WebWorker and pass it to bridge with types.

```ts
// MainThread.ts
import { ThreadBridge } from "threadbridge";
import { SenderCommands, SenderCommandsData, ReceiverMessages, ReceiverMessagesData } from "./Types";

const worker = new Worker("./Worker.ts");
const bridge = new ThreadBridge<SenderCommands, SenderCommandsData, ReceiverMessages, ReceiverMessagesData>(worker);

bridge.postMessage(SenderCommands.Ping, { value: 1 });
bridge.onMessage(ReceiverMessages.Pong, ({ value }) => {
    console.log(value);
});
```

Then use ThreadBridge in WebWorker to communication with MainThread.

```ts
// Worker.ts
import { ThreadBridge } from "threadbridge";
import { SenderCommands, SenderCommandsData, ReceiverMessages, ReceiverMessagesData } from "./Types";

const bridge = new ThreadBridge<ReceiverMessages, ReceiverMessagesData, SenderCommands, SenderCommandsData>(self);

bridge.postMessage(ReceiverMessages.Pong, { value: 2 });
bridge.onMessage(SenderCommands.Ping, ({ value }) => {
    console.log(value);
});
```

If u prefer to use named arrow functions you can do it this way:

```ts
const callback: ThreadBridge.ReceiverHandler<ReceiverMessages.Pong, ReceiverMessagesData> = ({ value }) => {
    console.log(value);
};

bridge.onMessage(ReceiverMessages.Pong, callback);
```

## API

-   **`ThreadBridge<SenderCommands, SenderCommandsData, ReceiverMessages, ReceiverMessagesData>`**

    -   `constructor(worker: Worker | DedicatedWorkerGlobalScope)`

        -   Initializes the ThreadBridge with a worker or Window ( MainThread ).

    -   `postMessage(command: SenderCommands, data: SenderCommandsData[SenderCommands]): void`

        -   Sends a message to the worker.

    -   `onMessage(message: ReceiverMessages, handler: (data: ReceiverMessagesData[ReceiverMessages]) => void): void`

        -   Registers a handler to process incoming messages.

    -   `clearHandler(message: ReceiverMessages): void`

        -   Removes handler for the specific message.

    -   `clearAllHandlers(): void`
        -   Removes all handlers.

## License

Distributed under the MIT License
