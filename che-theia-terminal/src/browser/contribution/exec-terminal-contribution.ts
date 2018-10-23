/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { injectable, inject } from 'inversify';
import { CommandRegistry, MenuModelRegistry } from '@theia/core/lib/common';
import { CommonMenus, ApplicationShell, KeybindingRegistry, Key, KeyCode, KeyModifier } from '@theia/core/lib/browser';

import { TerminalQuickOpenService } from './terminal-quick-open';
import { TerminalFrontendContribution } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { TerminalApiEndPointProvider } from '../server-definition/terminal-proxy-creator';
import { BrowserMainMenuFactory } from '@theia/core/lib/browser/menu/browser-menu-plugin';
import { MenuBar as MenuBarWidget } from '@phosphor/widgets';
import { TerminalKeybindingContext } from './keybinding-context';

export const NewMultiMachineTerminal = {
    id: 'remote-terminal:new',
    label: 'Open new multi-machine terminal'
};

@injectable()
export class ExecTerminalFrontendContribution extends TerminalFrontendContribution {

    @inject(TerminalQuickOpenService)
    private readonly terminalQuickOpen: TerminalQuickOpenService;

    @inject('TerminalApiEndPointProvider')
    protected readonly termApiEndPointProvider: TerminalApiEndPointProvider;

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    @inject(BrowserMainMenuFactory)
    protected readonly mainMenuFactory: BrowserMainMenuFactory;

    private readonly mainMenuId = 'theia:menubar';

    async registerCommands(registry: CommandRegistry) {
        const serverUrl = <string | undefined> await this.termApiEndPointProvider();
        if (serverUrl) {
            registry.registerCommand(NewMultiMachineTerminal, {
                execute: () => {
                    this.terminalQuickOpen.displayListMachines();
                }
            });
        } else {
            super.registerCommands(registry);
        }
    }

    async registerMenus(menus: MenuModelRegistry) {
        const serverUrl = <string | undefined> await this.termApiEndPointProvider();
        if (serverUrl) {
            menus.registerMenuAction(CommonMenus.FILE, {
                commandId: NewMultiMachineTerminal.id,
                label: NewMultiMachineTerminal.label
            });
        } else {
            super.registerMenus(menus);
        }

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
    }

    async registerKeybindings(registry: KeybindingRegistry) {
        const serverUrl = <string | undefined> await this.termApiEndPointProvider();
        if (serverUrl) {
            registry.registerKeybinding({
                command: NewMultiMachineTerminal.id,
                keybinding: 'ctrl+`'
            });
            this.registerTerminalKeybindings(registry);
        } else {
            super.registerKeybindings(registry);
        }
    }

    private registerTerminalKeybindings(registry: KeybindingRegistry) {
        // Ctrl + a-z
        this.registerRangeKeyBindings(registry, [KeyModifier.CTRL], Key.KEY_A, 25, 'Key');
        // Alt + a-z
        this.registerRangeKeyBindings(registry, [KeyModifier.Alt], Key.KEY_A, 25, 'Key');
        // Ctrl 0-9
        this.registerRangeKeyBindings(registry, [KeyModifier.CTRL], Key.DIGIT0, 9, 'Digit');
        // Alt 0-9
        this.registerRangeKeyBindings(registry, [KeyModifier.Alt], Key.DIGIT0, 9, 'Digit');

        this.registerKeyBinding(registry, [KeyModifier.CTRL], Key.SPACE);
        this.registerKeyBinding(registry, [KeyModifier.CTRL], Key.BRACKET_LEFT);
        this.registerKeyBinding(registry, [KeyModifier.CTRL], Key.BRACKET_RIGHT);
        this.registerKeyBinding(registry, [KeyModifier.CTRL], Key.BACKSLASH);
        this.registerKeyBinding(registry, [KeyModifier.Alt], Key.BACKQUOTE);
    }

    private registerRangeKeyBindings(registry: KeybindingRegistry, keyModifiers: KeyModifier[], startKey: Key, offSet: number, codePrefix: string) {
        for (let i = 0; i < offSet + 1; i++) {
            const keyCode = startKey.keyCode + i;
            const key = {
                keyCode: keyCode,
                code: codePrefix + String.fromCharCode(keyCode)
            };
            this.registerKeyBinding(registry, keyModifiers, key);
        }
    }

    private registerKeyBinding(registry: KeybindingRegistry, keyModifiers: KeyModifier[], key: Key) {
        const keybinding = KeyCode.createKeyCode({ first: key, modifiers: keyModifiers }).toString();
        registry.registerKeybinding({
            command: KeybindingRegistry.PASSTHROUGH_PSEUDO_COMMAND,
            keybinding: keybinding,
            context: TerminalKeybindingContext.contextId
        });
    }
}
