# Board Configurator app

[![Build Status](https://dev.azure.com/NordicSemiconductor/Wayland/_apis/build/status/pc-nrfconnect-boilerplate?branchName=master)](https://dev.azure.com/NordicSemiconductor/Wayland/_build/latest?definitionId=10&branchName=master)
[![License](https://img.shields.io/badge/license-Modified%20BSD%20License-blue.svg)](LICENSE)

The Board Configurator app in nRF Connect for Desktop lets you update the
configuration of the board controller on some Development Kits from Nordic
Semiconductor. The board controller is the firmware running on the Interface MCU
that controls the behavior of the DK.

**Note:** Currently, the Board Configurator app is experimental. This means that
the application is incomplete in functionality and will change in the future.

![screenshot](resources/screenshot.gif)

## Installation

The Board Configurator app is installed from nRF Connect from Desktop. For
detailed steps, see
[Installing nRF Connect for Desktop apps](https://docs.nordicsemi.com/bundle/nrf-connect-desktop/page/installing_apps.html)
in the nRF Connect from Desktop documentation.

## Documentation

Read the
[Board Configurator app](https://docs.nordicsemi.com/bundle/nrf-connect-board-configurator/page/index.html)
official documentation.

## Development

See the
[app development](https://nordicsemiconductor.github.io/pc-nrfconnect-docs/)
pages for details on how to develop apps for the nRF Connect for Desktop
framework.

## Feedback

Please report issues on the [DevZone](https://devzone.nordicsemi.com) portal.

## Contributing

See the
[infos on contributing](https://nordicsemiconductor.github.io/pc-nrfconnect-docs/contributing)
for details.

## License

See the [LICENSE](LICENSE) file for details.


# Notes
hwfc - hardware flow control

HOW TO ADD NEW BOARDS??
Adding new board - pay attention to the polarity of the pins 

Reading: hardware schematics & device tree files
Source: https://nordicsemi.atlassian.net/wiki/spaces/APPS/pages/67295432/nRF5340+Board+Controller+-+1.6+nRF5340+Pinout

Board controller project lead - Bjorn Spokeli 

BC App = docs for the end users

getBoardDefinition() switch - should be more sophisticated 

-----
Plan:
- to have board definition file selection automatic - have getBoardDefinition() file automatic, like to have list of board revisions in the file
- update board configuarator FW, but use case is small; also we don't know what FW will be correct for the specific board & revision
- 

TODO: ask Ingar why not 1.x release






