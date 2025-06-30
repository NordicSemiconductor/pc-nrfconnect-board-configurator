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
import ConfigSlideSelector from '../ConfigSlideSelector/ConfigSlideSelector';
import ConfigSwitch from '../ConfigSwitch/ConfigSwitch';
import { getBoardRevisionSemver } from '../Device/deviceSlice';
import VCOMConfiguration from '../VCOMConfiguration/VCOMConfiguration';
import VoltageConfiguration from '../VoltageConfiguration/VoltageConfiguration';
import {
    getDefaultConfig,
    getHardwareConfig,
    setConfig,
    setDefaultConfig,
    setPmicConfig,
} from './boardControllerConfigSlice';
import { getBoardDefinition } from './boardDefinitions';
import { BoardConfiguration } from './hardwareConfiguration';

interface BoardControllerProps {
    active: boolean;
}

const BoardController = ({ active }: BoardControllerProps) => {
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
    const hardwareConfig = useSelector(getHardwareConfig);
    const defaultConfig = useSelector(getDefaultConfig);

    if (device) {
        logDeviceVersion(device, boardRevision);

        const definition = getBoardDefinition(device, boardRevision);

        if (definition.boardControllerConfigDefinition) {
            if (!defaultConfig.pins && !defaultConfig.pmicPorts) {
                loadDefaultConfig(
                    dispatch,
                    definition.boardControllerConfigDefinition
                );
            }
            setInitialConfig(dispatch, hardwareConfig, defaultConfig);
            return BuildGui(definition.boardControllerConfigDefinition);
        }

        if (definition.controlFlag?.noRevision) {
            return Spinner();
        }

        if (definition.controlFlag?.unknownRevision) {
            return UnrecognizedBoardRevision();
        }

        return UnrecognizedBoard();
    }

    return NoBoardSelected();
};

const NoBoardSelected = () => (
    <div>
        <p>
            Use <b>SELECT DEVICE</b> to connect to a development kit that
            features the Board Controller.
        </p>
        <p>Currently supported kits:</p>
        <ul>
            <li>
                <a
                    href="https://www.nordicsemi.com/Products/nRF9161"
                    target="_blank"
                    rel="noreferrer"
                >
                    nRF9161 DK (Rev. 0.9.0 and later)
                </a>
            </li>
            <li>
                <a
                    href="https://www.nordicsemi.com/Products/nRF9151"
                    target="_blank"
                    rel="noreferrer"
                >
                    nRF9151 DK
                </a>
            </li>
            <li>
                <a
                    href="https://www.nordicsemi.com/Products/nRF54L15"
                    target="_blank"
                    rel="noreferrer"
                >
                    nRF54L15 DK
                </a>
            </li>
            <li>
                <a
                    href="https://www.nordicsemi.com/Products/nRF54H20"
                    target="_blank"
                    rel="noreferrer"
                >
                    nRF54H20 PDK
                </a>
            </li>
        </ul>
    </div>
);

const Spinner = () => (
    <div>
        <p>Working...</p>
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
            This revision of the development kit is not supported. Update to the
            latest version of the Board Configurator app
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
            <MasonryLayout minWidth={300}>
                {pins.map(pinConfig => {
                    switch (pinConfig.type) {
                        case 'vcom':
                            return (
                                <VCOMConfiguration
                                    key={pinConfig.id}
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
                                    key={pinConfig.id}
                                    configTitle={pinConfig.title}
                                    configLabel={pinConfig.label}
                                    configTooltip={pinConfig.tooltip}
                                    configPin={pinConfig.enable.pin}
                                    invert={pinConfig.enable.invert ?? false}
                                    configAlternatives={pinConfig.alternatives}
                                />
                            );
                        case 'switch':
                            return (
                                <ConfigSwitch
                                    key={pinConfig.id}
                                    configTitle={pinConfig.title}
                                    configLabel={pinConfig.label}
                                    configTooltip={pinConfig.tooltip}
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
                            key={`voltage-${port.port.reduce(
                                (a, b) => `${a}${b}`,
                                ''
                            )}`}
                            tooltip={port.portDescriptionTooltip}
                            pmicPort={port.port}
                            voltageMin={port.mVmin}
                            voltageMax={port.mVmax}
                            pmicPortLabel={port.portLabel}
                            pmicPortDescription={port.portDescription}
                        />
                    ))}
            </MasonryLayout>
        </div>
    );
};

function loadDefaultConfig(
    dispatch: AppDispatch,
    boardJson: BoardControllerConfigDefinition
) {
    if (!boardJson?.defaults) {
        logger.warn('No defaults found in board definition JSON');
        return;
    }

    // Create defaults map
    const defaultConfig: Map<number, boolean> = new Map(
        (boardJson.defaults?.pins || []).map(({ pin, state }) => [pin, state])
    );
    const defaultPmicConfig: Map<number, number> = new Map(
        (boardJson.defaults?.pmicPorts || []).map(({ port, voltage }) => [
            port,
            voltage,
        ])
    );

    dispatch(
        setDefaultConfig({
            defaultConfig: {
                pins: defaultConfig,
                pmicPorts: defaultPmicConfig,
            },
        })
    );
}

function setInitialConfig(
    dispatch: AppDispatch,
    hardwareConfig: BoardConfiguration,
    defaultBoardConfig: BoardConfiguration
) {
    const { pins: defaultPinConfig, pmicPorts: defaultPmicConfig } =
        defaultBoardConfig;

    // Merge with currently read hardware config
    const mergedPinConfig = new Map([
        ...(defaultPinConfig || []),
        ...(hardwareConfig.pins || []),
    ]);

    const mergedPmicConfig = new Map([
        ...(defaultPmicConfig || []),
        ...(hardwareConfig.pmicPorts || []),
    ]);

    dispatch(setConfig({ boardControllerConfig: mergedPinConfig }));
    dispatch(setPmicConfig({ pmicConfig: mergedPmicConfig }));
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
