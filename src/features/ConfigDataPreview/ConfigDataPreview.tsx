/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Group, logger } from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getConfigData,
    getPmicConfigData,
} from '../Configuration/boardControllerConfigSlice';
import {
    getBoardControllerFirmwareVersion,
    getBoardRevisionSemver,
} from '../Device/deviceSlice';

import './configdatapreview.scss';

interface ConfigDataPreviewProps {
    enabled: boolean;
}

const ConfigDataPreview = ({ enabled = true }: ConfigDataPreviewProps) => {
    logger.debug('Rendering ConfigDataPreview');

    const configData = useSelector(getConfigData);
    const pmicData = useSelector(getPmicConfigData);
    const boardRevision = useSelector(getBoardRevisionSemver);
    const boardControllerFirmwareVersion = useSelector(
        getBoardControllerFirmwareVersion
    );

    if (enabled) {
        return (
            <>
                {boardRevision && (
                    <Group heading="Board Controller">
                        <p>
                            Board Hardware Revision:
                            <br /> {boardRevision}
                        </p>
                        <p>
                            Board Controller FW version:
                            <br /> {boardControllerFirmwareVersion}
                        </p>
                    </Group>
                )}

                {configData && configData.size > 0 && (
                    <Group heading="Board Controller pin configuration">
                        <div className="config-block">
                            <table>{configList(configData)}</table>
                        </div>
                    </Group>
                )}
                {pmicData && pmicData.size > 0 && (
                    <Group heading="PMIC configuration">
                        <div className="config-block">{pmicList(pmicData)}</div>
                    </Group>
                )}
            </>
        );
    }

    return null;
};

function configList(configData: Map<number, boolean>) {
    const pins = Array.from(configData.keys()).sort((a, b) => a - b);
    return pins.map(pin => (
        <tr key={`pin-${pin}`}>
            <td className="config-pin">{pin}</td>
            <td className="config-value">
                {configData.get(pin) ? 'true' : 'false'}
            </td>
        </tr>
    ));
}

function pmicList(pmicData: Map<number, number>) {
    const ports = Array.from(pmicData.keys()).sort();
    return ports.map(port => (
        <div key={`port-${port}`}>
            <span className="config-pin">{port}</span>
            <span className="config-value">{pmicData.get(port)}</span>
        </div>
    ));
}

export default ConfigDataPreview;
