# Terminal Exec plugin

Terminal exec plugin creates multi-machine terminals for Theia inside Eclipse CHE workspaces. Plugin consist of server
side located in the "machine-exec-server" directory and client side in the "che-theia-terminal" directory. Server side was written on
the go-lang and uses docker cli to create terminal connection based on docker exec. Client plugin it's Theia widget written on the Typescript.
Minimal Theia core version to launch plugin: 0.3.8.

# Getting started server side

To build machine exec server side you need go-lang version at least 1.10 or higher, docker and dep tool.

To install go-lang you can use [installation go-lang guide](https://golang.org/doc/install)

To install docker you can use [installation docker guide](https://docs.docker.com/install)

To manage go-lang dependencies we are using [dep tool](https://github.com/golang/dep).
To install dep tool you can use [installation dep tool guide](https://golang.github.io/dep/docs/installation.html).

To build server side binary you can run buildBinary.sh script:

    ./buildBinary.sh

Script builds server side binary inside docker container and save binary to the "machine-exec-server" directory.

## Developing server side

To format code use command:

    go fmt ./...

To recompile code you can use compile.sh script:

    ./compile.sh

You can see list go-lang dependencies in the Gopkg.toml file, source code of this dependencies saved in the "vendor" directory. To manually update this dependencies use:

    dep ensure

# Getting started client side

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
