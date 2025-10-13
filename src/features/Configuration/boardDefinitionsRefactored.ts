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

type BoardId =
    | 'PCA10145'
    | 'PCA10153'
    | 'PCA10156'
    | 'PCA10171'
    | 'PCA10175'
    | 'PCA10184'
    | 'PCA10188'
    | 'PCA10197';

type SemVer = `${number}.${number}.${number}`;

type BoardVariant =
    | {
          kind: 'nRF54L15';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | {
          kind: 'nRF54L15';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | {
          kind: 'nRF54L15';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | {
          kind: 'nRF9161';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | {
          kind: 'nRF9161';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | {
          kind: 'nRF9161';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | {
          kind: 'nRF54H20';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | {
          kind: 'nRF54LV10';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | {
          kind: 'nRF9151';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | {
          kind: 'nRF54LM20';
          revision?: SemVer;
          def: BoardControllerConfigDefinition;
      }
    | { kind: 'UnknownBoard'; def?: undefined };

function mapBoardIdToKind(boardId: BoardId): BoardVariant['kind'] {
    switch (boardId) {
        case 'PCA10156':
            return 'nRF54L15';
        case 'PCA10153':
            return 'nRF9161';
        case 'PCA10145':
            return 'nRF54H20';
        case 'PCA10188':
            return 'nRF54LV10';
        case 'PCA10171':
            return 'nRF9151';
        case 'PCA10175':
            return 'nRF54H20';
        case 'PCA10184':
        case 'PCA10197':
            return 'nRF54LM20';
        default:
            return 'UnknownBoard';
    }
}

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
    boardRevision?: `${number}.${number}.${number}`
): BoardVariant {
    const kind = mapBoardIdToKind(device?.devkit?.boardVersion as BoardId);

    switch (kind) {
        case 'nRF54L15':
            if (
                boardRevision &&
                ['0.1.0', '0.2.0', '0.2.1'].includes(boardRevision)
            )
                return {
                    kind,
                    revision: boardRevision,
                    def: typednrf54l15v020json,
                };
            if (boardRevision && /^0\.[3-9]\.\d+$/.test(boardRevision))
                return {
                    kind,
                    revision: boardRevision,
                    def: typednrf54l15v030json,
                };
            return { kind, revision: '1.0.0', def: typednrf54l15v100json };

        case 'nRF9161':
            if (boardRevision === '0.10.0')
                return { kind, revision: boardRevision, def: typednrf9161json };
            if (boardRevision === '0.9.0' || boardRevision === '0.9.1')
                return { kind, revision: boardRevision, def: typednrf9161v091 };
            if (boardRevision === '1.0.0')
                return { kind, revision: boardRevision, def: typednrf9161v100 };
            return { kind: 'UnknownBoard' };

        case 'nRF54H20':
            return {
                kind,
                revision: boardRevision ?? undefined,
                def: typednrf54h20json,
            };

        case 'nRF54LV10':
            return {
                kind,
                revision: boardRevision ?? undefined,
                def: typednrf54lv10v010json,
            };

        case 'nRF9151':
            return {
                kind,
                revision: boardRevision ?? undefined,
                def: typednrf9151v020json,
            };

        case 'nRF54LM20':
            if (boardRevision && /^0\.1\.\d+$/.test(boardRevision))
                return {
                    kind,
                    revision: boardRevision,
                    def: typednrf54lm20v010json,
                };
            if (boardRevision && /^0\.2\.\d+$/.test(boardRevision))
                return {
                    kind,
                    revision: boardRevision,
                    def: typednrf54lm20v020json,
                };
            return {
                kind,
                revision: boardRevision ?? undefined,
                def: typednrf54lm20v030json,
            };

        default:
            return { kind: 'UnknownBoard' };
    }
}
