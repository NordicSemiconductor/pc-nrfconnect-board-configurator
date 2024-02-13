/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

type PinDefinition = {
    pin: number;
    invert?: boolean;
};

type VcomConfigPinDefinition = {
    type: 'vcom';
    id: string;
    name: string;
    enable: PinDefinition;
    hwfc: PinDefinition;
};

type SwitchConfigDefinition = {
    type: 'switch';
    id: string;
    title: string;
    label: string;
    enable: PinDefinition;
};

type SlideConfigDefinition = {
    type: 'slide';
    id: string;
    title: string;
    label: string;
    enable: PinDefinition;
    alternatives: [string, string];
};

type PmicPortDefinition = {
    type: 'voltage';
    port: number;
    mVmin: number;
    mVmax: number;
};

type BoardDefinition = {
    boardVersion: string;
    boardRevision?: string;
    boardName?: string;
};

type ConfigPin = { pin: number; state: boolean };
type PmicConfigPort = { port: number; voltage: number };

type PinType =
    | SwitchConfigDefinition
    | SlideConfigDefinition
    | VcomConfigPinDefinition;

type BoardControllerConfigDefinition = {
    board: BoardDefinition;
    pins: PinType[];
    pmicPorts?: PmicPortDefinition[];
    defaults?: {
        pins?: ConfigPin[];
        pmicPorts?: PmicConfigPort[];
    };
};

export default BoardControllerConfigDefinition;
