# Deprecated

This feature has been merged as a plugin in eclipse/che-theia:
https://github.com/eclipse/che-theia/pull/24/files

# Terminal exec extension

Terminal exec extension creates terminals in specific containers for Theia inside Eclipse CHE workspaces. Extension uses che-machine-exec server
side from repository https://github.com/eclipse/che-machine-exec and client side in the "che-theia-terminal" directory. Server side was written on
the go-lang and uses docker client to create terminal connection based on docker exec. Current extension it's Theia widget written on the Typescript.

# Getting started

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

    cd che-theia-terminal
    yarn watch

Start watching of the browser example.

    yarn rebuild:browser
    cd browser-app
    yarn watch

Launch `Start Browser Backend` configuration from VS code.

Open http://localhost:3000 in the browser.

## Developing with the Electron example

Start watching of the hello world extension.

    cd che-theia-terminal
    yarn watch

Start watching of the electron example.

    yarn rebuild:electron
    cd electron-app
    yarn watch

Launch `Start Electron Backend` configuration from VS code.

## Publishing che-theia-terminal-plugin

Create a npm user and login to the npm registry, [more on npm publishing](https://docs.npmjs.com/getting-started/publishing-npm-packages).

    npm login

Publish packages with lerna to update versions properly across local packages, [more on publishing with lerna](https://github.com/lerna/lerna#publish).

    npx lerna publish
