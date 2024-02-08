/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    CollapsibleGroup,
    logger,
    selectedDevice,
    SidePanel,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';

import ConfigDataPreview from './features/ConfigDataPreview/ConfigDataPreview';
import { getConfigArray } from './features/Configuration/boardControllerConfigSlice';

export default () => {
    logger.debug('Rendering SidePanel');

    const [isWriting, setWriting] = useState(false);

    const device = useSelector(selectedDevice);
    const configData = useSelector(getConfigArray);

    return (
        <SidePanel className="side-panel">
            <CollapsibleGroup defaultCollapsed={false} heading="Actions">
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
            </CollapsibleGroup>
            <CollapsibleGroup defaultCollapsed heading="Configuration data">
                <ConfigDataPreview enabled />
            </CollapsibleGroup>
        </SidePanel>
    );
};
