/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { Device } from '@nordicsemiconductor/pc-nrfconnect-shared';

import BoardControllerConfigDefinition from '../../common/boards/BoardControllerConfigDefinition';
import nrf54h20pdk080json from '../../common/boards/nrf_PCA10145_0.8.0_54H20.json';
import nrf9161v091json from '../../common/boards/nrf_PCA10153_0.9.1_9161.json';
import nrf9161v0100json from '../../common/boards/nrf_PCA10153_0.10.0_9161.json';
import nrf9161v100json from '../../common/boards/nrf_PCA10153_1.0.0_9161.json';
import nrf54l15v020json from '../../common/boards/nrf_PCA10156_0.2.0.json';
import nrf54l15v030json from '../../common/boards/nrf_PCA10156_0.3.0.json';
import nrf54l15v100json from '../../common/boards/nrf_PCA10156_1.0.0_L15.json';
import nrf9151v020json from '../../common/boards/nrf_PCA10171_0.2.0_9151.json';
import nrf54h20v070json from '../../common/boards/nrf_PCA10175_0.7.0_54H20.json';
import nrf54lm20v010json from '../../common/boards/nrf_PCA10184_0.1.0_54LM20.json';
import nrf54lm20v020json from '../../common/boards/nrf_PCA10184_0.2.0_54LM20.json';
import nrf54lm20v030json from '../../common/boards/nrf_PCA10184_0.3.0_54LM20.json';
import nrf54lv10v010json from '../../common/boards/nrf_PCA10188_0.1.0_54LV10.json';
import nrf9151SMAv110json from '../../common/boards/nrf_PCA10201_1.1.0_9151SMA.json';

export type BoardDefinition = {
    boardControllerConfigDefinition?: BoardControllerConfigDefinition;
    controlFlag?: {
        unrecognizedBoard?: boolean;
        unknownRevision?: boolean;
        noRevision?: boolean;
    };
};

const typednrf9161json = nrf9161v0100json as BoardControllerConfigDefinition;
const typednrf9161v091 = nrf9161v091json as BoardControllerConfigDefinition;
const typednrf9161v100 = nrf9161v100json as BoardControllerConfigDefinition;
const typednrf54l15v020json =
    nrf54l15v020json as BoardControllerConfigDefinition;
const typednrf54l15v030json =
    nrf54l15v030json as BoardControllerConfigDefinition;
const typednrf54l15v100json =
    nrf54l15v100json as BoardControllerConfigDefinition;
const typednrf54h20json = nrf54h20pdk080json as BoardControllerConfigDefinition;
const typednrf54h20v070json =
    nrf54h20v070json as BoardControllerConfigDefinition;
const typednrf9151v020json = nrf9151v020json as BoardControllerConfigDefinition;
const typednrf9151SMAv110json =
    nrf9151SMAv110json as BoardControllerConfigDefinition;
const typednrf54lv10v010json =
    nrf54lv10v010json as BoardControllerConfigDefinition;

const typednrf54lm20v010json =
    nrf54lm20v010json as BoardControllerConfigDefinition;
const typednrf54lm20v020json =
    nrf54lm20v020json as BoardControllerConfigDefinition;
const typednrf54lm20v030json =
    nrf54lm20v030json as BoardControllerConfigDefinition;

