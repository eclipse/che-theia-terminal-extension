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
import { QuickOpenService, QuickOpenModel, QuickOpenItem } from '@theia/core/lib/browser/quick-open/';
import { QuickOpenMode, QuickOpenOptions, WidgetManager } from "@theia/core/lib/browser";
import { REMOTE_TERMINAL_WIDGET_FACTORY_ID, RemoteTerminalWidget, RemoteTerminalWidgetFactoryOptions } from "../terminal-widget/remote-terminal-widget";
import { CHEWorkspaceService } from "../../common/workspace-service";

@injectable()
export class TerminalQuickOpenService {

    constructor(@inject(QuickOpenService) private readonly quickOpenService: QuickOpenService,
        @inject(WidgetManager) private readonly widgetManager: WidgetManager,
        @inject(CHEWorkspaceService) protected readonly workspaceService: CHEWorkspaceService,
    ) {
    }

    async openTerminal(options: RemoteTerminalWidgetFactoryOptions): Promise<void> {
        const items: QuickOpenItem[] = [];
        const machines = await this.workspaceService.getListMachines();

        if (machines) {
            for (const machineName in machines) {
                if (!machines.hasOwnProperty(machineName)) {
                    continue;
                }
                options.machineName = machineName;
                items.push(new NewTerminalItem(machineName, () => this.createNewTerminal(options)));
            }
        }

        this.open(items, "Select machine to create new terminal");
    }

    private getOpts(placeholder: string, fuzzyMatchLabel: boolean = true): QuickOpenOptions {
        return QuickOpenOptions.resolve({
            placeholder,
            fuzzyMatchLabel,
            fuzzySort: false
        });
    }

    private open(items: QuickOpenItem | QuickOpenItem[], placeholder: string): void {
        this.quickOpenService.open(this.getModel(Array.isArray(items) ? items : [items]), this.getOpts(placeholder));
    }

    private getModel(items: QuickOpenItem | QuickOpenItem[]): QuickOpenModel {
        return {
            onType(lookFor: string, acceptor: (items: QuickOpenItem[]) => void): void {
                acceptor(Array.isArray(items) ? items : [items]);
            }
        };
    }

    protected async createNewTerminal(options: RemoteTerminalWidgetFactoryOptions): Promise<void> {
        try {
            options.created = new Date().toString();
            const widget = <RemoteTerminalWidget>await this.widgetManager.getOrCreateWidget(REMOTE_TERMINAL_WIDGET_FACTORY_ID, options);
            widget.start();
        } catch (err) {
            console.error("Failed to create terminal widget. Cause: ", err);
        }
    }
}

export class NewTerminalItem extends QuickOpenItem {

    constructor(
        protected readonly _machineName: string,
        private readonly execute: (item: NewTerminalItem) => void
    ) {
        super({
            label: _machineName,
        });
    }

    get machineName(): string {
        return this._machineName;
    }

    run(mode: QuickOpenMode): boolean {
        if (mode !== QuickOpenMode.OPEN) {
            return false;
        }
        this.execute(this);

        return true;
    }
}
