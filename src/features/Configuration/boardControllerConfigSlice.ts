/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../appReducer';

interface ConfigState {
    boardControllerConfigData: Map<number, boolean>;
    pmicConfigData: Map<number, number>;
}

// nRF54H20 default config
const initialState: ConfigState = {
    boardControllerConfigData: new Map([]),
    pmicConfigData: new Map([[1, 1800]]),
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
        },

        setConfigValue(
            state,
            {
                payload: { configPin, configPinState },
            }: PayloadAction<{ configPin: number; configPinState: boolean }>
        ) {
            state.boardControllerConfigData.set(configPin, configPinState);
        },

        clearConfig(state) {
            state.boardControllerConfigData.clear();
        },

        setPmicConfig(
            state,
            {
                payload: { pmicConfig },
            }: PayloadAction<{ pmicConfig: Map<number, number> }>
        ) {
            state.pmicConfigData = pmicConfig;
        },
        setPmicConfigValue(
            state,
            {
                payload: { pmicConfigPort, configPinState },
            }: PayloadAction<{ pmicConfigPort: number; configPinState: number }>
        ) {
            state.pmicConfigData.set(pmicConfigPort, configPinState);
        },
        clearPmicConfig(state) {
            state.pmicConfigData.clear();
        },
    },
});

export const getConfigValue =
    (configPin: number) =>
    (state: RootState): boolean =>
        (state.app.boardControllerConfig.boardControllerConfigData.get(
            configPin
        ) === true);

export const getPmicConfigValue =
    (pmicPort: number) =>
    (state: RootState): number | undefined =>
        state.app.boardControllerConfig.pmicConfigData.get(pmicPort);

export const getConfigData = (state: RootState) =>
    state.app.boardControllerConfig.boardControllerConfigData;

export const getPmicConfigData = (state: RootState) =>
    state.app.boardControllerConfig.pmicConfigData;

export const getConfigArray = createSelector(
    [getConfigData, getPmicConfigData],
    (configData: Map<number, boolean>, pmicConfigData: Map<number, number>) => [
        avoidEmptyConfigArray(sortAndFlatten(configData)),
        sortAndFlatten(pmicConfigData),
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

export const {
    setConfig,
    setConfigValue,
    clearConfig,
    setPmicConfig,
    setPmicConfigValue,
    clearPmicConfig,
} = boardControllerConfigSlice.actions;

export default boardControllerConfigSlice;
