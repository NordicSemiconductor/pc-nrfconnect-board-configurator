/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { type NrfConnectState } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { combineReducers } from 'redux';

import boardControllerConfigSlice from '../features/Configuration/boardControllerConfigSlice';
import deviceSlice from '../features/Device/deviceSlice';

type AppState = ReturnType<typeof appReducer>;

export type RootState = NrfConnectState<AppState>;

const appReducer = combineReducers({
    boardControllerConfig: boardControllerConfigSlice.reducer,
    device: deviceSlice.reducer,
});

export default appReducer;
