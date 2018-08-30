/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

// todo apply context to the server side

export const TERMINAL_SERVER_TYPE = "terminal";
export const CONNECT_TERMINAL_SEGMENT = "/connect";
export const ATTACH_TERMINAL_SEGMENT = "/attach";

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

export const IBaseTerminalServer = Symbol('IBaseTerminalServer');
export interface IBaseTerminalServer {
    create(machineExec: MachineExec): Promise<number>;
    check(id: IdParam): Promise<number>;
    resize(resizeParam: ResizeParam): Promise<void>;
}
