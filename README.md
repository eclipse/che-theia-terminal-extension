# Terminal exec extension

Terminal exec extension creates multi-machine terminals for Theia inside Eclipse CHE workspaces. Extension uses che-machine-exec server
side from repository https://github.com/eclipse/che-machine-exec and client side in the "che-theia-terminal" directory. Server side was written on
the go-lang and uses docker client to create terminal connection based on docker exec. Current extension it's Theia widget written on the Typescript.

# How to use/test extension
Create new Eclipse CHE workspace from on of the Theia stack. If it's workspace next stack enable che-machine-exec plugin. Lauch workspace. When workspace will be started You will see running Theia.
New multimachine terminal can be created:

1. With help main menu. Open `File => Open new multi-machine-terminal`
2. With help shortcut. Press ``` Ctrl + ` ```
3. With help command palette: Type `Ctrl + Shift + P`(for Linux, Windows) or `Command + Shift + P` for Mac. Then type command name 'terminal'. Press Enter.

In all three casses you will see dropdown with list machines. Select one of them to create new terminal.

## Development
It's CHE specific extension, so You should develop this extension inside Eclipse CHE workspace.
Create new workspace from Theia stack. In case if it's workspace-next stack, enable che-machine-exec plugin.
Start workspace. Clone extension for developement. To clone extension You can use command pallete command:
Type `Ctrl + Shift + P`(or `Command + Shift + P` for Mac). To find git clone command type `Git clone`.
Select 'Git clone...'  command and press enter. Paste to the command pallete input github link and press enter.

Go to extension:
```
cd /projects/che-theia-terminal-extension
```

Build extension
```
yarn rebuild:browser
```

Launch extension:
```
cd browser-app && yarn theia start --port=3030 --hostname=0.0.0.0
```

Start watching of extension:
```
    cd che-theia-terminal
    yarn watch
```

Start watching of the browser-app.
```
    yarn rebuild:browser
    cd browser-app
    yarn watch
```
On the user dashboard you can find server url for port 3030. Open this url in the browser.
