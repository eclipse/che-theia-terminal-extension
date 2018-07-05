package jsonrpc

import (
	"fmt"
	"github.com/eclipse/che-theia-terminal-plugin/machine-exec-server/api/model"
	execManager "github.com/eclipse/che-theia-terminal-plugin/machine-exec-server/exec"
	"github.com/eclipse/che/agents/go-agents/core/jsonrpc"
	"strconv"
)

type IdParam struct {
	Id int `json:"id"`
}

type OperationResult struct {
	Id   int    `json:"id"`
	Text string `json:"text"`
}

type ResizeParam struct {
	Id   int  `json:"id"`
	Cols uint `json:"cols"`
	Rows uint `json:"rows"`
}

func jsonRpcCreateExec(_ *jsonrpc.Tunnel, params interface{}, t jsonrpc.RespTransmitter) {
	machineExec := params.(*model.MachineExec)

	id, err := execManager.Create(machineExec)
	if err != nil {
		t.SendError(jsonrpc.NewArgsError(err))
	}

	t.Send(id)
}

func jsonRpcCheckExec(_ *jsonrpc.Tunnel, params interface{}, t jsonrpc.RespTransmitter) {
	idParam := params.(*IdParam)

	id, err := execManager.Check(idParam.Id)
	if err != nil {
		t.SendError(jsonrpc.NewArgsError(err))
	}

	t.Send(id)
}

func jsonRpcResizeExec(_ *jsonrpc.Tunnel, params interface{}) (interface{}, error) {
	resizeParam := params.(*ResizeParam)

	if err := execManager.Resize(resizeParam.Id, resizeParam.Cols, resizeParam.Rows); err != nil {
		return nil, jsonrpc.NewArgsError(err)
	}
	fmt.Println("Resize with json RPC!")

	return &OperationResult{
		Id: resizeParam.Id, Text: "Exec with id " + strconv.Itoa(resizeParam.Id) + "  was successfully resized",
	}, nil
}
