import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common"; 
import { ContainerModule, Container } from "inversify";
import { WidgetFactory, ApplicationShell, Widget } from '@theia/core/lib/browser';
import { TerminalQuickOpenService } from "./contribution/terminal-quick-open";
import { } from './remote';
import { Workspace, TerminalApiEndPointProvider } from './workspace/workspace';
import { TheiaDockerExecTerminalPluginCommandContribution, TheiaDockerExecTerminalPluginMenuContribution } from "./contribution/theia-docker-exec-terminal-plugin-contribution";
import { RemoteTerminalWidget, REMOTE_TERMINAL_WIDGET_FACTORY_ID, RemoteTerminalWidgetFactoryOptions, RemoteTerminalWidgetOptions } from "./terminal-widget/remote-terminal-widget";
import { RemoteWebSocketConnectionProvider } from "./server-definition/remote-connection";
import { TerminalProxyCreator, TerminalProxyCreatorProvider } from "./server-definition/terminal-proxy-creator";

import '../../src/browser/terminal-widget/terminal.css';
import 'xterm/lib/xterm.css';

export default new ContainerModule(bind => {

    bind(CommandContribution).to(TheiaDockerExecTerminalPluginCommandContribution);
    bind(MenuContribution).to(TheiaDockerExecTerminalPluginMenuContribution);

    bind(TerminalQuickOpenService).toSelf();
    bind(RemoteWebSocketConnectionProvider).toSelf();
    bind(TerminalProxyCreator).toSelf().inSingletonScope();
    bind(Workspace).toSelf().inSingletonScope();

    bind(RemoteTerminalWidget).toSelf().inTransientScope();

    var terminalNum = 0;
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: REMOTE_TERMINAL_WIDGET_FACTORY_ID,
        createWidget: (options: RemoteTerminalWidgetFactoryOptions) => {
            const child = new Container({ defaultScope: 'Singleton' });
            child.parent = ctx.container;
            const counter = terminalNum++;
            child.bind(RemoteTerminalWidgetOptions).toConstantValue({
                // endpoint: { path: terminalsPath },
                id: 'remote-terminal-' + counter,
                caption: 'Remote terminal ' + counter,
                label: 'Remote terminal ' + counter,
                destroyTermOnClose: true,
                ...options
            });
            const result = <Widget>child.get(RemoteTerminalWidget);

            const shell = ctx.container.get(ApplicationShell);
            shell.addWidget(result, { area: 'bottom' });
            shell.activateWidget(result.id);
            return result;
        }
    }));

    bind<TerminalApiEndPointProvider>("TerminalApiEndPointProvider").toProvider<string>((context) => {
        return () => {
            return new Promise<string>((resolve, reject) => {
                let workspace = context.container.get(Workspace);

                workspace.findTerminalServer().then(server => {
                    resolve("ws://localhost:4444");
                }).catch(err => {
                    console.error("Failed to get remote terminal server api end point url. Cause: ", err);
                    reject(err);
                })
            });
        };
    })

    bind<TerminalProxyCreatorProvider>("TerminalProxyCreatorProvider").toProvider<TerminalProxyCreator>((context) => {
        return () => {
            return new Promise<TerminalProxyCreator>((resolve, reject) => {
                let provider = context.container.get<TerminalApiEndPointProvider>("TerminalApiEndPointProvider");
                provider().then(url => {
                    context.container.bind("term-api-end-point").toConstantValue(url);
                    resolve(context.container.get(TerminalProxyCreator));
                }).catch(err => {
                    console.log("Failed get terminal proxy. Cause: ", err);
                    reject(err);
                });
            });
        };
    })
});
