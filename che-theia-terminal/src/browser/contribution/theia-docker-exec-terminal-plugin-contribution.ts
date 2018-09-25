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
import {TerminalApiEndPointProvider} from "../server-definition/terminal-proxy-creator";

export const NewRemoteTerminal = {
    id: 'NewRemoteTerminal',
    label: 'New terminal'
};

@injectable()
export class TheiaDockerExecTerminalPluginContribution implements CommandContribution, MenuContribution {

    @inject(TerminalQuickOpenService)
    private readonly terminalQuickOpen: TerminalQuickOpenService;

    @inject("TerminalApiEndPointProvider")
    protected readonly termApiEndPointProvider: TerminalApiEndPointProvider;

    registerCommands(registry: CommandRegistry): void {
        this.termApiEndPointProvider().then(url => {
            registry.registerCommand(NewRemoteTerminal, {
                execute: () => {
                    this.terminalQuickOpen.openTerminal();
                }
            });
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        this.termApiEndPointProvider().then(url => {
            menus.registerMenuAction(CommonMenus.FILE, {
                commandId: NewRemoteTerminal.id,
                label: NewRemoteTerminal.label
            });
        });
    }
}
