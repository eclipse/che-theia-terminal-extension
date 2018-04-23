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

import { injectable, inject } from "inversify";
import { RemoteWebSocketConnectionProvider } from "./remote-connection";
import { IBaseTerminalServer, CONNECT_TERMINAL_SEGMENT } from "./base-terminal-protocol";

export type TerminalProxyCreatorProvider = () => Promise<TerminalProxyCreator>;

@injectable()
export class TerminalProxyCreator {

    private server: IBaseTerminalServer;

    constructor(@inject(RemoteWebSocketConnectionProvider) protected readonly connProvider :RemoteWebSocketConnectionProvider,
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
