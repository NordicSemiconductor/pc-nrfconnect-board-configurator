/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    DialogButton,
    InfoDialog,
    logger,
    selectedDevice,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getConfigArray } from '../Configuration/boardControllerConfigSlice';

interface ConfigJsonRenderProps {
    enabled: boolean;
}

const ConfigJsonRender = ({ enabled = true }: ConfigJsonRenderProps) => {
    logger.debug('Rendering ConfigJsonRender');

    const device = useSelector(selectedDevice);
    const configData = useSelector(getConfigArray);

    const [jsonDialogEnabled, enableJsonDialog] = useState(false);

    return enabled ? (
        <>
            <Button
                disabled={!device}
                variant="secondary"
                className="tw-w-full"
                onClick={() => {
                    enableJsonDialog(true);
                }}
            >
                Show Config JSON
            </Button>
            <InfoDialog
                isVisible={jsonDialogEnabled}
                onHide={() => {
                    enableJsonDialog(false);
                }}
                title="Configuration JSON"
                footer={
                    <div>
                        <DialogButton
                            onClick={() => {
                                enableJsonDialog(false);
                            }}
                        >
                            Close
                        </DialogButton>
                    </div>
                }
            >
                <pre className="tw-border tw-border-solid tw-border-gray-200 tw-p-2">
                    {JSON.stringify(configData, undefined, 2)}
                </pre>
            </InfoDialog>
        </>
    ) : null;
};

export default ConfigJsonRender;
