package exec

import (
	"errors"
	"github.com/AndrienkoAleksandr/machine-exec/api/model"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"golang.org/x/net/context"
)

const (
	WsIdLabel        = "org.eclipse.che.workspace.id"
	MachineNameLabel = "org.eclipse.che.machine.name"
	FilterLabelArg   = "label"
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
	wsIdCondition := WsIdLabel + "=" + identifier.WsId
	machineNameCondition := MachineNameLabel + "=" + identifier.MachineName

	wsfIdFilterArg := filters.Arg(FilterLabelArg, wsIdCondition)
	machineNameFilterArg := filters.Arg(FilterLabelArg, machineNameCondition)

	return filters.NewArgs(wsfIdFilterArg, machineNameFilterArg)
}
