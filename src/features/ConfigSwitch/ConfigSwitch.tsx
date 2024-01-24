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
    Toggle,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getConfigValue,
    setConfigValue,
} from '../Configuration/boardControllerConfigSlice';

interface ConfigSwitchProps {
    configTitle: string;
    configLabel: string;
    configPin: number;
    enableLabel?: string;
    invert?: boolean;
}

const ConfigSwitch = ({
    configTitle,
    configLabel,
    configPin,
    enableLabel = 'Enable',
    invert = false,
}: ConfigSwitchProps) => {
    const dispatch = useDispatch();

    const toggleEnable = useSelector(getConfigValue(configPin)) !== invert; // No XOR for booleans in TypeScript :/

    return (
        <Card
            title={
                <div className="d-flex justify-content-between">
                    <span>{configTitle}</span>
                    <Toggle
                        label={enableLabel}
                        isToggled={toggleEnable}
                        onToggle={enable =>
                            dispatch(
                                setConfigValue({
                                    configPin,
                                    configPinState: enable !== invert, // No XOR for booleans in Typescript
                                })
                            )
                        }
                    />
                </div>
            }
        >
            <div className="d-flex justify-content-between">
                <div>{configLabel}</div>
            </div>
        </Card>
    );
};

export default ConfigSwitch;
