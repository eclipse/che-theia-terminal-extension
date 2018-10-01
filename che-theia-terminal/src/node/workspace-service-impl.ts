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
import WorkspaceClient, { IRemoteAPI, IWorkspace, IServer, IMachine, IRequestError, IRestAPIConfig } from '@eclipse-che/workspace-client';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { CHEWorkspaceService } from "../common/workspace-service";
import { TERMINAL_SERVER_TYPE } from "../browser/server-definition/base-terminal-protocol";

const TYPE: string = "type";
const EDITOR_SERVER_TYPE: string = "ide";

@injectable()
export class CHEWorkspaceServiceImpl implements CHEWorkspaceService {

    private api: IRemoteAPI;

    constructor(@inject(EnvVariablesServer) protected readonly baseEnvVariablesServer: EnvVariablesServer) {
    }

    public async getMachineList(): Promise<{ [attrName: string]: IMachine }> {
        const machineNames: { [attrName: string]: IMachine } = {};
        const workspaceId = await this.getWorkspaceId();
        const restClient = await this.getRemoteApi();
        if (!workspaceId || !restClient) {
            return machineNames;
        }
        return new Promise<{ [attrName: string]: IMachine }>((resolve, reject) => {
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
                });
        });
    }

    public async findTerminalServer(): Promise<IServer | undefined> {
        const machines = await this.getMachineList();

        for (const machineName in machines) {
            if (!machines.hasOwnProperty(machineName)) {
                continue;
            }
            const machine = machines[machineName];
            if (machine) {
                const servers = machine.servers;
                for (const serverName in servers) {
                    if (!servers.hasOwnProperty(serverName)) {
                        continue;
                    }
                    const attrs = servers[serverName].attributes;
                    if (attrs) {
                        for (const attrName in attrs) {
                            if (attrName === TYPE && attrs[attrName] === TERMINAL_SERVER_TYPE) {
                                return servers[serverName];
                            }
                        }
                    }
                }
            }

        }

        return undefined;
    }

    public async findEditorMachineName(): Promise<string | undefined> {
        const machines = await this.getMachineList();

        for (const machineName in machines) {
            if (!machines.hasOwnProperty(machineName)) {
                continue;
            }
            const machine = machines[machineName];
            if (machine) {
                const servers = machine.servers;
                for (const serverName in servers) {
                    if (!servers.hasOwnProperty(serverName)) {
                        continue;
                    }
                    const attrs = servers[serverName].attributes;
                    if (attrs) {
                        for (const attrName in attrs) {
                            if (attrName === TYPE && attrs[attrName] === EDITOR_SERVER_TYPE) {
                                return machineName;
                            }
                        }
                    }
                }
            }
        }

        return undefined;
    }

    public async getWorkspaceId(): Promise<string | undefined> {
        return await this.baseEnvVariablesServer.getValue("CHE_WORKSPACE_ID").then(v => v ? v.value : undefined);
    }

    public async getWsMasterApiEndPoint(): Promise<string | undefined> {
        return await this.baseEnvVariablesServer.getValue("CHE_API_EXTERNAL").then(v => v ? v.value : undefined);
    }

    private async getMachineToken(): Promise<string> {
        return await this.baseEnvVariablesServer.getValue("CHE_MACHINE_TOKEN").then(v => v ? v.value : undefined);
    }

    private async getRemoteApi(): Promise<IRemoteAPI> {
        if (!this.api) {
            const machineToken = await this.getMachineToken();
            const baseUrl = await this.getWsMasterApiEndPoint();
            const restConfig: IRestAPIConfig = {baseUrl: baseUrl, headers: {}};

            if (machineToken) {
                restConfig.headers['Authorization'] = "Bearer " + machineToken;
            }

            this.api = WorkspaceClient.getRestApi(restConfig);
        }
        return this.api;
    }
}
