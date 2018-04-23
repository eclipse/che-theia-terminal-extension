package main

import (
	"flag"
	jsonRpcApi "github.com/AndrienkoAleksandr/machine-exec/api/jsonrpc"
	restApi "github.com/AndrienkoAleksandr/machine-exec/api/rest"
	"github.com/AndrienkoAleksandr/machine-exec/api/websocket"
	"github.com/eclipse/che/agents/go-agents/core/jsonrpc"
	"github.com/eclipse/che/agents/go-agents/core/jsonrpc/jsonrpcws"
	"github.com/eclipse/che/agents/go-agents/core/rest"
	"net/http"
	"time"
)

var (
	url, filesPath string
)

func init() {
	flag.StringVar(&url, "url", ":4444", "Host:Port address. ")
	flag.StringVar(&filesPath, "client", "./client", "Path to the files to serve them.")
}

func main() {
	flag.Parse()

	//todo apply exec-machine context

	appRoutes := []rest.RoutesGroup{
		restApi.HTTPRoutes,
		{
			Name: "Exec-Machine WebSocket routes",
			Items: []rest.Route{
				{
					Method: "GET",
					Path:   "/connect",
					Name:   "MachineExec api end point(websocket)", // json-rpc
					HandleFunc: func(w http.ResponseWriter, r *http.Request, _ rest.Params) error {
						conn, err := jsonrpcws.Upgrade(w, r)
						if err != nil {
							return err
						}
						tunnel := jsonrpc.NewManagedTunnel(conn)
						tunnel.SayHello()
						return nil
					},
				},
				{
					Method:     "GET",
					Path:       "/attach/:id",
					Name:       "Attach to exec(pure websocket)",
					HandleFunc: websocket.Attach,
				},
			},
		},
	}

	// create json-rpc routs group
	appOpRoutes := []jsonrpc.RoutesGroup{
		jsonRpcApi.RPCRoutes,
	}

	// register routes and http handlers
	baseHandler := rest.NewDefaultRouter(url, appRoutes)
	rest.PrintRoutes(appRoutes)
	jsonrpc.RegRoutesGroups(appOpRoutes)
	jsonrpc.PrintRoutes(appOpRoutes)

	server := &http.Server{
		Handler:      baseHandler,
		Addr:         url,
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	server.ListenAndServe()
}
