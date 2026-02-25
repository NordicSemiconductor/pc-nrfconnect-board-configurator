/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Group,
    logger,
    selectedDevice,
    SidePanel,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';

import { readCurrentBoardControllerConfig } from './app/DeviceSelector';
import DirtyDot from './app/DirtyDot';
import BoardInformation from './features/BoardInformation/BoardInformation';
import ConfigDataPreview from './features/ConfigDataPreview/ConfigDataPreview';
import ConfigJsonRender from './features/ConfigJsonRender/ConfigJsonRender';
import {
    clearDirtyFlags,
    getAnyConfigPinDirty,
    getConfigArray,
    getDefaultConfig,
    setConfig,
    setPmicConfig,
} from './features/Configuration/boardControllerConfigSlice';
import { getBoardDefinition } from './features/Configuration/boardDefinitions';
import { getBoardRevisionSemver } from './features/Device/deviceSlice';

export default () => {
    logger.debug('Rendering SidePanel');

    const [isWriting, setWriting] = useState(false);

    const dispatch = useDispatch();

    const device = useSelector(selectedDevice);
    const boardRevision = useSelector(getBoardRevisionSemver);

    const configData = useSelector(getConfigArray);
    const configDirty = useSelector(getAnyConfigPinDirty);
    const defaultConfig = useSelector(getDefaultConfig);

    // useEffect(() => {
    //     if (!device) {
    //         setIsDeviceSupported(false);
    //         return;
    //     }
    //
    //     let supported = true;
    //
    //     const definition = getBoardDefinition(device, boardRevision);
    //
    //     if (
    //         definition.controlFlag?.unknownRevision ||
    //         definition.controlFlag?.unrecognizedBoard
    //     ) {
    //         supported = false;
    //     }
    //
    //     setIsDeviceSupported(supported);
    // }, [boardRevision, device]);

    const definition = device
        ? getBoardDefinition(device, boardRevision)
        : undefined;

    const isDeviceSupported = Boolean(
        device &&
            !definition?.controlFlag?.unknownRevision &&
            !definition?.controlFlag?.unrecognizedBoard,
    );

    return (
        <SidePanel className="side-panel">
            <div className="tw-flex tw-flex-col tw-gap-2">
                <button
                    type="button"
                    disabled={!isDeviceSupported || isWriting}
                    className="tw-preflight tw-relative tw-h-8 tw-w-full tw-border tw-border-gray-700 tw-bg-white tw-px-2 tw-text-xs tw-text-gray-700"
                    onClick={async () => {
                        // Set isWriting flag for user ui feedback
                        setWriting(true);
                        if (!device) {
                            return;
                        }
                        await NrfutilDeviceLib.boardController(
                            device,
                            configData,
                        );

                        // Re-read the current board config
                        await readCurrentBoardControllerConfig(
                            dispatch,
                            device,
                        );
                        dispatch(clearDirtyFlags());

                        logger.info('Configuration written');
                        // Clear isWriting flag for user ui feedback
                        setWriting(false);
                    }}
                >
                    Write config
                    <DirtyDot
                        className="tw-absolute tw-end-1.5 tw-top-1"
                        dirty={configDirty}
                    />
                </button>
                <Button
                    disabled={!isDeviceSupported || isWriting || !defaultConfig}
                    variant="secondary"
                    className="tw-w-full"
                    onClick={() => {
                        logger.info('Reset to default');
                        const { pins, pmicPorts } = defaultConfig;
                        if (pins) {
                            dispatch(
                                setConfig({
                                    boardControllerConfig: pins,
                                }),
                            );
                        }
                        if (pmicPorts) {
                            dispatch(
                                setPmicConfig({
                                    pmicConfig: pmicPorts,
                                }),
                            );
                        }
                    }}
                >
                    Load default config
                </Button>
            </div>
            {!isDeviceSupported && (
                <Group heading="Supported Kits">
                    <ul className="tw-mb-0 tw-pl-4">
                        <li>
                            <a
                                href="https://www.nordicsemi.com/Products/Development-hardware/nRF9161-DK"
                                target="_blank"
                                rel="noreferrer"
                            >
                                nRF9161 DK (Rev. 0.9.0 and later)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.nordicsemi.com/Products/Development-hardware/nRF9151-DK"
                                target="_blank"
                                rel="noreferrer"
                            >
                                nRF9151 DK
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.nordicsemi.com/Products/Development-hardware/nRF54L15-DK"
                                target="_blank"
                                rel="noreferrer"
                            >
                                nRF54L15 DK
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.nordicsemi.com/Products/Development-hardware/nRF54LM20-DK"
                                target="_blank"
                                rel="noreferrer"
                            >
                                nRF54LM20 DK
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.nordicsemi.com/Products/Development-hardware/nRF9151-SMA-DK"
                                target="_blank"
                                rel="noreferrer"
                            >
                                nRF9151 SMA DK
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.nordicsemi.com/Products/Development-hardware/nRF54LV10-DK"
                                target="_blank"
                                rel="noreferrer"
                            >
                                nRF54LV10 DK
                            </a>
                        </li>
                        <li>nRF54H20 DK</li>
                    </ul>
                </Group>
            )}
            {device && isDeviceSupported && (
                <Group
                    heading="Board Controller info"
                    collapsible
                    collapseStatePersistenceId="b_c_info_group"
                >
                    <>
                        <BoardInformation />
                        <ConfigDataPreview device={device} />
                        <ConfigJsonRender />
                    </>
                </Group>
            )}
        </SidePanel>
    );
};
