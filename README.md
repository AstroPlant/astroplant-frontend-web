# AstroPlant front-end

This is the AstroPlant front-end.
It communicates with the AstroPlant API to allow configuring and viewing data of kits.

## Developing and building

During the build process, environment variables are used to configure the servers the front-end communicates with.

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | The API url. | `http://localhost:8080` |
| `VITE_WEBSOCKET_URL` | The websocket url. | `ws://localhost:8080/ws` |

### Development server

To run the development server, run:

```sh
$ yarn
$ yarn start
```

This starts the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### Building

To build the static files, run:

```sh
$ yarn build
```

This builds the app for production to the `./build` folder.

## AstroPlant API client module
This project includes a client for the AstroPlant API as a local module in `./local_modules/astroplant-api`. It is generated automatically from [the openapi.yaml file in the AstroPlant API repository](https://github.com/AstroPlant/astroplant-api/blob/master/openapi.yaml).

To regenerate the API client module, clone the AstroPlant API repository and make your changes to `openapi.yaml`. Make sure the path in `./generate.sh` points to the correct location. Then execute `./generate.sh` in your shell.
