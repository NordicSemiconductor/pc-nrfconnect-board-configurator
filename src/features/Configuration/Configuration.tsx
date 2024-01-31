/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
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
import nrf54l15v020json from '../../common/boards/nrf_PCA10156_0.2.0.json';
import nrf54l15v030json from '../../common/boards/nrf_PCA10156_0.3.0.json';
import ConfigSlideSelector from '../ConfigSlideSelector/ConfigSlideSelector';
import ConfigSwitch from '../ConfigSwitch/ConfigSwitch';
import { getBoardRevisionSemver } from '../Device/deviceSlice';
import VCOMConfiguration from '../VCOMConfiguration/VCOMConfiguration';
import VoltageConfiguration from '../VoltageConfiguration/VoltageConfiguration';
import { setConfig, setPmicConfig } from './boardControllerConfigSlice';

interface BoardControllerProps {
    active: boolean;
}

const BoardController = ({ active }: BoardControllerProps) => {
    const typednrf9161json =
        nrf9161v0100json as BoardControllerConfigDefinition;
    const typednrf9161v091 = nrf9161v091json as BoardControllerConfigDefinition;
    const typednrf54l15v020json =
        nrf54l15v020json as BoardControllerConfigDefinition;
    const typednrf54l15v030json =
        nrf54l15v030json as BoardControllerConfigDefinition;
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
        logDeviceVersion(device, boardRevision);

        switch (device?.devkit?.boardVersion) {
            case 'PCA10156':
                // nRF54L15
                if (boardRevision === '0.3.0') {
                    setDefaultConfig(dispatch, typednrf54l15v030json);
                    return BuildGui(typednrf54l15v030json);
                }

                // Default is revision 0.2.0 or 0.2.1
                setDefaultConfig(dispatch, typednrf54l15v020json);
                return BuildGui(typednrf54l15v020json);

            case 'PCA10153':
                // nRF9161
                if (boardRevision === '0.10.0') {
                    setDefaultConfig(dispatch, typednrf9161json);
                    return BuildGui(typednrf9161json);
                }
                if (boardRevision === '0.9.0' || boardRevision === '0.9.1') {
                    setDefaultConfig(dispatch, typednrf9161v091);
                    return BuildGui(typednrf9161v091);
                }
                if (!boardRevision) {
                    return Spinner();
                }

                return UnrecognizedBoardRevision();

            case 'PCA10145':
                // nRF54H20
                setDefaultConfig(dispatch, typednrf54h20json);
                return BuildGui(typednrf54h20json);

            default:
                return UnrecognizedBoard();
        }
    } else {
        return NoBoardSelected();
    }
};

const NoBoardSelected = () => (
    <div>
        <p>
            Please connect to a development kit featuring the Board Controller.
        </p>
        <p>Currently supported kits:</p>
        <ul>
            <li>
                <a
                    href="https://www.nordicsemi.com/Products/nRF9161"
                    target="_blank"
                    rel="noreferrer"
                >
                    nRF9161DK (Rev. 0.9.0 and later)
                </a>
            </li>
        </ul>
    </div>
);

const Spinner = () => (
    <div>
        <p>Working..</p>
    </div>
);

const UnrecognizedBoard = () => (
    <div>
        <p>This development kit does not feature the Board Controller.</p>
    </div>
);

const UnrecognizedBoardRevision = () => (
    <div>
        <p>
            This revision of the development kit is not supported. Please update
            to the latest version of Board Controller Configurator // FIXME
        </p>
    </div>
);

const BuildGui = (boardJson: BoardControllerConfigDefinition) => {
    const { board, pins, pmicPorts } = boardJson;
    logger.debug(
        `buildGui() for board definition pins: ${JSON.stringify(pins)}`
    );

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
};

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
        logger.warn('No defaults found in board definition JSON');
    }
}

const logDeviceVersion = (
    device: Device,
    boardRevision: string | undefined
) => {
    logger.debug(
        `Got device ${JSON.stringify(device)} ${JSON.stringify(boardRevision)}`
    );
    logger.debug(
        `Device with boardVersion: ${JSON.stringify(
            device?.devkit?.boardVersion
        )}`
    );
};

export default BoardController;
