/*
 * Copyright (c) 2018-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
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