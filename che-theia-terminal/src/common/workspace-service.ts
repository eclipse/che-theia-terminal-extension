/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { IMachine, IServer } from '@eclipse-che/workspace-client';

export const cheWorkspaceServicePath = '/services/che-workspace-service';

export const CHEWorkspaceService = Symbol('CHEWorkspaceService');
export interface CHEWorkspaceService {

    getMachineList(): Promise<{ [attrName: string]: IMachine }>;

    findTerminalServer(): Promise<IServer | undefined>;

    findEditorMachineName(): Promise<string | undefined>

    getWorkspaceId(): Promise<string | undefined>;

    getWsMasterApiEndPoint(): Promise<string | undefined>;
}
