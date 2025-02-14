/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    createSelector,
    createSlice,
    Draft,
    PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '../../app/appReducer';
import { BoardConfiguration } from './hardwareConfiguration';

interface ConfigState {
    boardControllerConfigData: Map<number, boolean>;
    boardControllerConfigDataDirty: Map<number, boolean>;
    pmicConfigData: Map<number, number>;
    pmicConfigDataDirty: Map<number, boolean>;
    hardwareConfig: BoardConfiguration;
    defaultConfig: BoardConfiguration;
}

// nRF54H20 default config
const initialState: ConfigState = {
    boardControllerConfigData: new Map([]),
    boardControllerConfigDataDirty: new Map([]),
    // This might be needed pmicConfigData: new Map([[1, 1800]]),
    pmicConfigData: new Map([]),
    pmicConfigDataDirty: new Map([]),
    hardwareConfig: {},
    defaultConfig: {},
};

const boardControllerConfigSlice = createSlice({
    name: 'boardControllerConfig',
    initialState,
    reducers: {
        setConfig(
            state,
            {
                payload: { boardControllerConfig },
            }: PayloadAction<{ boardControllerConfig: Map<number, boolean> }>
        ) {
            state.boardControllerConfigData = boardControllerConfig;

            // Update dirty flags on all config pins
            boardControllerConfig.forEach((_, configPin) => {
                updateConfigPinDirtyFlag(state, configPin);
            });
        },

        setConfigValue(
            state,
            {
                payload: { configPin, configPinState },
            }: PayloadAction<{ configPin: number; configPinState: boolean }>
        ) {
            state.boardControllerConfigData.set(configPin, configPinState);

            updateConfigPinDirtyFlag(state, configPin);
        },

        clearConfig(state) {
            state.boardControllerConfigData.clear();
            state.boardControllerConfigDataDirty.clear();
            state.pmicConfigDataDirty.clear();
        },

        clearDirtyFlags(state) {
            state.boardControllerConfigDataDirty.clear();
            state.pmicConfigDataDirty.clear();
        },

        setPmicConfig(
            state,
            {
                payload: { pmicConfig },
            }: PayloadAction<{ pmicConfig: Map<number, number> }>
        ) {
            state.pmicConfigData = pmicConfig;

            pmicConfig.forEach((_, pmicPort) =>
                updatePmicConfigPortDirtyFlag(state, pmicPort)
            );
        },
        setPmicConfigValue(
            state,
            {
                payload: { pmicConfigPort, configPinState },
            }: PayloadAction<{ pmicConfigPort: number; configPinState: number }>
        ) {
            state.pmicConfigData.set(pmicConfigPort, configPinState);

            updatePmicConfigPortDirtyFlag(state, pmicConfigPort);
        },
        clearPmicConfig(state) {
            state.pmicConfigData.clear();
        },

        setHardwareConfig(
            state,
            {
                payload: { hardwareConfig },
            }: PayloadAction<{ hardwareConfig: BoardConfiguration }>
        ) {
            state.hardwareConfig = hardwareConfig;
        },

        clearHardwareConfig(state) {
            state.hardwareConfig = {};
        },
        setDefaultConfig(
            state,
            {
                payload: { defaultConfig },
            }: PayloadAction<{ defaultConfig: BoardConfiguration }>
        ) {
            state.defaultConfig = defaultConfig;
        },

        clearDefaultConfig(state) {
            state.defaultConfig = {};
        },
    },
});

export const getConfigValue =
    (configPin: number) =>
    (state: RootState): boolean =>
        state.app.boardControllerConfig.boardControllerConfigData.get(
            configPin
        ) === true;

export const getPmicConfigValue =
    (pmicPort: number) =>
    (state: RootState): number | undefined =>
        state.app.boardControllerConfig.pmicConfigData.get(pmicPort);

