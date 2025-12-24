/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    classNames,
    NoticeBox,
    NumberInput,
    Overlay,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import DirtyDot from '../../app/DirtyDot';
import {
    getPmicConfigValue,
    getPmicConfigValueDirty,
    setPmicConfigValue,
} from '../Configuration/boardControllerConfigSlice';

interface VoltageConfigurationProps {
    pmicPort: number[];
    voltageMin: number;
    voltageMax: number;
    pmicPortLabel?: string;
    pmicPortDescription?: string;
    pmicPortWarning?: string;
    tooltip?: string;
}

const VoltageConfiguration = ({
    pmicPort,
    voltageMin,
    voltageMax,
    pmicPortLabel,
    pmicPortDescription,
    pmicPortWarning,
    tooltip,
}: VoltageConfigurationProps) => {
    const dispatch = useDispatch();

    const pmicPortLocal = pmicPort[0];
    const voltage =
        useSelector(getPmicConfigValue(pmicPortLocal)) ?? voltageMin; // Default to voltageMin

    const dirty = useSelector(getPmicConfigValueDirty(pmicPortLocal));

    const label = pmicPortLabel ?? `Voltage port ${pmicPort}`;
    const description =
        pmicPortDescription ??
        `Set voltage for PMIC port ${pmicPort} (${label})`;

    // Voltage presets in lieu of presets in board definition files
    const voltagePresetValues = [1200, 1800, 3300, 2500, 1500]
        .filter(
            filterVoltage =>
                filterVoltage >= voltageMin && filterVoltage <= voltageMax,
        )
        .slice(0, 3)
        .sort((a, b) => a - b);

    return (
        <Card
            title={
                <div className="tw-relative tw-flex tw-content-between">
                    <span className="tw-pr-4 tw-text-left tw-leading-5">
                        {label}
                        <span className="align-top tw-ml-1 tw-inline-flex tw-items-start">
                            <DirtyDot dirty={dirty} />
                        </span>
                    </span>
                </div>
            }
        >
            <div className="tw-flex tw-flex-col">
                <NumberInput
                    showSlider
                    label={
                        tooltip ? (
                            <Overlay
                                tooltipId="tooltip"
                                tooltipChildren={
                                    <div className="tw-preflight tw-flex tw-flex-col tw-gap-4 tw-bg-gray-900 tw-px-4 tw-py-2 tw-text-left tw-text-gray-100">
                                        <p>{tooltip}</p>
                                    </div>
                                }
                            >
                                <span>
                                    {description}{' '}
                                    <span className="mdi mdi-help-circle-outline" />
                                </span>
                            </Overlay>
                        ) : (
                            description
                        )
                    }
                    unit="mV"
                    range={{ min: voltageMin, max: voltageMax, step: 100 }}
                    value={voltage}
                    onChange={value => {
                        pmicPort.forEach(p => {
                            dispatch(
                                setPmicConfigValue({
                                    pmicConfigPort: p,
                                    configPinState: value,
                                }),
                            );
                        });
                    }}
                />
            </div>
            {pmicPortWarning && (
                <div className="tw-mb-2 tw-mt-4">
                    <NoticeBox
                        mdiIcon="mdi-lightbulb-alert-outline"
                        color="tw-text-red"
                        title={pmicPortWarning}
                        content={null}
                    />
                </div>
            )}
            <VoltagePresetButtons
                voltages={voltagePresetValues}
                pmicPorts={pmicPort}
                setVoltage={voltage}
            />
        </Card>
    );
};

interface VoltagePresetButtonsProps {
    pmicPorts: number[];
    voltages: number[];
    setVoltage: number;
}

const VoltagePresetButtons = ({
    pmicPorts,
    voltages,
    setVoltage,
}: VoltagePresetButtonsProps) => (
    <div id="preset-buttons" className="tw-mb-2 tw-flex tw-gap-1 tw-pt-4">
        {voltages.map(voltage => (
            <PresetButton
                key={`voltage-preset-${pmicPorts}-${voltage}`}
                pmicPorts={pmicPorts}
                voltage={voltage}
                selected={setVoltage === voltage}
            />
        ))}
    </div>
);

interface PresetButtonProps {
    pmicPorts: number[];
    voltage: number;
    selected?: boolean;
}

const PresetButton = ({ pmicPorts, voltage, selected }: PresetButtonProps) => {
    const dispatch = useDispatch();

    return (
        <button
            type="button"
            className={classNames(
                'tw-preflight tw-h-5 tw-w-full tw-border-gray-200 tw-px-2 tw-text-xs',
                'tw-border tw-text-gray-700 active:enabled:tw-bg-gray-50',
                selected ? 'tw-bg-white' : 'tw-bg-gray-50',
            )}
            onClick={() => {
                pmicPorts.forEach(p => {
                    dispatch(
                        setPmicConfigValue({
                            pmicConfigPort: p,
                            configPinState: voltage,
                        }),
                    );
                });
            }}
        >
            {(voltage / 1000).toFixed(1)}V
        </button>
    );
};

export default VoltageConfiguration;
