/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfConnectState } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { combineReducers } from 'redux';

import boardControllerConfigSlice from '../features/Configuration/boardControllerConfigSlice';
import deviceSlice from '../features/Device/deviceSlice';

type AppState = ReturnType<typeof appReducer>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState extends NrfConnectState<AppState> {}

const appReducer = combineReducers({
    boardControllerConfig: boardControllerConfigSlice.reducer,
    device: deviceSlice.reducer,
});

export default appReducer;
