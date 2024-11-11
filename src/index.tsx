/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    App,
    render,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import appReducer from './app/appReducer';
import BoilerplateDeviceSelector from './app/DeviceSelector';
import Configuration from './features/Configuration/Configuration';
import SidePanel from './SidePanel';

// Board Configurator
// ==================
//
// The Board Configurator app helps configuring the Board Controller on the
// nRF5340 IMCU on newer nRF devkits. The Board Controller will toggle
// features on the devkit, like switching between internal or external
// antenna, or which SIM option to use.

telemetry.enableTelemetry();

render(
    <App
        appReducer={appReducer}
        deviceSelect={<BoilerplateDeviceSelector />}
        sidePanel={<SidePanel />}
        panes={[{ name: 'Configuration', Main: Configuration }]}
    />
);
