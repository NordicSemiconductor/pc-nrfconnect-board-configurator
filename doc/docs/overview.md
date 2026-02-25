# Overview and user interface

After starting the Board Configurator app, the main application window is displayed.

![Board Configurator app window](./screenshots/board_configurator_overview.png "Board Configurator app window")

## Common interface

This app uses the nRF Connect for Desktop UI framework. Shared UI elements such as **Select device**, **About** tab, and **Log** panel are described in the [Common user interface](https://docs.nordicsemi.com/bundle/nrf-connect-desktop/page/common_interface.html) documentation.

The available options and information change after you select a device.

## Actions

When you select a device, the following actions become available in the side panel:

- **Write config** - Writes the selected configurations to the development kit, overwriting the defaults.

    !!! note "Note"
         When you have unwritten changes to the board configuration, a blue dot appears next to the **Write config** button.

          ![Blue dot indicating unwritten changes](./screenshots/board_configurator_unwritten_config.png "Blue dot indicating unwritten changes")

- **Load default config** - Loads the default configuration settings into the application UI for the selected device. It does not write anything to the development kit.

## Board controller info

This side panel area lists advanced information about the board controller configuration:

* **DK Hardware Revision** - Version of the selected device.
* **Board Controller FW version** - Version of the Interface MCU firmware that you are going to [configure](updating.md).
* **Pin Configuration** - List of available GPIO pins, with their respective pin number. Depending on the connected device and its hardware design, different pins are connected to different features.

    !!! note "Note"
        Some of the pins on the list are inverted (active low). This is indicated by the forward slash (`/`). Enabling such pins might disable a setting in the **Configuration** tab, and vice-versa. For example, disabling **Software Debugger** on the nRF9161 DK will enable the `swd-control` pin in the **Pin Configuration**.

* **PMIC Configuration** - List of the BUCK output ports available for configuration. These correspond to the **nPM VUOT** settings in the **Configuration** tab.
* **Show Config JSON** - Click to open the JSON array that lets you review the configuration sent to the board controller. You can copy the configuration to use it in [nRF Util](https://docs.nordicsemi.com/bundle/nrfutil/page/README.html) using the `nrfutil device x-execute-batch` or `nrfutil device x-execute` commands.

## Configuration tab

In the **Configuration** tab, you can see the options that you can [configure](updating.md) for the selected development kit.

![Board Configurator app configuration tab](./screenshots/board_configurator_connected.png "Board Configurator app configuration tab")
