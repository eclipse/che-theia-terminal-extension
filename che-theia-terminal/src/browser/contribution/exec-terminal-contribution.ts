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
import { CommonMenus, ApplicationShell, KeybindingRegistry } from "@theia/core/lib/browser";

import { TerminalQuickOpenService } from "./terminal-quick-open";
import { TerminalFrontendContribution } from "@theia/terminal/lib/browser/terminal-frontend-contribution";
import {TerminalApiEndPointProvider} from "../server-definition/terminal-proxy-creator";
import {BrowserMainMenuFactory} from "@theia/core/lib/browser/menu/browser-menu-plugin";
import { MenuBar as MenuBarWidget } from '@phosphor/widgets';

export const NewMultiMachineTerminal = {
    id: 'remote-terminal:new',
    label: 'Open new multi-machine terminal'
};

@injectable()
export class ExecTerminalFrontendContribution extends TerminalFrontendContribution {

    @inject(TerminalQuickOpenService)
    private readonly terminalQuickOpen: TerminalQuickOpenService;

    @inject("TerminalApiEndPointProvider")
    protected readonly termApiEndPointProvider: TerminalApiEndPointProvider;

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    @inject(BrowserMainMenuFactory)
    protected readonly mainMenuFactory: BrowserMainMenuFactory;

    private readonly mainMenuId = 'theia:menubar';

    registerCommands(registry: CommandRegistry): void {
        this.termApiEndPointProvider().then(url => {
            registry.registerCommand(NewMultiMachineTerminal, {
                execute: () => {
                    this.terminalQuickOpen.openTerminal();
                }
            });
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        this.termApiEndPointProvider().then(url => {
            menus.registerMenuAction(CommonMenus.FILE, {
                commandId: NewMultiMachineTerminal.id,
                label: NewMultiMachineTerminal.label
            });

            /*
             TODO: We applied menu contribution to the menu model registry by 'menus.registerMenuAction' above,
             but after that Theia doesn't redraw menu widget, because Theia already rendered ui with older data
             and cached old state.
             So follow we do workaround:
             find main menu bar widget, destroy it and replace by new one widget with the latest changes.
            */
            const widgets = this.shell.getWidgets('top');
            widgets.forEach(widget => {
                if (widget.id === this.mainMenuId && widget instanceof MenuBarWidget) {
                    widget.dispose();
                    const newMenu = this.mainMenuFactory.createMenuBar();
                    this.shell.addWidget(newMenu, { area: 'top' });
                }
            });
        });
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
        this.termApiEndPointProvider().then(() => {
            keybindings.registerKeybinding({
                command: NewMultiMachineTerminal.id,
                keybinding: 'ctrl+`'
            });
        });
    }
}
