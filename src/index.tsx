/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { App, render } from '@nordicsemiconductor/pc-nrfconnect-shared';

import BoilerplateDeviceSelector from './app/DeviceSelector';
import appReducer from './app/appReducer';
import Configuration from './features/Configuration/Configuration';
import SidePanel from './SidePanel';

// nRF Connect Board Configurator
// ==============================
//
// The Board Configurator helps configuring the Board Controller on the
// nRF5340 IMCU on newer nRF devkits. The Board Controller will toggle
// features on the devkit, like switching between internal or external
// antenna, or which SIM option to use.

render(
    <App
        appReducer={appReducer}
        deviceSelect={<BoilerplateDeviceSelector />}
        sidePanel={<SidePanel />}
        feedback
        panes={[{ name: 'Configuration', Main: Configuration }]}
    />
);
