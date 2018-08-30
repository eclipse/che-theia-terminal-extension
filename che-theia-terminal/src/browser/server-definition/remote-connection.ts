/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { injectable } from "inversify";
import { WebSocketConnectionProvider } from "@theia/core/lib/browser";

@injectable()
export class RemoteWebSocketConnectionProvider extends WebSocketConnectionProvider {

    constructor() {
        super();
    }

    /**
     * Creates a websocket URL to the current location
     */
    createWebSocketUrl(path: string): string {
        // use the same remote url
        console.log(path);
        return path;
    }
}
