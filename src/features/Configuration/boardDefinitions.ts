/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { Device } from '@nordicsemiconductor/pc-nrfconnect-shared';

import BoardControllerConfigDefinition from '../../common/boards/BoardControllerConfigDefinition';
import nrf54h20json from '../../common/boards/nrf_PCA10145_54H20.json';
import nrf9161v091json from '../../common/boards/nrf_PCA10153_0.9.1_9161.json';
import nrf9161v0100json from '../../common/boards/nrf_PCA10153_0.10.0_9161.json';
import nrf9161v100json from '../../common/boards/nrf_PCA10153_1.0.0_9161.json';
import nrf54l15v020json from '../../common/boards/nrf_PCA10156_0.2.0.json';
import nrf54l15v030json from '../../common/boards/nrf_PCA10156_0.3.0.json';
import nrf9151v020json from '../../common/boards/nrf_PCA10171_0.2.0_9151.json';
import nrf54h20v070json from '../../common/boards/nrf_PCA10175_54H20_0.7.0.json';

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
const typednrf54h20json = nrf54h20json as BoardControllerConfigDefinition;
const typednrf54h20v070json =
    nrf54h20v070json as BoardControllerConfigDefinition;
const typednrf9151v020json = nrf9151v020json as BoardControllerConfigDefinition;

export function getBoardDefinition(
    device: Device,
    boardRevision: string | undefined
): BoardDefinition {
    switch (device?.devkit?.boardVersion) {
        case 'PCA10156':
            // nRF54L15
            if (boardRevision === '0.3.0') {
                return {
                    boardControllerConfigDefinition: typednrf54l15v030json,
                };
            }

            // Default is revision 0.2.0 or 0.2.1
            return { boardControllerConfigDefinition: typednrf54l15v020json };

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
            // nRF54H20
            return { boardControllerConfigDefinition: typednrf54h20json };

        case 'PCA10171':
            // nRF9151
            return { boardControllerConfigDefinition: typednrf9151v020json };

        case 'PCA10175':
            // nRF54H20
            return { boardControllerConfigDefinition: typednrf54h20v070json };

        default:
            return { controlFlag: { unrecognizedBoard: true } };
    }
}
