/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { injectable } from 'inversify';
import { TerminalWatcher } from '@theia/terminal/lib/common/terminal-watcher';
import { IBaseTerminalClient, IBaseTerminalExitEvent, IBaseTerminalErrorEvent } from '@theia/terminal/lib/common/base-terminal-protocol';
import { JsonRpcProxy } from '@theia/core';

export const TERMINAL_SERVER_TYPE = 'terminal';
export const CONNECT_TERMINAL_SEGMENT = 'connect';
export const ATTACH_TERMINAL_SEGMENT = 'attach';

export interface MachineIdentifier {
    machineName: string,
    workspaceId: string
}

export interface MachineExec {
    identifier: MachineIdentifier,
    cmd: string[],
    tty: boolean,
    cols: number,
    rows: number,
    id?: number
}

export interface IdParam {
    id: number
}

export interface ResizeParam extends IdParam {
    rows: number,
    cols: number
}

export const RemoteTerminalServer = Symbol('RemoteTerminalServer');
export interface RemoteTerminalServer {
    create(machineExec: MachineExec): Promise<number>;
    check(id: IdParam): Promise<number>;
    resize(resizeParam: ResizeParam): Promise<void>;
}

export const RemoteTerminalServerProxy = Symbol('RemoteTerminalServerProxy');
export type RemoteTerminalServerProxy = JsonRpcProxy<RemoteTerminalServer>;

/**
 * For now this class it's a stub. Real implementation depends on
 * https://github.com/eclipse/che-machine-exec/issues/5
 */
@injectable()
export class RemoteTerminaWatcher extends TerminalWatcher {
    getTerminalClient(): IBaseTerminalClient {
        return {
            onTerminalExitChanged(event: IBaseTerminalExitEvent) {
            },
            onTerminalError(event: IBaseTerminalErrorEvent) {
            }
        };
    }
}
