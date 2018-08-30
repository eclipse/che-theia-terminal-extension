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

import { TerminalQuickOpenService } from "./terminal-quick-open"

export const NewRemoteTerminal = {
    id: 'NewRemoteTerminal',
    label: 'New terminal'
}
@injectable()
export class TheiaDockerExecTerminalPluginCommandContribution implements CommandContribution {

    constructor(
        @inject(TerminalQuickOpenService) private readonly terminalQuickOpen: TerminalQuickOpenService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(NewRemoteTerminal, {
            execute: () => { 
                this.terminalQuickOpen.openTerminal();
            }
        });
    }
}

@injectable()
export class TheiaDockerExecTerminalPluginMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE, {
            commandId: NewRemoteTerminal.id,
            label: NewRemoteTerminal.label
        });
    }
}
