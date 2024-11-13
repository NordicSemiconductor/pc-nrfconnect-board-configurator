# Troubleshooting

These troubleshooting instructions can help you fix issues you might encounter when working with the {{app_name}}.

Remember to check the [Log](./overview.md#log) panel whenever you encounter a problem.
To view more detailed information, use the **Open log file** option to open the current log file in a text editor.

The {{app_name}} shares several of the troubleshooting issues and suggested solutions with the [Bluetooth® Low Energy app](https://docs.nordicsemi.com/bundle/nrf-connect-ble/page/index.html) app. Refer to the [troubleshooting section in the Bluetooth® Low Energy app user guide](https://docs.nordicsemi.com/bundle/nrf-connect-ble/page/troubleshooting.html) for the list of issues.

## Unable to configure a device

Verify that you are trying to program a [supported device](./index.md#supported-devices).

## Restarting the {{app_name}}

You can restart the {{app_name}} by pressing Ctrl+R in Windows and command+R in macOS. A restart might be required in the following situations:

- A device is reset while it is connected to the {{app_name}}.</br>
  In this case, you may not see all COM ports in the drop-down list while selecting the device in the app.
- Other errors occur.

## Unable to perform DFU or work with samples on nRF54H20

Verify that you have enabled the **External memory** chip option in the [**Configuration**](overview.md#configuration-tab) tab.
