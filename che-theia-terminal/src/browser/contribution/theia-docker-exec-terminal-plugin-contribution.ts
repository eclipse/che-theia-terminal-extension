/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";

import { TerminalQuickOpenService } from "./terminal-quick-open";
import { CHEWorkspaceService } from "../../common/workspace-service";
import { TerminalProxyCreator } from "../server-definition/terminal-proxy-creator";
import { RemoteTerminalWidgetFactoryOptions } from "../terminal-widget/remote-terminal-widget";
import { IServer } from "@eclipse-che/workspace-client";

export const NewRemoteTerminal = {
    id: 'NewRemoteTerminal',
    label: 'New terminal'
};
@injectable()
export class TheiaDockerExecTerminalPluginCommandContribution implements CommandContribution, MenuContribution {

    private termServer: IServer | undefined;

    constructor(
        @inject(TerminalQuickOpenService) protected readonly terminalQuickOpen: TerminalQuickOpenService,
        @inject(CHEWorkspaceService) protected readonly wsService: CHEWorkspaceService,
        @inject(TerminalProxyCreator) protected readonly termProxyCreator: TerminalProxyCreator
    ) { }

    async registerCommands(registry: CommandRegistry): Promise<void> {
        const termServer = <IServer | undefined>await this.getTerminalServer();
        if (!termServer) {
            return;
        }
        const workspaceId = await this.wsService.getWorkspaceId();

        const options: RemoteTerminalWidgetFactoryOptions = {
            endpoint: termServer.url,
            workspaceId: workspaceId,
            machineName: "dev-machine"
        };
        registry.registerCommand(NewRemoteTerminal, {
            execute: () => {
                this.terminalQuickOpen.openTerminal(options);
            }
        });
    }

    async registerMenus(menus: MenuModelRegistry) {
        const termServer = await this.getTerminalServer();
        if (termServer) {
            menus.registerMenuAction(CommonMenus.FILE, {
                commandId: NewRemoteTerminal.id,
                label: NewRemoteTerminal.label
            });
        }
    }

    private async getTerminalServer(): Promise<IServer | undefined> {
        if (this.termServer) {
            return this.termServer;
        }

        this.termServer = await this.wsService.findTerminalServer();
        return this.termServer;
    }
}
