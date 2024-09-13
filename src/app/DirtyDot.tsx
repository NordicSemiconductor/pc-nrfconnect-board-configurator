/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import './dirtydot.scss';

interface DirtyDotProps {
    dirty: boolean;
    className?: string;
}

export default ({ dirty, className }: DirtyDotProps) =>
    dirty ? (
        <span
            className={`mdi mdi-circle dirtydot tw-m-0 tw-p-0 tw-text-primary ${
                className || ''
            }`}
        />
    ) : null;
