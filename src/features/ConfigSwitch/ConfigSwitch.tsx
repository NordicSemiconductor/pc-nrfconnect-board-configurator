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

const ConfigSwitch: React.FC<{
    configTitle: string;
    configLabel: string;
    configPin: number;
    enableLabel?: string;
    invert?: boolean;
}> = ({
    configTitle,
    configLabel,
    configPin,
    enableLabel = 'Enable',
    invert = false,
}) => {
    logger.debug(`Rendering ConfigSwitch for ${configTitle}`);

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
