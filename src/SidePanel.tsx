/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    CollapsibleGroup,
    logger,
    selectedDevice,
    SidePanel,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';

import ConfigDataPreview from './features/ConfigDataPreview/ConfigDataPreview';
import { getConfigArray } from './features/Configuration/boardControllerConfigSlice';

export default () => {
    logger.debug('Rendering SidePanel');

    const device = useSelector(selectedDevice);
    const configData = useSelector(getConfigArray);

    return (
        <SidePanel className="side-panel">
            <CollapsibleGroup defaultCollapsed={false} heading="Actions">
                <Button
                    disabled
                    variant="secondary"
                    className="w-100"
                    onClick={() => {}}
                >
                    Load Configuration
                </Button>
                <Button
                    disabled
                    variant="secondary"
                    className="w-100"
                    onClick={() => {}}
                >
                    Reset Configuration
                </Button>
                <Button
                    disabled
                    variant="secondary"
                    className="w-100"
                    onClick={() => {}}
                >
                    Export Configuration
                </Button>
                <Button
                    disabled={!device}
                    variant="secondary"
                    className="w-100"
                    onClick={() => {
                        console.dir(device);
                        if (!device) {
                            return;
                        }
                        NrfutilDeviceLib.boardController(device, configData);
                    }}
                >
                    Write config
                </Button>
            </CollapsibleGroup>
            <ConfigDataPreview enabled />
        </SidePanel>
    );
};
