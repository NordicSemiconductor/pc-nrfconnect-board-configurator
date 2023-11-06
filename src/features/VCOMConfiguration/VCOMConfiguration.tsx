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

const VCOMConfiguration: React.FC<{
    vcomName: string;
    vcomEnablePin: number;
    hwfcEnablePin: number;
    enableInvert: boolean;
    hwfcInvert: boolean;
}> = ({ vcomName, vcomEnablePin, hwfcEnablePin, enableInvert, hwfcInvert }) => {
    logger.info(`Rendering VCOMConfiguration for ${vcomName}`);

    const dispatch = useDispatch();

    const vcomEnable =
        useSelector(getConfigValue(vcomEnablePin)) !== enableInvert; // No XOR for booleans in Typescript
    const hwfcEnable =
        useSelector(getConfigValue(hwfcEnablePin)) !== hwfcInvert; // No XOR for booleans in Typescript

    return (
        <Card
            title={
                <div className="d-flex justify-content-between">
                    <span>{vcomName}</span>
                    <Toggle
                        isToggled={vcomEnable}
                        onToggle={enableVcom => {
                            dispatch(
                                setConfigValue({
                                    configPin: vcomEnablePin,
                                    configPinState: enableVcom !== enableInvert, // No XOR for booleans in Typescript
                                })
                            );
                        }}
                    >
                        Enable
                    </Toggle>
                </div>
            }
        >
            <div className="d-flex justify-content-between">
                <span>{vcomName} HWFC</span>
                <Toggle
                    isToggled={hwfcEnable}
                    onToggle={enableHwfc => {
                        dispatch(
                            setConfigValue({
                                configPin: hwfcEnablePin,
                                configPinState: enableHwfc !== hwfcInvert, // No XOR for booleans in Typescript
                            })
                        );
                    }}
                >
                    Enable
                </Toggle>
            </div>
        </Card>
    );
};

export default VCOMConfiguration;
