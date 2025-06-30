import fs from 'fs';
import path from 'path';

import { PmicPortDefinition } from '../BoardControllerConfigDefinition';

describe('PMIC Ports Properties Validation', () => {
    const boardsDir = path.join(__dirname, '..');

    // Get all JSON files in the boards directory
    const jsonFiles = fs
        .readdirSync(boardsDir)
        .filter(file => file.endsWith('.json') && file.startsWith('nrf_'))
        .map(file => path.join(boardsDir, file));

    jsonFiles.forEach(jsonFile => {
        const fileName = path.basename(jsonFile);

        test(`${fileName} should have matching portId and port lengths in pmicPorts`, () => {
            const jsonContent = fs.readFileSync(jsonFile, 'utf8');
            const boardConfig = JSON.parse(jsonContent);

            if (!boardConfig.pmicPorts || boardConfig.pmicPorts.length === 0) {
                return;
            }

            // Validate each pmicPort entry
            boardConfig.pmicPorts.forEach(
                (pmicPort: PmicPortDefinition, index: number) => {
                    const portLength = pmicPort.port.length;
                    const portIdLength = pmicPort.portId?.length;

                    expect(portIdLength).toBe(portLength);

                    if (portIdLength !== portLength) {
                        throw new Error(
                            `Mismatch in pmicPorts[${index}] for ${fileName}: ` +
                                `portId length (${portIdLength}) !== port length (${portLength}). ` +
                                `portId: ${JSON.stringify(
                                    pmicPort.portId
                                )}, port: ${JSON.stringify(pmicPort.port)}`
                        );
                    }
                }
            );
        });
    });

    jsonFiles.forEach(jsonFile => {
        const fileName = path.basename(jsonFile);

        test(`${fileName} should have port and portId as arrays in pmicPorts`, () => {
            const jsonContent = fs.readFileSync(jsonFile, 'utf8');
            const boardConfig = JSON.parse(jsonContent);

            if (!boardConfig.pmicPorts) {
                return;
            }

            // Validate that port and portId are arrays
            boardConfig.pmicPorts.forEach(
                (pmicPort: PmicPortDefinition, index: number) => {
                    expect(Array.isArray(pmicPort.port)).toBe(true);
                    expect(Array.isArray(pmicPort.portId)).toBe(true);

                    if (!Array.isArray(pmicPort.port)) {
                        throw new Error(
                            `pmicPorts[${index}].port in ${fileName} should be an array, ` +
                                `but got: ${typeof pmicPort.port} (${JSON.stringify(
                                    pmicPort.port
                                )})`
                        );
                    }

                    if (!Array.isArray(pmicPort.portId)) {
                        throw new Error(
                            `pmicPorts[${index}].portId in ${fileName} should be an array, ` +
                                `but got: ${typeof pmicPort.portId} (${JSON.stringify(
                                    pmicPort.portId
                                )})`
                        );
                    }
                }
            );
        });
    });

    test('should find at least one JSON file to test', () => {
        expect(jsonFiles.length).toBeGreaterThan(0);
    });
});
