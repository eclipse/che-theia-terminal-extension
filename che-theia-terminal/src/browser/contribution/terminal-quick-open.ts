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
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { REMOTE_TERMINAL_WIDGET_FACTORY_ID, RemoteTerminalWidget, RemoteTerminalWidgetFactoryOptions } from "../terminal-widget/remote-terminal-widget";
import {CHEWorkspaceService} from "../../common/workspace-service";
import {TerminalApiEndPointProvider} from "../server-definition/terminal-proxy-creator";

@injectable()
export class TerminalQuickOpenService {

    constructor(@inject(QuickOpenService) private readonly quickOpenService: QuickOpenService,
        @inject(WidgetManager) private readonly widgetManager: WidgetManager,
        @inject(EnvVariablesServer) protected readonly baseEnvVariablesServer: EnvVariablesServer,
        @inject("TerminalApiEndPointProvider") protected readonly termApiEndPointProvider: TerminalApiEndPointProvider,
        @inject(CHEWorkspaceService) protected readonly workspaceService: CHEWorkspaceService,
    ) {
    }

    async openTerminal(): Promise<void> {
        const items: QuickOpenItem[] = [];
        const machines = await this.workspaceService.getMachineList();

        if (machines) {
            for (const machineName in machines) {
                if (!machines.hasOwnProperty(machineName)) {
                    continue;
                }
                items.push(new NewTerminalItem(machineName, newTermItemFunc => this.createNewTerminal(newTermItemFunc.machineName)));
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

    protected async createNewTerminal(machineName: string): Promise<void> {
        try {
            const workspaceId = <string>await this.baseEnvVariablesServer.getValue("CHE_WORKSPACE_ID").then(v => v ? v.value : undefined);
            const termApiEndPoint = <string>await this.termApiEndPointProvider();

            const widget = <RemoteTerminalWidget>await this.widgetManager.getOrCreateWidget(REMOTE_TERMINAL_WIDGET_FACTORY_ID, <RemoteTerminalWidgetFactoryOptions>{
                created: new Date().toString(),
                machineName: machineName,
                workspaceId: workspaceId,
                endpoint: termApiEndPoint
            });
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
