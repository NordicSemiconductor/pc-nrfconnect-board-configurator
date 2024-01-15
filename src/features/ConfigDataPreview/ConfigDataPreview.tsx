/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { logger } from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getConfigArray,
    getConfigData,
    getPmicConfigData,
} from '../Configuration/boardControllerConfigSlice';
import {
    getBoardControllerFirmwareVersion,
    getBoardRevisionSemver,
} from '../Device/deviceSlice';

import './configdatapreview.scss';

const ConfigDataPreview: React.FC<{
    enabled: boolean;
}> = ({ enabled = true }) => {
    logger.debug('Rendering ConfigDataPreview');

    const configArray = useSelector(getConfigArray);
    const configData = useSelector(getConfigData);
    const pmicData = useSelector(getPmicConfigData);
    const boardRevision = useSelector(getBoardRevisionSemver);
    const boardControllerFirmwareVersion = useSelector(
        getBoardControllerFirmwareVersion
    );

    if (enabled) {
        return (
            <div className="sidepanel-group">
                {boardRevision ? (
                    <div>
                        <h3 className="heading">Board Controller</h3>
                        <p>
                            Board Hardware Revision:
                            <br /> {boardRevision}
                        </p>
                        <p>
                            BoardController FW version:
                            <br /> {boardControllerFirmwareVersion}
                        </p>
                    </div>
                ) : null}

                {configData && configData.size > 0 && (
                    <>
                        <h2 className="heading">Toggles</h2>
                        <div className="config-block">
                            <table>{configList(configData)}</table>
                        </div>
                    </>
                )}
                {pmicData && pmicData.size > 0 && (
                    <>
                        <h2 className="heading">PMIC configuration</h2>
                        <div className="config-block">{pmicList(pmicData)}</div>
                    </>
                )}
            </div>
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
