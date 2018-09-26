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
import {
    CommandContribution,
    CommandRegistry, CompositeMenuNode,
    MAIN_MENU_BAR,
    MenuContribution,
    MenuModelRegistry
} from "@theia/core/lib/common";
import { CommonMenus, FrontendApplicationContribution, FrontendApplication, ApplicationShell } from "@theia/core/lib/browser";

import { TerminalQuickOpenService } from "./terminal-quick-open";
import {TerminalApiEndPointProvider} from "../server-definition/terminal-proxy-creator";
import { MenuBar as MenuBarWidget } from '@phosphor/widgets';
import {BrowserMainMenuFactory} from "@theia/core/lib/browser/menu/browser-menu-plugin";

export const NewRemoteTerminal = {
    id: 'terminal:new',
    label: 'New terminal'
};

@injectable()
export class TheiaDockerExecTerminalPluginContribution implements CommandContribution, MenuContribution, FrontendApplicationContribution {

    @inject(TerminalQuickOpenService)
    private readonly terminalQuickOpen: TerminalQuickOpenService;

    @inject("TerminalApiEndPointProvider")
    protected readonly termApiEndPointProvider: TerminalApiEndPointProvider;

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    @inject(BrowserMainMenuFactory)
    protected readonly factory: BrowserMainMenuFactory;

    @inject(CommandRegistry)
    protected readonly registry: CommandRegistry;

    private readonly mainMenuId = 'theia:menubar';
    private readonly fileMenuId = '1_file';

    async onStart(app: FrontendApplication) {
        // app.shell.
    }

    registerCommands(registry: CommandRegistry): void {
        console.log("commands ", Array.from(this.registry.commands).filter(elem => elem.id === 'terminal:new'));
        console.log("--------------------");

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

            console.log("commands ", Array.from(this.registry.commands).filter(elem => elem.id === 'terminal:new'));
            console.log("--------------------");

            menus.registerMenuAction(CommonMenus.FILE, {
                commandId: NewRemoteTerminal.id,
                // label: NewRemoteTerminal.label
            });

            console.log("commands ", Array.from(this.registry.commands).filter(elem => elem.id === 'terminal:new'));
            console.log("--------------------");

            /*
             TODO: We applied menu contribution the menu model registry by 'menus.registerMenuAction' above,
             but after that Theia doesn't redraw menu widget, because Theia already rendered ui with older data.
             So follow we do workaround:
             find main menu bar widget and do fource update submenu 'File'. Upstream issue:
            */
            const widgets = this.shell.getWidgets('top');
            console.log(widgets, " ", widgets.length);

            let mainMenuBar;
            for (let index = 0; index < widgets.length; index++) {
                const widget = widgets[index];
                if (widget.id === this.mainMenuId) {
                    mainMenuBar = widget;
                }
            }

            if (mainMenuBar && mainMenuBar instanceof MenuBarWidget) {
                // (widget as MenuBarWidget).update();
                mainMenuBar.menus.forEach(menu => {
                    console.log(menu);
                    if ((menu as any).menu.id === this.fileMenuId) {
                        console.log("What");
                        (menu as any).aboutToShow();
                        console.log((menu as any).menu);
                    }
                });

                // mainMenuBar.update(); todo maybe it should work?
                // this.shell.update();

                // update subemenu file
                // (widget as any).aboutToShow();
                const fileMenu = menus.getMenu(CommonMenus.FILE);
                console.log(fileMenu);

                // mainMenuBar.dispose();
                // const newMenu = this.factory.createMenuBar();
                // this.shell.addWidget(newMenu, { area: 'top' });
                // this.shell.update();

            }
            // menu.update();
        });
    }
}
