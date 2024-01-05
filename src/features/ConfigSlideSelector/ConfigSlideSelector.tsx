/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
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

const ConfigSlideSelector: React.FC<{
    configTitle: string;
    configLabel: string;
    configPin: number;
    configAlternatives: [string, string];
    invert: boolean;
}> = ({
    configTitle,
    configLabel,
    configPin,
    configAlternatives,
    invert = false,
}) => {
    logger.debug(`Rendering ConfigSlideSelector for ${configTitle}`);

    const dispatch = useDispatch();

    const pinEnable = useSelector(getConfigValue(configPin)) !== invert; // No XOR for booleans in TypeScript :/
    const selectedItem = configAlternatives[pinEnable ? 1 : 0];

    return (
        <Card
            title={
                <div className="d-flex justify-content-between">
                    <span>{configTitle}</span>
                </div>
            }
        >
            <div className="tw-flex tw-gap-2">
                <span>{configLabel}</span>
                <StateSelector
                    items={configAlternatives}
                    selectedItem={selectedItem}
                    onSelect={index => {
                        const enable = index === 1;
                        dispatch(
                            setConfigValue({
                                configPin,
                                configPinState: enable !== invert, // No XOR for booleans in Typescript
                            })
                        );
                    }}
                />
            </div>
        </Card>
    );
};

export default ConfigSlideSelector;
