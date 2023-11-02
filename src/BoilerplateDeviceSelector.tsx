/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import {
    AppDispatch,
    Device,
    DeviceSelector,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import {
    DeviceTraits,
    NrfutilDeviceLib,
} from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';

import {
    clearConfig,
    clearPmicConfig,
} from './features/Configuration/boardControllerConfigSlice';
import {
    clearBoardControllerFirmwareVersion,
    clearBoardRevision,
    setBoardControllerFirmwareVersion,
    setBoardRevision,
} from './features/Device/deviceSlice';

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
 * In these callbacks you may react on events when users (de)selected a device.
 * Leave out callbacks you do not need.
 *
 * Note that the callbacks releaseCurrentDevice and onDeviceIsReady
 * are only invoked, if a deviceSetup is defined.
 */
const onDeviceSelected = (dispatch: AppDispatch) => (device: Device) => {
    logger.info(`Selected device with s/n ${device.serialNumber}`);
    getBoardControllerVersion(dispatch, device); // FIXME: Remove this when onDeviceIsReady() is called
};
// const releaseCurrentDevice = () => {
//     logger.info('Will set up selected device');
// };
const onDeviceIsReady = (dispatch: AppDispatch) => (device: Device) => {
    logger.info(
        `Device with s/n ${device.serialNumber} was set up with a firmware`
    );

    getBoardControllerVersion(dispatch, device);
};

const getBoardControllerVersion = async (
    dispatch: AppDispatch,
    device: Device
) => {
    if (!device) {
        return;
    }
    const bcVersion = await NrfutilDeviceLib.getBoardControllerVersion(device);
    console.log('Got device state %o', bcVersion);
    dispatch(
        setBoardRevision({
            major: bcVersion.data.major_ver,
            minor: bcVersion.data.minor_ver,
            patch: bcVersion.data.patch_ver,
        })
    );
    dispatch(setBoardControllerFirmwareVersion(bcVersion.data.bc_fw_ver));
};

const onDeviceDeselected = (dispatch: AppDispatch) => () => {
    logger.info('Deselected device');
    dispatch(clearBoardRevision());
    dispatch(clearBoardControllerFirmwareVersion());
    dispatch(clearConfig());
    dispatch(clearPmicConfig());
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
