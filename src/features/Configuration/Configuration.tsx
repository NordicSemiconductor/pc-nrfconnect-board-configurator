/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AppDispatch,
    Device,
    logger,
    MasonryLayout,
    selectedDevice,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import BoardControllerConfigDefinition from '../../common/boards/BoardControllerConfigDefinition';
import nrf54h20json from '../../common/boards/nrf_PCA10145_54H20.json';
import nrf9161v091json from '../../common/boards/nrf_PCA10153_0.9.1_9161.json';
import nrf9161v0100json from '../../common/boards/nrf_PCA10153_0.10.0_9161.json';
import nrf54l15json from '../../common/boards/nrf_PCA10156_0.2.0.json';
import ConfigSlideSelector from '../ConfigSlideSelector/ConfigSlideSelector';
import ConfigSwitch from '../ConfigSwitch/ConfigSwitch';
import { getBoardRevisionSemver } from '../Device/deviceSlice';
import VCOMConfiguration from '../VCOMConfiguration/VCOMConfiguration';
import VoltageConfiguration from '../VoltageConfiguration/VoltageConfiguration';
import { setConfig, setPmicConfig } from './boardControllerConfigSlice';

import './configuration.scss';

const BoardController: React.FC<{ active: boolean }> = ({ active }) => {
    const typednrf9161json =
        nrf9161v0100json as BoardControllerConfigDefinition;
    const typednrf9161v091 = nrf9161v091json as BoardControllerConfigDefinition;
    const typednrf54l15json = nrf54l15json as BoardControllerConfigDefinition;
    const typednrf54h20json = nrf54h20json as BoardControllerConfigDefinition;

    const dispatch = useDispatch();

    useEffect(() => {
        if (active) {
            logger.debug('Showing BoardController pane');
        }
        return () => {
            if (active) {
                logger.debug('Hiding BoardController pane');
            }
        };
    }, [active]);

    const device: Device | undefined = useSelector(selectedDevice);
    const boardRevision = useSelector(getBoardRevisionSemver);

    if (device) {
        console.log('Got device %o %s', device, boardRevision);
        console.log(
            'Device with boardVersion: %s',
            device?.devkit?.boardVersion
        );

        switch (device?.devkit?.boardVersion) {
            case 'PCA10156':
                // nRF54L15
                setDefaultConfig(dispatch, typednrf54l15json);
                return buildGui(typednrf54l15json);

            case 'PCA10153':
                // nRF9161
                if (boardRevision === '0.10.0') {
                    setDefaultConfig(dispatch, typednrf9161json);
                    return buildGui(typednrf9161json);
                }
                if (boardRevision === '0.9.0' || boardRevision === '0.9.1') {
                    setDefaultConfig(dispatch, typednrf9161v091);
                    return buildGui(typednrf9161v091);
                }

                return unrecognized();

            case 'PCA10145':
                // nRF54H20
                setDefaultConfig(dispatch, typednrf54h20json);
                return buildGui(typednrf54h20json);

            default:
                return unrecognized();
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

function buildGui(boardJson: BoardControllerConfigDefinition) {
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
                                    enableInvert={
                                        pinConfig.enable.invert ?? false
                                    }
                                    hwfcInvert={pinConfig.hwfc.invert ?? false}
                                />
                            );
                        case 'slide':
                            return (
                                <ConfigSlideSelector
                                    configTitle={pinConfig.title}
                                    configLabel={pinConfig.label}
                                    configPin={pinConfig.enable.pin}
                                    invert={pinConfig.enable.invert ?? false}
                                    configAlternatives={pinConfig.alternatives}
                                />
                            );
                        case 'switch':
                            return (
                                <ConfigSwitch
                                    configTitle={pinConfig.title}
                                    configLabel={pinConfig.label}
                                    configPin={pinConfig.enable.pin}
                                    invert={pinConfig.enable.invert ?? false}
                                />
                            );
                        default:
                            logger.warn(
                                `Error in Board Controller Config Definition file for ${board.boardName}`
                            );
                            return null;
                    }
                })}
                {pmicPorts &&
                    pmicPorts.map(port => (
                        <VoltageConfiguration
                            key={`voltage-${port.port}`}
                            pmicPort={port.port}
                            voltageMin={port.mVmin}
                            voltageMax={port.mVmax}
                        />
                    ))}
            </MasonryLayout>
        </div>
    );
}

function setDefaultConfig(
    dispatch: AppDispatch,
    boardJson: BoardControllerConfigDefinition
) {
    if (boardJson?.defaults) {
        const { pins, pmicPorts } = boardJson.defaults;

        const defaultConfig: Map<number, boolean> = new Map(pins);
        const defaultPmicConfig: Map<number, number> = new Map(pmicPorts);

        dispatch(setConfig({ boardControllerConfig: defaultConfig }));
        dispatch(setPmicConfig({ pmicConfig: defaultPmicConfig }));
    } else {
        console.log('No defaults found in board JSON');
    }
}

export default BoardController;
