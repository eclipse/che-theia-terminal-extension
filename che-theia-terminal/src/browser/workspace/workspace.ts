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
import WorkspaceClient, { IWorkspace, IRequestError, IRemoteAPI, IServer, IMachine } from "@eclipse-che/workspace-client";
import { IBaseEnvVariablesServer } from "env-variables-extension/lib/common/base-env-variables-protocol";
import { TERMINAL_SERVER_TYPE } from "../server-definition/base-terminal-protocol";

const TYPE: string = "type";

export type TerminalApiEndPointProvider = () => Promise<string>;

@injectable()
export class Workspace {

    private api: IRemoteAPI;

    constructor(@inject(IBaseEnvVariablesServer) protected readonly baseEnvVariablesServer: IBaseEnvVariablesServer) {
    }

    public async getListMachines(): Promise<{ [attrName: string]: IMachine }> {
        let machineNames: { [attrName: string]: IMachine } = {};
        const workspaceId = await this.getWorkspaceId();
        const restClient = await this.getRemoteApi();
        if (!workspaceId || !restClient) {
            return machineNames;
        }
        return new Promise<{ [attrName: string]: IMachine }>( (resolve, reject) => {
            restClient.getById<IWorkspace>(workspaceId)
            .then((workspace: IWorkspace) => {
                if (workspace.runtime) {
                    resolve(workspace.runtime.machines);
                    return;
                }
                resolve({});
            })
            .catch((reason: IRequestError) => {
                console.log("Failed to get workspace by ID: ", workspaceId, "Status code: ", reason.status);
                reject(reason.message);
            })
        });
    }

    public async findTerminalServer(): Promise<IServer> {
        const machines = await this.getListMachines();

        for (const machineName in machines) {
            const servers = machines[machineName].servers;
            for (const serverName in servers) {
                const attrs = servers[serverName].attributes;
                if (attrs) {
                    for (const attrName in attrs) {
                        if (attrName == TYPE && attrs[attrName] == TERMINAL_SERVER_TYPE) {
                            return servers[serverName];
                        }
                    }
                }
            }
        }

        return null;
    }

    public async getWorkspaceId(): Promise<string> {
        return await this.baseEnvVariablesServer.getEnvValueByKey("CHE_WORKSPACE_ID");
    }

    public async getWsMasterApiEndPoint(): Promise<string> {
        return await this.baseEnvVariablesServer.getEnvValueByKey("CHE_API_EXTERNAL");
    }

    private async getRemoteApi(): Promise<IRemoteAPI> {
        if (!this.api) {
            const baseUrl = await this.getWsMasterApiEndPoint();
            this.api = WorkspaceClient.getRestApi({
                baseUrl: baseUrl
            });
        }
        return this.api;
    }
}
