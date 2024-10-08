/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
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

export default () => {
    logger.debug('Rendering SidePanel');

    const [isWriting, setWriting] = useState(false);

    const dispatch = useDispatch();

    const device = useSelector(selectedDevice);
    const configData = useSelector(getConfigArray);
    const configDirty = useSelector(getAnyConfigPinDirty);
    const defaultConfig = useSelector(getDefaultConfig);

    return (
        <SidePanel className="side-panel">
            <div className="tw-flex tw-flex-col tw-gap-2">
                <button
                    type="button"
                    disabled={!device || isWriting}
                    className="tw-preflight tw-relative tw-h-8 tw-w-full  tw-border tw-border-gray-700 tw-bg-white tw-px-2 tw-text-xs tw-text-gray-700"
                    onClick={async () => {
                        // Set isWriting flag for user ui feedback
                        setWriting(true);
                        if (!device) {
                            return;
                        }
                        await NrfutilDeviceLib.boardController(
                            device,
                            configData
                        );

                        // Re-read the current board config
                        await readCurrentBoardControllerConfig(
                            dispatch,
                            device
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
                    disabled={!device || isWriting || !defaultConfig}
                    variant="secondary"
                    className="tw-w-full"
                    onClick={() => {
                        logger.info('Reset to default');
                        const { pins, pmicPorts } = defaultConfig;
                        if (pins) {
                            dispatch(
                                setConfig({
                                    boardControllerConfig: pins,
                                })
                            );
                        }
                        if (pmicPorts) {
                            dispatch(
                                setPmicConfig({
                                    pmicConfig: pmicPorts,
                                })
                            );
                        }
                    }}
                >
                    Load default config
                </Button>
            </div>
            <Group heading="Board Controller info" collapsible>
                {device && (
                    <>
                        <BoardInformation />
                        <ConfigDataPreview device={device} />
                        <ConfigJsonRender />
                    </>
                )}
            </Group>
        </SidePanel>
    );
};
