/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { logger } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getConfigArray } from '../Configuration/boardControllerConfigSlice';
import {
    getBoardControllerFirmwareVersion,
    getBoardRevisionSemver,
} from '../Device/deviceSlice';

const ConfigDataPreview: React.FC<{
    enabled: boolean;
}> = ({ enabled = true }) => {
    logger.info('Rendering ConfigDataPreview');

    const configData = useSelector(getConfigArray);
    const boardRevision = useSelector(getBoardRevisionSemver);
    const boardControllerFirmwareVersion = useSelector(
        getBoardControllerFirmwareVersion
    );

    if (enabled) {
        return (
            <div>
                <div>{JSON.stringify(configData)}</div>

                {boardRevision ? (
                    <div>
                        <p>
                            Board Revision:
                            {boardRevision}
                        </p>
                        <p>
                            BoardController FW version:
                            {boardControllerFirmwareVersion}
                        </p>
                    </div>
                ) : null}
            </div>
        );
    } else {
        return (
            <></>
        )
    }
};

export default ConfigDataPreview;