export function getBoardDefinition(
    device: Device,
    boardRevision: string | undefined,
): BoardDefinition {
    // 0.1.0 is probably r0.2.0 with a firmware configuration error
    const primalRevisionsL15 = ['0.1.0', '0.2.0', '0.2.1'];
    const midRevisionsL15Pattern = /^0\.[3-9]\.\d+$/;

    switch (device?.devkit?.boardVersion) {
        case 'PCA10156':
            // nRF54L15
            if (boardRevision && primalRevisionsL15.includes(boardRevision)) {
                return {
                    boardControllerConfigDefinition: typednrf54l15v020json,
                };
            }

            if (boardRevision && midRevisionsL15Pattern.test(boardRevision)) {
                return {
                    boardControllerConfigDefinition: typednrf54l15v030json,
                };
            }

            return { boardControllerConfigDefinition: typednrf54l15v100json };

        case 'PCA10153':
            // nRF9161
            if (boardRevision === '0.10.0') {
                return { boardControllerConfigDefinition: typednrf9161json };
            }
            if (boardRevision === '0.9.0' || boardRevision === '0.9.1') {
                return { boardControllerConfigDefinition: typednrf9161v091 };
            }
            if (boardRevision === '1.0.0') {
                return { boardControllerConfigDefinition: typednrf9161v100 };
            }

            if (!boardRevision) {
                return { controlFlag: { noRevision: true } };
            }

            // return UnrecognizedBoardRevision();
            return { controlFlag: { unknownRevision: true } };

        case 'PCA10145':
            // nRF54H20 PDK
            return { boardControllerConfigDefinition: typednrf54h20json };

        case 'PCA10188':
            // nRF54LV10
            return { boardControllerConfigDefinition: typednrf54lv10v010json };

        case 'PCA10171':
            // nRF9151
            return { boardControllerConfigDefinition: typednrf9151v020json };

        case 'PCA10201':
            // nRF9151 SMA
            return { boardControllerConfigDefinition: typednrf9151SMAv110json };

        case 'PCA10175':
            // nRF54H20
            return { boardControllerConfigDefinition: typednrf54h20v070json };

        case 'PCA10184':
            // 0.1.x
            if (boardRevision && /^0\.1\.\d+$/.test(boardRevision)) {
                return {
                    boardControllerConfigDefinition: typednrf54lm20v010json,
                };
            }

            // 0.2.x
            if (boardRevision && /^0\.2\.\d+$/.test(boardRevision)) {
                return {
                    boardControllerConfigDefinition: typednrf54lm20v020json,
                };
            }

            return { boardControllerConfigDefinition: typednrf54lm20v030json };

        case 'PCA10197':
            // also nRF54LM20
            return { boardControllerConfigDefinition: typednrf54lm20v010json };

        default:
            return { controlFlag: { unrecognizedBoard: true } };
    }
}

type PinDescription = {
    id: string;
    inverted: boolean;
};

export function generatePinMap(
    boardControllerConfigDefinition:
        | BoardControllerConfigDefinition
        | undefined,
): Map<number, PinDescription> {
    const pinMap = new Map<number, PinDescription>();

    boardControllerConfigDefinition?.pins.forEach(pin => {
        switch (pin.type) {
            case 'switch':
                pinMap.set(pin.enable.pin, {
                    id: pin.id,
                    inverted: pin.enable.invert === true,
                });
                break;
            case 'slide':
                pinMap.set(pin.enable.pin, {
                    id: pin.id,
                    inverted: pin.enable.invert === true,
                });
                break;
            case 'vcom':
                pinMap.set(pin.enable.pin, {
                    id: pin.id,
                    inverted: pin.enable.invert === true,
                });
                pinMap.set(pin.hwfc.pin, {
                    id: `${pin.id}-hwfc`,
                    inverted: pin.hwfc.invert === true,
                });
                break;
        }
    });

    return pinMap;
}

type PmicPortDescription = {
    id: string;
};

export function generatePortMap(
    boardControllerConfigDefinition:
        | BoardControllerConfigDefinition
        | undefined,
): Map<number, PmicPortDescription> {
    const pinMap = new Map<number, PmicPortDescription>();

    boardControllerConfigDefinition?.pmicPorts?.forEach(port => {
        const portId = port.portId;

        if (!portId) {
            return;
        }

        if (!Array.isArray(port.port) || !Array.isArray(port.portId)) {
            console.warn(`Port must not be an array`, port);
            return;
        }

        port.port.forEach((p, idx) => {
            pinMap.set(p, { id: portId[idx] });
        });
    });

    return pinMap;
}
