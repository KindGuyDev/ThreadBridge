# ThreadBridge

Utility TypeScript library that simplifies bi-directional communication between the main thread and web workers with full type safety. This is a lightweight implementation extending the default API, requiring no additional libraries. Use the same codebase to facilitate seamless and strongly-typed data exchange in both directions.

## Install

Install the library using npm:

```bash
npm install threadbridge
```

## Usage

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

## API

-   **`ThreadBridge<SenderCommands, SenderCommandsData, ReceiverMessages, ReceiverMessagesData>`**

    -   `constructor(worker: Worker | DedicatedWorkerGlobalScope)`

        -   Initializes the ThreadBridge with a worker or Window ( MainThread ).

    -   `postMessage(command: SenderCommands, data: SenderCommandsData[SenderCommands]): void`

        -   Sends a message to the worker.

    -   `onMessage(message: ReceiverMessages, handler: (data: ReceiverMessagesData[ReceiverMessages]) => void): void`

        -   Registers a handler to process incoming messages.

    -   `destroy(): void`
        -   Removes all handlers.

## License

Distributed under the MIT License
