/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { ContainerModule, Container } from "inversify";
import { WidgetFactory, ApplicationShell, Widget, WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { TerminalQuickOpenService } from "./contribution/terminal-quick-open";
import { TheiaDockerExecTerminalPluginCommandContribution } from "./contribution/theia-docker-exec-terminal-plugin-contribution";
import { RemoteTerminalWidget, REMOTE_TERMINAL_WIDGET_FACTORY_ID, RemoteTerminalWidgetFactoryOptions, RemoteTerminalWidgetOptions } from "./terminal-widget/remote-terminal-widget";
import { RemoteWebSocketConnectionProvider } from "./server-definition/remote-connection";
import { TerminalProxyCreator } from "./server-definition/terminal-proxy-creator";

import '../../src/browser/terminal-widget/terminal.css';
import 'xterm/lib/xterm.css';
import { cheWorkspaceServicePath, CHEWorkspaceService } from "../common/workspace-service";

export default new ContainerModule(bind => {
    bind(CommandContribution).to(TheiaDockerExecTerminalPluginCommandContribution);
    bind(MenuContribution).to(TheiaDockerExecTerminalPluginCommandContribution);

    bind(TerminalQuickOpenService).toSelf();
    bind(RemoteWebSocketConnectionProvider).toSelf();
    bind(TerminalProxyCreator).toSelf().inSingletonScope();

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

    bind(CHEWorkspaceService).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<CHEWorkspaceService>(cheWorkspaceServicePath);
    }).inSingletonScope();
});
