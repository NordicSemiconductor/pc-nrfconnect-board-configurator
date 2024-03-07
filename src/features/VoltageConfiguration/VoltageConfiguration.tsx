/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Card,
    NumberInput,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getPmicConfigValue,
    setPmicConfigValue,
} from '../Configuration/boardControllerConfigSlice';

interface VoltageConfigurationProps {
    pmicPort: number;
    voltageMin: number;
    voltageMax: number;
    pmicPortLabel?: string;
    pmicPortDescription?: string;
}

const VoltageConfiguration = ({
    pmicPort,
    voltageMin,
    voltageMax,
    pmicPortLabel,
    pmicPortDescription,
}: VoltageConfigurationProps) => {
    const dispatch = useDispatch();
    const voltage = useSelector(getPmicConfigValue(pmicPort)) ?? voltageMin; // Default to voltageMin

    const label = pmicPortLabel ?? `Voltage port ${pmicPort}`;
    const description =
        pmicPortDescription ??
        `Set voltage for PMIC port ${pmicPort} (${label})`;

    // Voltage presets in lieu of presets in board definition files
    const voltagePresetValues = [1200, 1800, 2500, 3300, 1500]
        .filter(
            filterVoltage =>
                filterVoltage >= voltageMin && filterVoltage <= voltageMax
        )
        .slice(0, 3)
        .sort((a, b) => a - b);

    return (
        <Card
            title={
                <div className="tw-flex tw-content-between">
                    <span>{label}</span>
                </div>
            }
        >
            {description && (
                <div>
                    <p>{description}</p>
                </div>
            )}

            <VoltagePresetButtons
                voltages={voltagePresetValues}
                pmicPort={pmicPort}
            />

            <div className="tw-flex tw-flex-col">
                <NumberInput
                    showSlider
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

interface VoltagePresetButtonsProps {
    pmicPort: number;
    voltages: number[];
}

const VoltagePresetButtons = ({
    pmicPort,
    voltages,
}: VoltagePresetButtonsProps) => (
    <div id="preset-buttons" className="tw-flex tw-gap-1">
        {voltages.map(voltage => (
            <PresetButton
                key={`voltage-preset-${pmicPort}-${voltage}`}
                pmicPort={pmicPort}
                voltage={voltage}
            />
        ))}
    </div>
);

interface PresetButtonProps {
    pmicPort: number;
    voltage: number;
}

const PresetButton = ({ pmicPort, voltage }: PresetButtonProps) => {
    const dispatch = useDispatch();

    return (
        <Button
            variant="secondary"
            className="tw-w-full"
            onClick={() => {
                dispatch(
                    setPmicConfigValue({
                        pmicConfigPort: pmicPort,
                        configPinState: voltage,
                    })
                );
            }}
        >
            {(voltage / 1000).toFixed(1)}V
        </Button>
    );
};

export default VoltageConfiguration;
