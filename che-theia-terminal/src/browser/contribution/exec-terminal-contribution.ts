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
import { CommandRegistry, MenuModelRegistry } from "@theia/core/lib/common";
import { CommonMenus, ApplicationShell, WidgetManager, KeybindingRegistry } from "@theia/core/lib/browser";

import { TerminalQuickOpenService } from "./terminal-quick-open";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { TerminalFrontendContribution } from "@theia/terminal/lib/browser/terminal-frontend-contribution";

export const NewMultiMachineTerminal = {
    id: 'NewRemoteTerminal',
    label: 'Open new multi-machine terminal'
};

@injectable()
export class ExecTerminalFrontendContribution extends TerminalFrontendContribution {

    constructor(
        @inject(ApplicationShell) protected readonly shell: ApplicationShell,
        @inject(WidgetManager) protected readonly widgetManager: WidgetManager,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(TerminalQuickOpenService) private readonly terminalQuickOpen: TerminalQuickOpenService,
    ) {
        super(shell, widgetManager, workspaceService);
    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(NewMultiMachineTerminal, {
            execute: () => {
                this.terminalQuickOpen.openTerminal();
            }
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE, {
            commandId: NewMultiMachineTerminal.id,
            label: NewMultiMachineTerminal.label
        });
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
        keybindings.registerKeybinding({
            command: NewMultiMachineTerminal.id,
            keybinding: 'ctrl+`'
        });
    }
}
