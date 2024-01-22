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
    Overlay,
    Toggle,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getConfigValue,
    setConfigValue,
} from '../Configuration/boardControllerConfigSlice';

import './vcomconfig.scss';

interface VCOMConfigurationProps {
    vcomName: string;
    vcomEnablePin: number;
    hwfcEnablePin: number;
    enableInvert: boolean;
    hwfcInvert: boolean;
}

const VCOMConfiguration = ({
    vcomName,
    vcomEnablePin,
    hwfcEnablePin,
    enableInvert,
    hwfcInvert,
}: VCOMConfigurationProps) => {
    logger.debug(`Rendering VCOMConfiguration for ${vcomName}`);

    const dispatch = useDispatch();

    const vcomEnable =
        useSelector(getConfigValue(vcomEnablePin)) !== enableInvert; // No XOR for booleans in Typescript
    const hwfcEnable =
        useSelector(getConfigValue(hwfcEnablePin)) !== hwfcInvert; // No XOR for booleans in Typescript

    return (
        <Card
            title={
                <div className="d-flex justify-content-between">
                    <Overlay
                        tooltipId={`tooltip_${vcomName}`}
                        tooltipChildren={
                            <p className="tooltip-text">
                                Connect or disconnect the pins used for the
                                virtual COM port. When disconnected the
                                corresponding UART GPIO pins can be used for
                                other purposes.
                            </p>
                        }
                    >
                        <span>Enable virtual COM port {vcomName} &#9432;</span>
                    </Overlay>
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
                <Overlay
                    tooltipId={`tooltip_hwfc_${vcomName}`}
                    tooltipChildren={
                        <p className="tooltip-text">
                            Connect or disconnect the Hardware Flow Control pins
                            for the virtual COM port. When disconnected, the
                            HWFC GPIO pins for the target chip can be used for
                            other purposes. When connected, an autodetect
                            feature is used to determine whether or not HWFC is
                            enabled on the target chip.
                        </p>
                    }
                >
                    <span>
                        Connect {vcomName} HWFC autodetect lines &#9432;
                    </span>
                </Overlay>
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
