/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { logger } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../app/appReducer';

interface BoardRevision {
    major: number;
    minor: number;
    patch: number;
}

interface DeviceState {
    boardRevision?: BoardRevision;
    boardControllerFirmwareVersion?: string;
}

const initialState: DeviceState = {};

const deviceSlice = createSlice({
    name: 'deviceInformation',
    initialState,
    reducers: {
        setBoardRevision(
            state,
            { payload: boardRevision }: PayloadAction<BoardRevision>
        ) {
            state.boardRevision = boardRevision;
        },

        clearBoardRevision(state) {
            delete state.boardRevision;
        },

        setBoardControllerFirmwareVersion(
            state,
            { payload: bcFwRevision }: PayloadAction<string>
        ) {
            state.boardControllerFirmwareVersion = bcFwRevision;
        },

        clearBoardControllerFirmwareVersion(state) {
            delete state.boardControllerFirmwareVersion;
        },
    },
});

export const getBoardRevision = (state: RootState) =>
    state.app.device.boardRevision;

export const getBoardRevisionSemver = (state: RootState) => {
    if (state.app.device.boardRevision === undefined) {
        return undefined;
    }
    logger.debug(`revision: ${JSON.stringify(state.app.device.boardRevision)}`);
    const { major, minor, patch } = state.app.device.boardRevision;
    return `${major}.${minor}.${patch}`;
};

export const getBoardControllerFirmwareVersion = (state: RootState) =>
    state.app.device.boardControllerFirmwareVersion;

export const {
    setBoardRevision,
    clearBoardRevision,
    setBoardControllerFirmwareVersion,
    clearBoardControllerFirmwareVersion,
} = deviceSlice.actions;

export default deviceSlice;
