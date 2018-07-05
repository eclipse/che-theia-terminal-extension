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
    tty:boolean,
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
