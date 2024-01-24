/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    logger,
    StateSelector,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getConfigValue,
    setConfigValue,
} from '../Configuration/boardControllerConfigSlice';

interface ConfigSlideSelectorProps {
    configTitle: string;
    configLabel: string;
    configPin: number;
    configAlternatives: [string, string];
    invert: boolean;
}

const ConfigSlideSelector = ({
    configTitle,
    configLabel,
    configPin,
    configAlternatives,
    invert = false,
}: ConfigSlideSelectorProps) => {
    const dispatch = useDispatch();

    const pinEnable = xor(useSelector(getConfigValue(configPin)), invert);
    const selectedItem = configAlternatives[pinEnable ? 1 : 0];

    return (
        <Card
            title={
                <div className="tw-flex tw-content-between">
                    <span>{configTitle}</span>
                </div>
            }
        >
            <div>
                <p>{configLabel}</p>
                <StateSelector
                    items={configAlternatives}
                    selectedItem={selectedItem}
                    onSelect={index => {
                        const enable = index === 1;
                        dispatch(
                            setConfigValue({
                                configPin,
                                configPinState: xor(enable, invert),
                            })
                        );
                    }}
                />
            </div>
        </Card>
    );
};

const xor = (a: boolean, b: boolean): boolean => a !== b; // No XOR for booleans in TypeScript

export default ConfigSlideSelector;
