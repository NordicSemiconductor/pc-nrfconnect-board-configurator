/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    Overlay,
    StateSelector,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import DirtyDot from '../../app/DirtyDot';
import {
    getConfigPinDirty,
    getConfigValue,
    setConfigValue,
} from '../Configuration/boardControllerConfigSlice';

interface ConfigSlideSelectorProps {
    configTitle: string;
    configLabel: string;
    configTooltip?: string;
    configPin: number;
    configAlternatives: [string, string];
    invert: boolean;
}

const ConfigSlideSelector = ({
    configTitle,
    configLabel,
    configTooltip,
    configPin,
    configAlternatives,
    invert = false,
}: ConfigSlideSelectorProps) => {
    const dispatch = useDispatch();

    const pinEnable = xor(useSelector(getConfigValue(configPin)), invert);
    const selectedItem = configAlternatives[pinEnable ? 1 : 0];

    const dirty = useSelector(getConfigPinDirty(configPin));

    return (
        <Card
            title={
                <div className="tw-flex tw-content-between">
                    <span>
                        {configTitle}
                        <DirtyDot
                            dirty={dirty}
                            className="tw-absolute tw-ml-1 -tw-translate-y-2"
                        />
                    </span>
                </div>
            }
        >
            <div>
                <div className="tw-flex tw-content-between">
                    {configLabel && (
                        <div className="tw-mb-4">{configLabel}</div>
                    )}
                    {configTooltip && (
                        <Overlay
                            tooltipId="tooltip"
                            tooltipChildren={
                                <div className="tw-preflight tw-flex tw-flex-col tw-gap-4 tw-bg-gray-900 tw-px-4 tw-py-2 tw-text-left tw-text-gray-100">
                                    <p>{configTooltip}</p>
                                </div>
                            }
                        >
                            <span className="mdi mdi-help-circle-outline" />
                        </Overlay>
                    )}
                </div>
                <StateSelector
                    items={configAlternatives}
                    selectedItem={selectedItem}
                    onSelect={index => {
                        const enable = index === 1;
                        dispatch(
                            setConfigValue({
                                configPin,
                                configPinState: xor(enable, invert),
                            }),
                        );
                    }}
                />
            </div>
        </Card>
    );
};

const xor = (a: boolean, b: boolean): boolean => a !== b; // No XOR for booleans in TypeScript

export default ConfigSlideSelector;
