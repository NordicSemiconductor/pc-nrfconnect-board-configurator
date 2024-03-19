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
    Toggle,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getConfigValue,
    setConfigValue,
} from '../Configuration/boardControllerConfigSlice';

interface ConfigSwitchProps {
    configTitle: string;
    configLabel: string;
    configTooltip?: string;
    configPin: number;
    invert?: boolean;
}

const ConfigSwitch = ({
    configTitle,
    configLabel,
    configTooltip,
    configPin,
    invert = false,
}: ConfigSwitchProps) => {
    const dispatch = useDispatch();

    const toggleEnable = xor(useSelector(getConfigValue(configPin)), invert);

    return (
        <Card
            title={
                <div>
                    <Toggle
                        isToggled={toggleEnable}
                        onToggle={enable =>
                            dispatch(
                                setConfigValue({
                                    configPin,
                                    configPinState: xor(enable, invert),
                                })
                            )
                        }
                    >
                        <span className="h5">{configTitle}</span>
                    </Toggle>
                </div>
            }
        >
            {configTooltip ? (
                <Overlay
                    tooltipId="tooltip"
                    tooltipChildren={
                        <div className="tw-preflight tw-flex tw-flex-col tw-gap-4 tw-bg-gray-900 tw-px-4 tw-py-2 tw-text-left tw-text-gray-100">
                            <p className="tooltip-text">{configTooltip}</p>
                        </div>
                    }
                >
                    <div className="tw-flex tw-content-between">
                        <div className="tw-flex-grow">{configLabel}</div>
                        <span className="mdi mdi-help-circle-outline" />
                    </div>
                </Overlay>
            ) : (
                <div className="tw-flex-grow">{configLabel}</div>
            )}
        </Card>
    );
};

const xor = (a: boolean, b: boolean): boolean => a !== b; // No XOR for booleans in TypeScript :/

export default ConfigSwitch;
