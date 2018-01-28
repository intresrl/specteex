# Spectee - Wizard Of Oz Server

This project was generated with [npm](https://github.com/npm/npm) version 5.6.0.

This server uses websocket technology for client-server communication.
In this version, it only responds to the requests made with the `WS` protocol and returns a generic error for the `HTTP` ones.

## Development server

Run `npm start` for a dev server. The app will automatically reload if you change any of the source files.

Navigate to `http://localhost:3000/` to check if the server is started, it will return you the `HTTP - 404 Not Found` error.
Remember that the server only handles calls mede with the `WS protocol`.
To test the connection with the `WS protocol` and try to send test messages, it is necessary to use a websocket client.
I personally use Google Chrome as browser and I find the [Smart Websocket Client](https://chrome.google.com/webstore/detail/smart-websocket-client/omalebghpgejjiaoknljcfmglgbpocdp?utm_source=chrome-app-launcher-info-dialog) plugin very useful.

## Build

Run `npm run-script build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `npm help` or go check out the [npm Documentation](https://docs.npmjs.com/).