export const getConfigPinDirty =
    (configPin: number) =>
    (state: RootState): boolean =>
        state.app.boardControllerConfig.boardControllerConfigDataDirty.get(
            configPin
        ) === true;

export const getPmicConfigValueDirty =
    (pmicPort: number) =>
    (state: RootState): boolean =>
        state.app.boardControllerConfig.pmicConfigDataDirty.get(pmicPort) ===
        true;

export const getAnyConfigPinDirty = (state: RootState) =>
    Array.from(
        (
            state.app.boardControllerConfig
                .boardControllerConfigDataDirty as Map<number, boolean>
        ).values()
    ).includes(true) ||
    Array.from(
        (
            state.app.boardControllerConfig.pmicConfigDataDirty as Map<
                number,
                boolean
            >
        ).values()
    ).includes(true);

export const tempGetBoardControllerConfig = (state: RootState) =>
    state.app.boardControllerConfig;

export const getConfigData = (state: RootState) =>
    state.app.boardControllerConfig.boardControllerConfigData;

export const getConfigDataDirty = (state: RootState) =>
    state.app.boardControllerConfig.boardControllerConfigDataDirty;

export const getPmicConfigData = (state: RootState) =>
    state.app.boardControllerConfig.pmicConfigData;

export const getPmicConfigDataDirty = (state: RootState) =>
    state.app.boardControllerConfig.pmicConfigDataDirty;

export const getHardwareConfig = (state: RootState) =>
    state.app.boardControllerConfig.hardwareConfig;

export const getDefaultConfig = (state: RootState) =>
    state.app.boardControllerConfig.defaultConfig;

export const getConfigArray = createSelector(
    [getConfigData, getPmicConfigData],
    (configData: Map<number, boolean>, pmicConfigData: Map<number, number>) => [
        avoidEmptyConfigArray(sortAndFlatten(configData)),
        ...(pmicConfigData.size > 0 ? [sortAndFlatten(pmicConfigData)] : []),
    ]
);

function sortAndFlatten(pinMap: Map<number, number | boolean>) {
    const keys = Array.from(pinMap.keys());
    return keys.sort((a, b) => a - b).flatMap(key => [key, pinMap.get(key)]);
}

function avoidEmptyConfigArray(array: (number | boolean | undefined)[]) {
    if (array.length === 0) {
        return [255, false];
    }

    return array;
}

function updateConfigPinDirtyFlag(
    state: Draft<ConfigState>,
    configPin: number
) {
    // Update dirty flag
    state.boardControllerConfigDataDirty.set(
        configPin,
        computeDirtyFlag(
            state.boardControllerConfigData.get(configPin),
            state.hardwareConfig.pins?.get(configPin),
            state.defaultConfig.pins?.get(configPin)
        )
    );
}

function updatePmicConfigPortDirtyFlag(
    state: Draft<ConfigState>,
    configPort: number
) {
    // Update dirty flag
    state.pmicConfigDataDirty.set(
        configPort,
        computeDirtyFlag(
            state.pmicConfigData.get(configPort),
            state.hardwareConfig.pmicPorts?.get(configPort),
            state.defaultConfig.pmicPorts?.get(configPort)
        )
    );
}

function computeDirtyFlag<T>(
    configState: T,
    currentHardwareConfig: T,
    defaultConfig: T
): boolean {
    // The value is dirty if..
    return (
        // the current config is not what is stored on the board
        (currentHardwareConfig !== undefined &&
            configState !== currentHardwareConfig) ||
        // .. or current config is not the default when no value is stored on the board
        (currentHardwareConfig === undefined && configState !== defaultConfig)
    );
}

export const {
    setConfig,
    setConfigValue,
    clearConfig,
    clearDirtyFlags,
    setPmicConfig,
    setPmicConfigValue,
    clearPmicConfig,
    setHardwareConfig,
    clearHardwareConfig,
    setDefaultConfig,
    clearDefaultConfig,
} = boardControllerConfigSlice.actions;

export default boardControllerConfigSlice;
