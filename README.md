# Terminal Exec plugin
Terminal exec plugin creates multi-machine terminals for Theia inside Eclipse CHE workspaces. Plugin consist of server
side located in the "machine-exec-server" directory and client side in the "che-theia-terminal" directory. Server side was written on
the go-lang and uses docker cli to create terminal connection based on docker exec. Client plugin it's Theia widget written on the typescript.
Minimal Theia core version to launch plugin: 0.3.8.

# Build machine exec server side binary
To build machine exec server side uses go-lang version at least 1.10 or higher and docker.
To manage golang dependencies we are using [dep tool](https://github.com/golang/dep).
To build server side binary you can use buildBinary.sh script.
Script builds server side binary inside docker container.

# Build docker image with machine exec server
To create docker exec server side docker image you can use machine-exec-server/buildImage.sh script. 

## Getting started

Install [nvm](https://github.com/creationix/nvm#install-script).

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash

Install npm and node.

    nvm install 8
    nvm use 8

Install yarn.

    npm install -g yarn

## Running the browser example

    yarn rebuild:browser
    cd browser-app
    yarn start

Open http://localhost:3000 in the browser.

## Running the Electron example

    yarn rebuild:electron
    cd electron-app
    yarn start

## Developing with the browser example

Start watching of the hello world extension.

    cd theia-docker-exec-terminal-plugin-extension
    yarn watch

Start watching of the browser example.

    yarn rebuild:browser
    cd browser-app
    yarn watch

Launch `Start Browser Backend` configuration from VS code.

Open http://localhost:3000 in the browser.

## Developing with the Electron example

Start watching of the hello world extension.

    cd theia-docker-exec-terminal-plugin-extension
    yarn watch

Start watching of the electron example.

    yarn rebuild:electron
    cd electron-app
    yarn watch

Launch `Start Electron Backend` configuration from VS code.

## Publishing theia-docker-exec-terminal-plugin-extension

Create a npm user and login to the npm registry, [more on npm publishing](https://docs.npmjs.com/getting-started/publishing-npm-packages).

    npm login

Publish packages with lerna to update versions properly across local packages, [more on publishing with lerna](https://github.com/lerna/lerna#publish).

    npx lerna publish
