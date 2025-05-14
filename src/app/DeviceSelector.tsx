/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import {
    AppDispatch,
    Device,
    DeviceSelector,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import {
    DeviceTraits,
    NrfutilDeviceLib,
} from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';

import {
    clearConfig,
    clearDefaultConfig,
    clearHardwareConfig,
    clearPmicConfig,
    setHardwareConfig,
} from '../features/Configuration/boardControllerConfigSlice';
import { wrapHardwareConfig } from '../features/Configuration/hardwareConfiguration';
import {
    clearBoardControllerFirmwareVersion,
    clearBoardRevision,
    setBoardControllerFirmwareVersion,
    setBoardRevision,
} from '../features/Device/deviceSlice';

/**
 * Configures which device types to show in the device selector.
 * The config format is described on
 * https://github.com/NordicSemiconductor/nrf-device-lister-js.
 */
const deviceListing: DeviceTraits = {
    nordicUsb: true,
    serialPorts: true,
    jlink: true,
};

/**
 * Configures how devices should be set up (programmed) when selected.
 * The config format is described on
 * https://github.com/NordicSemiconductor/nrf-device-setup-js.
 *
 * Currently no setup is done. If you need one, set deviceSetup appropriately
 * and add it in mapState below.
 *
 * To refer to files provided by your app, use getAppFile exported by
 * pc-nrfconnect-shared
 */
// const deviceSetup = {
// dfu: {},
// jprog: {},
// };

/*
 * Note that the callbacks releaseCurrentDevice and onDeviceIsReady
 * are only invoked, if a deviceSetup is defined.
 */
const onDeviceSelected = (dispatch: AppDispatch) => async (device: Device) => {
    await getBoardControllerVersion(dispatch, device); // FIXME: Remove this when onDeviceIsReady() is called
    await readCurrentBoardControllerConfig(dispatch, device); // FIXME: Remove this when onDeviceIsReady() is called
};

const onDeviceIsReady = (dispatch: AppDispatch) => (device: Device) => {
    getBoardControllerVersion(dispatch, device);
};

const getBoardControllerVersion = async (
    dispatch: AppDispatch,
    device: Device
) => {
    const bcVersion = await NrfutilDeviceLib.getBoardControllerVersion(device);
    console.log('Got device state %o', bcVersion);
    dispatch(
        setBoardRevision({
            major: bcVersion.major_ver,
            minor: bcVersion.minor_ver,
            patch: bcVersion.patch_ver,
        })
    );
    dispatch(setBoardControllerFirmwareVersion(bcVersion.bc_fw_ver));
};

export const readCurrentBoardControllerConfig = async (
    dispatch: AppDispatch,
    device: Device
) => {
    if (!device) {
        return;
    }
    const currentConfig = await NrfutilDeviceLib.getBoardControllerConfig(
        device
    );
    console.log('Read current config %o', currentConfig);
    const wrappedConfig = wrapHardwareConfig(currentConfig);
    dispatch(setHardwareConfig({ hardwareConfig: wrappedConfig }));
};

const onDeviceDeselected = (dispatch: AppDispatch) => () => {
    dispatch(clearBoardRevision());
    dispatch(clearBoardControllerFirmwareVersion());
    dispatch(clearConfig());
    dispatch(clearPmicConfig());
    dispatch(clearHardwareConfig());
    dispatch(clearDefaultConfig());
};

export default () => {
    const dispatch = useDispatch();

    return (
        <DeviceSelector
            deviceListing={deviceListing}
            // deviceSetup={deviceSetup}
            onDeviceSelected={onDeviceSelected(dispatch)}
            // releaseCurrentDevice={releaseCurrentDevice}
            onDeviceIsReady={onDeviceIsReady(dispatch)}
            onDeviceDeselected={onDeviceDeselected(dispatch)}
        />
    );
};
