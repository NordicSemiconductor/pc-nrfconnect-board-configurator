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
import { clipboard } from 'electron';

import { getConfigArray } from '../Configuration/boardControllerConfigSlice';

const ConfigJsonRender = () => {
    logger.debug('Rendering ConfigJsonRender');

    const device = useSelector(selectedDevice);
    const configData = useSelector(getConfigArray);

    const [jsonDialogEnabled, enableJsonDialog] = useState(false);

    return (
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
                    <div className="tw-flex tw-gap-2">
                        <DialogButton
                            onClick={() => {
                                clipboard.writeText(JSON.stringify(configData));
                            }}
                        >
                            Copy
                        </DialogButton>
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
    );
};

export default ConfigJsonRender;
