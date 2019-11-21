# AstroPlant front-end

This is the AstroPlant front-end.
It communicates with the AstroPlant API to allow configuring and viewing data of kits.

## Developing and building

During the build process, environment variables are used to configure the servers the front-end communicates with.

| Variable | Description | Default |
|-|-|-|
| `REACT_APP_WEBSOCKET_URLDATABASE_URL` | The websocket url. | `ws://localhost:8081` |

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
