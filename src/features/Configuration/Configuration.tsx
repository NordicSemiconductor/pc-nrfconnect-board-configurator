/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Device,
    logger,
    MasonryLayout,
    selectedDevice,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import nrf9161json from '../../common/boards/nrf_PCA10153_0.10.0_9161.json';
import nrf54l15json from '../../common/boards/nrf_PCA10156_0.2.0.json';
import ConfigSlideSelector from '../ConfigSlideSelector/ConfigSlideSelector';
import ConfigSwitch from '../ConfigSwitch/ConfigSwitch';
import { getBoardRevisionSemver } from '../Device/deviceSlice';
import VCOMConfiguration from '../VCOMConfiguration/VCOMConfiguration';
import VoltageConfiguration from '../VoltageConfiguration/VoltageConfiguration';

import './configuration.scss';
import { setConfig, setPmicConfig } from './boardControllerConfigSlice';

const BoardController: React.FC<{ active: boolean }> = ({ active }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (active) {
            logger.info('Showing BoardController pane');
        }
        return () => {
            if (active) {
                logger.info('Hiding BoardController pane');
            }
        };
    }, [active]);

    const device: Device | undefined = useSelector(selectedDevice);
    const boardRevision = useSelector(getBoardRevisionSemver);

    if (device) {
        console.log('Got device %o %s', device, boardRevision);
        console.log('Device with boardVersion: %s', device.boardVersion);

        switch (device.boardVersion) {
            case 'PCA10156':
                // return buildGui(nrf54l15json);
                // return buildGui(nrf54h20json);
                if (boardRevision === '0.1.0') {
                    setDefaultConfig(nrf54l15json);
                    return buildGui(nrf54l15json);
                }

                return unrecognized();

            // return buildGui(nrf9161json);

            case 'PCA10153':
                if (boardRevision === '0.10.0') {
                    return buildGui(nrf9161json);
                }

                return unrecognized();

            default:
                return (
                    <div>
                        <p>Nothing to see here</p>
                    </div>
                );
        }
    } else {
        return unrecognized();
    }
};

function unrecognized() {
    return (
        <div>
            <p>No Board Controller device recognized.</p>
        </div>
    );
}

function buildGui(boardJson) {
    const { board, pins, pmicPorts } = boardJson;
    console.dir(pins);

    logger.info(`Rendering for ${board.boardName}`);

    return (
        <div>
            <div>
                <p>{board.boardName}</p>
            </div>
            <MasonryLayout minWidth={300}>
                {pins.map(pinConfig => {
                    switch (pinConfig.type) {
                        case 'vcom':
                            return (
                                <VCOMConfiguration
                                    vcomEnablePin={pinConfig.enable.pin}
                                    hwfcEnablePin={pinConfig.hwfc.pin}
                                    vcomName={pinConfig.name}
                                />
                            );
                        case 'slide':
                            return (
                                <ConfigSlideSelector
                                    configTitle={pinConfig.title}
                                    configLabel={pinConfig.label}
                                    configPin={pinConfig.enable.pin}
                                    configAlternatives={pinConfig.alternatives}
                                />
                            );
                        case 'switch':
                            return (
                                <ConfigSwitch
                                    configTitle={pinConfig.title}
                                    configLabel={pinConfig.label}
                                    configPin={pinConfig.enable.pin}
                                />
                            );
                    }
                })}
                {pmicPorts.map(port => (
                    <VoltageConfiguration pmicPort={port.port} />
                ))}
            </MasonryLayout>
        </div>
    );
}

function setDefaultConfig(dispatch: TDispatch, boardJson) {
    if (boardJson?.defaults) {
        const { pins, pmicPort } = boardJson.defaults;

        const defaultConfig: Map<number, boolean> = new Map(pins);
        const defaultPmicConfig: Map<number, number> = new Map(pmicPort);

        dispatch(setConfig({ boardControllerConfig: defaultConfig }));
        dispatch(setPmicConfig({ pmicConfig: defaultPmicConfig }));
    } else {
        console.log('No defaults found in board JSON');
    }
}

export default BoardController;
