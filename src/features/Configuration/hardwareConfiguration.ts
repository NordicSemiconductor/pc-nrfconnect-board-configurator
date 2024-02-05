export interface BoardConfiguration {
    pins?: Map<number, boolean>;
    pmicPorts?: Map<number, number>;
}

export function wrapHardwareConfig(
    hardwareConfig: unknown[][]
): BoardConfiguration {
    if (hardwareConfig && hardwareConfig.length !== 0) {
        const pins = wrapPinConfig(hardwareConfig[0]);

        const pmicPorts = wrapPmicConfig(
            hardwareConfig.length > 1 ? hardwareConfig[1] : undefined
        );

        return { pins, pmicPorts };
    }
    console.log('No current config to apply');
    return {};
}

export function wrapPinConfig(hardwarePinConfig: unknown[]) {
    const pins = new Map<number, boolean>();

    // Zip the current config pins array - NB! step of 2
    for (let i = 0; i < hardwarePinConfig.length; i += 2) {
        pins.set(
            Number(hardwarePinConfig[i]),
            Boolean(hardwarePinConfig[i + 1])
        );
    }

    return pins;
}

export function wrapPmicConfig(hardwarePmicConfig: unknown[] | undefined) {
    const ports = new Map<number, number>();
    if (hardwarePmicConfig === undefined) {
        return ports;
    }

    // Zip the current PMIC config port array - NB! step of 2
    for (let i = 0; i < hardwarePmicConfig.length; i += 2) {
        ports.set(
            Number(hardwarePmicConfig[i]),
            Number(hardwarePmicConfig[i + 1])
        );
    }

    return ports;
}
