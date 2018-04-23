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
