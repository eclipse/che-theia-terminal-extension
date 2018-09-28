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
import { RemoteWebSocketConnectionProvider } from "./remote-connection";
import { IBaseTerminalServer, CONNECT_TERMINAL_SEGMENT } from "./base-terminal-protocol";

export type TerminalApiEndPointProvider = () => Promise<string>;

export type TerminalProxyCreatorProvider = () => Promise<TerminalProxyCreator>;

@injectable()
export class TerminalProxyCreator {

    private server: IBaseTerminalServer;

    constructor(@inject(RemoteWebSocketConnectionProvider) protected readonly connProvider: RemoteWebSocketConnectionProvider,
                @inject("term-api-end-point") protected readonly apiEndPoint: string,
            ) {
    }

    create(): IBaseTerminalServer  {
        if (!this.server) {
            this.server = this.connProvider.createProxy<IBaseTerminalServer>(this.apiEndPoint + CONNECT_TERMINAL_SEGMENT);
        }
        return this.server;
    }
}
