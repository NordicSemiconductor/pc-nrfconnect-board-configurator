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

    const vcomEnable = xor(
        useSelector(getConfigValue(vcomEnablePin)),
        enableInvert
    );
    const hwfcEnable = xor(
        useSelector(getConfigValue(hwfcEnablePin)),
        hwfcInvert
    );

    return (
        <Card
            title={
                <div>
                    <Toggle
                        isToggled={vcomEnable}
                        onToggle={enableVcom => {
                            dispatch(
                                setConfigValue({
                                    configPin: vcomEnablePin,
                                    configPinState: xor(
                                        enableVcom,
                                        enableInvert
                                    ),
                                })
                            );
                            // Also diconnect HWFC if VCOM is disconnected
                            dispatch(
                                setConfigValue({
                                    configPin: hwfcEnablePin,
                                    configPinState: xor(enableVcom, hwfcInvert),
                                })
                            );
                        }}
                    >
                        <Overlay
                            tooltipId={`tooltip_${vcomName}`}
                            tooltipChildren={
                                <div className="tw-preflight tw-flex tw-flex-col tw-gap-4 tw-bg-gray-900 tw-px-4 tw-py-2 tw-text-left tw-text-gray-100">
                                    <p className="tooltip-text">
                                        Connect or disconnect the pins used for
                                        the virtual COM port. When disconnected,
                                        the corresponding UART GPIO pins can be
                                        used for other purposes.
                                    </p>
                                </div>
                            }
                        >
                            <span className="h5">
                                Connect port {vcomName}{' '}
                                <span className="mdi mdi-help-circle-outline" />
                            </span>
                        </Overlay>
                    </Toggle>
                </div>
            }
        >
            <div>
                <Toggle
                    disabled={!vcomEnable}
                    isToggled={hwfcEnable && vcomEnable}
                    onToggle={enableHwfc => {
                        dispatch(
                            setConfigValue({
                                configPin: hwfcEnablePin,
                                configPinState: xor(enableHwfc, hwfcInvert),
                            })
                        );
                    }}
                >
                    <Overlay
                        tooltipId={`tooltip_hwfc_${vcomName}`}
                        tooltipChildren={
                            <div className="tw-preflight tw-flex tw-flex-col tw-gap-4 tw-bg-gray-900 tw-px-4 tw-py-2 tw-text-left tw-text-gray-100">
                                <p className="tooltip-text">
                                    Connect or disconnect the Hardware Flow
                                    Control pins for the virtual COM port. When
                                    disconnected, the HWFC GPIO pins for the
                                    target chip can be used for other purposes.
                                    When connected, an autodetect feature is
                                    used to determine whether or not HWFC is
                                    enabled on the target chip.
                                </p>
                            </div>
                        }
                    >
                        <span>
                            {vcomName} HWFC autodetect lines
                            <span className="mdi mdi-help-circle-outline tw-pl-1" />
                        </span>
                    </Overlay>
                </Toggle>
            </div>
        </Card>
    );
};

const xor = (a: boolean, b: boolean): boolean => a !== b; // No XOR for booleans in TypeScript

export default VCOMConfiguration;
