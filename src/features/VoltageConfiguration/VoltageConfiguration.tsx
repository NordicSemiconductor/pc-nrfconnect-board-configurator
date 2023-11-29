/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Card,
    NumberInputSliderWithUnit,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getPmicConfigValue,
    setPmicConfigValue,
} from '../Configuration/boardControllerConfigSlice';

const VoltageConfiguration: React.FC<{
    pmicPort: number;
    voltageMin: number;
    voltageMax: number;
}> = ({ pmicPort, voltageMin, voltageMax }) => {
    const dispatch = useDispatch();
    const voltage = useSelector(getPmicConfigValue(pmicPort)) ?? voltageMin; // Default to voltageMin

    return (
        <Card
            title={
                <div className="d-flex justify-content-between">
                    <span>Voltage</span>
                </div>
            }
        >
            <div className="tw-flex tw-gap-1">
                <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() => {
                        // Set voltage to 1800
                        dispatch(
                            setPmicConfigValue({
                                pmicConfigPort: pmicPort,
                                configPinState: 1800,
                            })
                        );
                    }}
                >
                    1.8V
                </Button>
                <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() => {
                        // Set voltage to 1800
                        dispatch(
                            setPmicConfigValue({
                                pmicConfigPort: pmicPort,
                                configPinState: 2000,
                            })
                        );
                    }}
                >
                    2.0V
                </Button>
                <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() => {
                        // Set voltage to 3000
                        dispatch(
                            setPmicConfigValue({
                                pmicConfigPort: pmicPort,
                                configPinState: 3000,
                            })
                        );
                    }}
                >
                    3.0V
                </Button>
            </div>
            <div className="tw-flex tw-flex-col">
                <NumberInputSliderWithUnit
                    label="Voltage"
                    unit="mV"
                    range={{ min: voltageMin, max: voltageMax, step: 100 }}
                    value={voltage}
                    onChange={value => {
                        dispatch(
                            setPmicConfigValue({
                                pmicConfigPort: pmicPort,
                                configPinState: value,
                            })
                        );
                    }}
                />
            </div>
        </Card>
    );
};

export default VoltageConfiguration;
