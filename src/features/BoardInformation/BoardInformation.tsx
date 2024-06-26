/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';

import {
    getBoardControllerFirmwareVersion,
    getBoardRevisionSemver,
} from '../Device/deviceSlice';

const BoardInformation = () => {
    const boardRevision = useSelector(getBoardRevisionSemver);
    const boardControllerFirmwareVersion = useSelector(
        getBoardControllerFirmwareVersion
    );

    return (
        <div className="sidepanel-information tw-mb-6 tw-w-full tw-border tw-border-solid tw-border-gray-200 tw-p-2">
            <div className="tw-flex tw-justify-between">
                <div>DK Hardware Revision:</div>
                <div className="bctl-information">{boardRevision || '---'}</div>
            </div>
            <div className="tw-flex tw-justify-between">
                <div>Board Controller FW version:</div>
                <div className="bctl-information">
                    {boardControllerFirmwareVersion || '---'}
                </div>
            </div>
        </div>
    );
};

export default BoardInformation;
