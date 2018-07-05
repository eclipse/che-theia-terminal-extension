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
import { injectable, inject } from "inversify"
import { QuickOpenService, QuickOpenModel, QuickOpenItem } from '@theia/core/lib/browser/quick-open/';
import { QuickOpenMode, QuickOpenOptions, WidgetManager } from "@theia/core/lib/browser";
import { IBaseEnvVariablesServer } from "env-variables-extension/lib/common/base-env-variables-protocol";
import { TerminalApiEndPointProvider, Workspace } from "../workspace/workspace";
import { REMOTE_TERMINAL_WIDGET_FACTORY_ID, RemoteTerminalWidget, RemoteTerminalWidgetFactoryOptions } from "../terminal-widget/remote-terminal-widget";

@injectable()
export class TerminalQuickOpenService {

    constructor(@inject(QuickOpenService) private readonly quickOpenService: QuickOpenService,
                @inject(WidgetManager) private readonly widgetManager: WidgetManager,
                @inject(IBaseEnvVariablesServer) protected readonly baseEnvVariablesServer: IBaseEnvVariablesServer,
                @inject("TerminalApiEndPointProvider") protected readonly termApiEndPointProvider: TerminalApiEndPointProvider,
                @inject(Workspace) protected readonly workspace: Workspace,
            ) {
    }

    async openTerminal(): Promise<void> {
        const items: QuickOpenItem[] = [];
        const machines = await this.workspace.getListMachines();

        if (machines) {
            for (const machineName in machines) {
                items.push(new NewTerminalItem(machineName, newTermItemFunc => this.createNewTerminal(newTermItemFunc.machineName)));
            }
        }

        this.open(items, "Select machine to create new terminal");
    }

    private getOpts(placeholder: string, fuzzyMatchLabel: boolean = true):QuickOpenOptions {
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
            let workspaceId = <string>await this.baseEnvVariablesServer.getEnvValueByKey("CHE_WORKSPACE_ID");
            const termApiEndPoint = <string>await this.termApiEndPointProvider();

            const widget = <RemoteTerminalWidget>await this.widgetManager.getOrCreateWidget(REMOTE_TERMINAL_WIDGET_FACTORY_ID, <RemoteTerminalWidgetFactoryOptions>{
                created: new Date().toString(),
                machineName: machineName,
                workspaceId: workspaceId,
                endpoint: termApiEndPoint
            });
            widget.start();
        } catch(err) {
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

    get machineName():string {
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
