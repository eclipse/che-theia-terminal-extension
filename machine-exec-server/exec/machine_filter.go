package exec

import (
	"errors"
	"github.com/eclipse/che-theia-terminal-plugin/machine-exec-server/api/model"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"golang.org/x/net/context"
)

const (
	WsId        = "org.eclipse.che.workspace.id"
	MachineName = "org.eclipse.che.machine.name"
	Label       = "label"
)

// Filter container by labels: wsId and machineName.
func findMachineContainer(identifier *model.MachineIdentifier) (*types.Container, error) {
	containers, err := cli.ContainerList(context.Background(), types.ContainerListOptions{
		Filters: createMachineFilter(identifier),
	})
	if err != nil {
		return nil, err
	}

	if len(containers) > 1 {
		return nil, errors.New("filter found more than one machine")
	}
	if len(containers) == 0 {
		return nil, errors.New("machine was not found")
	}

	return &containers[0], nil
}

func createMachineFilter(identifier *model.MachineIdentifier) filters.Args {
	filterArgs := filters.NewArgs()
	filterArgs.Add(Label, WsId+"="+identifier.WsId)
	filterArgs.Add(Label, MachineName+"="+identifier.MachineName)

	return filterArgs
}
