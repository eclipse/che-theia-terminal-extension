/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { ContainerModule, Container, interfaces } from "inversify";
import { WidgetFactory, ApplicationShell, Widget } from '@theia/core/lib/browser';
import { TerminalQuickOpenService } from "./contribution/terminal-quick-open";
import { } from './remote';
import { Workspace, TerminalApiEndPointProvider } from './workspace/workspace';
import { RemoteTerminalWidget, REMOTE_TERMINAL_WIDGET_FACTORY_ID, RemoteTerminalWidgetFactoryOptions, RemoteTerminalWidgetOptions } from "./terminal-widget/remote-terminal-widget";
import { RemoteWebSocketConnectionProvider } from "./server-definition/remote-connection";
import { TerminalProxyCreator, TerminalProxyCreatorProvider } from "./server-definition/terminal-proxy-creator";
import { TerminalFrontendContribution } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { ExecTerminalFrontendContribution } from './contribution/exec-terminal-contribution';

import '../../src/browser/terminal-widget/terminal.css';
import 'xterm/lib/xterm.css';

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind)  => {

    bind(ExecTerminalFrontendContribution).toSelf().inSingletonScope();
    rebind(TerminalFrontendContribution).toService(ExecTerminalFrontendContribution);

    bind(TerminalQuickOpenService).toSelf();
    bind(RemoteWebSocketConnectionProvider).toSelf();
    bind(TerminalProxyCreator).toSelf().inSingletonScope();
    bind(Workspace).toSelf().inSingletonScope();

    bind(RemoteTerminalWidget).toSelf().inTransientScope();

    let terminalNum = 0;
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: REMOTE_TERMINAL_WIDGET_FACTORY_ID,
        createWidget: (options: RemoteTerminalWidgetFactoryOptions) => {
            const child = new Container({ defaultScope: 'Singleton' });
            child.parent = ctx.container;
            const counter = terminalNum++;
            child.bind(RemoteTerminalWidgetOptions).toConstantValue({
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
                const workspace = context.container.get(Workspace);

                workspace.findTerminalServer().then(server => {
                    resolve(server.url);
                }).catch(err => {
                    console.error("Failed to get remote terminal server api end point url. Cause: ", err);
                    reject(err);
                });
            });
        };
    });

    bind<TerminalProxyCreatorProvider>("TerminalProxyCreatorProvider").toProvider<TerminalProxyCreator>((context) => {
        return () => {
            return new Promise<TerminalProxyCreator>((resolve, reject) => {
                const provider = context.container.get<TerminalApiEndPointProvider>("TerminalApiEndPointProvider");
                provider().then(url => {
                    context.container.bind("term-api-end-point").toConstantValue(url);
                    resolve(context.container.get(TerminalProxyCreator));
                }).catch(err => {
                    console.log("Failed get terminal proxy. Cause: ", err);
                    reject(err);
                });
            });
        };
    });
});
