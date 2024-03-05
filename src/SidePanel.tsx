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

import ConfigDataPreview from './features/ConfigDataPreview/ConfigDataPreview';
import {
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
    const defaultConfig = useSelector(getDefaultConfig);

    return (
        <SidePanel className="side-panel">
            <Group defaultCollapsed={false} heading="Actions" collapsible>
                <Button
                    disabled={!device || isWriting}
                    variant="primary"
                    className="tw-w-full"
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
                        logger.info('Configuration written');
                        // Clear isWriting flag for user ui feedback
                        setWriting(false);
                    }}
                >
                    Write config
                </Button>
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
            </Group>
            <Group heading="Configuration data" collapsible>
                <ConfigDataPreview enabled />
            </Group>
        </SidePanel>
    );
};
