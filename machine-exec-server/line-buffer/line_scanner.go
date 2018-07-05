package line_buffer

import (
	"bufio"
	"bytes"
)

type LineScanner struct {
	scanner *bufio.Scanner
}

func (lineScanner LineScanner) Scan() bool {
	return lineScanner.scanner.Scan()
}

func (lineScanner LineScanner) Text() string {
	return lineScanner.scanner.Text()
}

func CreateLineScanner(bts []byte) LineScanner {
	scanner := bufio.NewScanner(bytes.NewReader(bts))
	scanner.Split(scanLinesNoDropCR)

	return LineScanner{scanner}
}

func scanLinesNoDropCR(data []byte, atEOF bool) (advance int, token []byte, err error) {
	if atEOF && len(data) == 0 {
		return 0, nil, nil
	}
	if i := bytes.IndexByte(data, '\n'); i >= 0 {
		return i + 1, data[0 : i+1], nil
	}
	if atEOF {
		return len(data), data, nil
	}

	return 0, nil, nil
}
