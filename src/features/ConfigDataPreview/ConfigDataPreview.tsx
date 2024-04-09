/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    classNames,
    Device,
    Group,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getConfigData,
    getPmicConfigData,
    setConfigValue,
} from '../Configuration/boardControllerConfigSlice';
import {
    BoardDefinition,
    generatePinMap,
    getBoardDefinition,
} from '../Configuration/boardDefinitions';
import { getBoardRevisionSemver } from '../Device/deviceSlice';

import './configdatapreview.scss';

interface ConfigDataPreviewProps {
    device: Device;
}

const ConfigDataPreview = ({ device }: ConfigDataPreviewProps) => {
    logger.debug('Rendering ConfigDataPreview');

    const configData = useSelector(getConfigData);
    const pmicData = useSelector(getPmicConfigData);
    const boardRevision = useSelector(getBoardRevisionSemver);
    const boardDefinition = getBoardDefinition(device, boardRevision);

    return (
        <>
            {configData && configData.size > 0 && (
                <Group heading="Pin configuration">
                    <ConfigList
                        configData={configData}
                        boardDefinition={boardDefinition}
                    />
                    <p className="dip-label">/ = active low</p>
                </Group>
            )}
            {pmicData && pmicData.size > 0 && (
                <Group heading="PMIC configuration">
                    <PmicList pmicData={pmicData} />
                </Group>
            )}
        </>
    );
};

interface ConfigListProps {
    configData: Map<number, boolean>;
    boardDefinition: BoardDefinition;
}

const ConfigList = ({ configData, boardDefinition }: ConfigListProps) => {
    const pins = Array.from(configData.keys()).sort((a, b) => a - b);
    const pinMap = generatePinMap(
        boardDefinition.boardControllerConfigDefinition
    );

    return (
        <div className="config-block tw-ml-px tw-mt-px">
            {pins.map(pin => {
                const { id, inverted } = pinMap.get(pin) || {
                    id: 'unknown',
                    inverted: false,
                };

                return (
                    <div
                        className="config-pin tw-h-10x -tw-mt-px tw-flex tw-w-full tw-items-center"
                        key={`pin-${pin}`}
                    >
                        <div className="tw-mr-1x -tw-ml-px tw-flex tw-h-8 tw-w-8 tw-flex-none tw-items-center tw-border  tw-border-solid tw-border-gray-200 tw-p-1 tw-text-center tw-align-middle tw-text-gray-700">
                            <div className="dip-label tw-m-auto">{pin}</div>
                        </div>
                        <div className="tw-mr-1x -tw-ml-px tw-flex tw-h-8 tw-flex-1 tw-items-center tw-truncate tw-border  tw-border-solid tw-border-gray-200 tw-p-1">
                            <div className="dip-label tw-w-full tw-flex-1 tw-truncate tw-pl-1">
                                {inverted && '/'}
                                {id}
                            </div>
                        </div>
                        <ConfigDipSwitch
                            enable={configData.get(pin) === true}
                            pinNumber={pin}
                        />
                    </div>
                );
            })}
        </div>
    );
};

interface ConfigSwitchProps {
    enable: boolean;
    pinNumber: number;
}
const ConfigDipSwitch = ({ pinNumber, enable }: ConfigSwitchProps) => {
    const dispatch = useDispatch();

    return (
        <div className="dip-switch-container tw-p-1x -tw-ml-px tw-flex tw-h-8 tw-flex-none tw-items-center tw-border tw-border-solid tw-border-gray-200 tw-bg-gray-700">
            <button
                type="button"
                className={classNames(
                    'tw-preflight tw-ml-2 tw-mr-1 tw-h-4 tw-w-9',
                    'tw-flex tw-items-center tw-justify-center', // Center contained item
                    !enable
                        ? 'dip-switch-selected tw-rounded-sm tw-bg-white tw-text-gray-700'
                        : 'dip-switch-unselected tw-text-gray-100'
                )}
                onClick={() => {
                    dispatch(
                        setConfigValue({
                            configPin: pinNumber,
                            configPinState: false,
                        })
                    );
                }}
            >
                <span className="dip-switch tw-font-bold">OFF</span>
            </button>
            <button
                type="button"
                className={classNames(
                    'tw-preflight tw-ml-1 tw-mr-2 tw-h-4 tw-w-9',
                    'tw-flex tw-items-center tw-justify-center', // Center contained item
                    enable
                        ? 'dip-switch-selected tw-rounded-sm tw-bg-white tw-text-gray-700'
                        : 'dip-switch-unselected tw-text-gray-100'
                )}
                onClick={() => {
                    dispatch(
                        setConfigValue({
                            configPin: pinNumber,
                            configPinState: true,
                        })
                    );
                }}
            >
                <span className="dip-switch tw-font-bold">ON</span>
            </button>
        </div>
    );
};

interface PmicListProps {
    pmicData: Map<number, number>;
}
const PmicList = ({ pmicData }: PmicListProps) => {
    const ports = Array.from(pmicData.keys()).sort();
    return (
        <div className="config-block tw-mb-6 tw-w-full">
            {ports.map(port => (
                <div
                    className="config-pin tw-h-10x -tw-mt-px tw-flex tw-w-full tw-items-center"
                    key={`port-${port}`}
                >
                    <div className="tw-mr-1x -tw-ml-px tw-flex tw-h-8 tw-w-8 tw-flex-none tw-items-center tw-border  tw-border-solid tw-border-gray-200 tw-p-1 tw-text-center tw-align-middle tw-text-gray-700">
                        <div className="dip-label tw-m-auto">{port}</div>
                    </div>
                    <div className="tw-mr-1x -tw-ml-px tw-flex tw-h-8 tw-flex-1 tw-items-center tw-truncate tw-border  tw-border-solid tw-border-gray-200 tw-p-1">
                        <div className="dip-label tw-w-full tw-flex-1 tw-truncate tw-pl-1">
                            {pmicData.get(port)} mV
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConfigDataPreview;
