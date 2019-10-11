// tslint:disable
/**
 * AstroPlant API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * @export
 * @interface Peripheral
 */
export interface Peripheral {
    /**
     * @type {number}
     * @memberof Peripheral
     */
    id: number;
    /**
     * @type {number}
     * @memberof Peripheral
     */
    kitId: number;
    /**
     * @type {number}
     * @memberof Peripheral
     */
    configurationId: number;
    /**
     * @type {number}
     * @memberof Peripheral
     */
    peripheralDefinitionId: number;
    /**
     * @type {string}
     * @memberof Peripheral
     */
    name: string;
    /**
     * @type {object}
     * @memberof Peripheral
     */
    configuration: object;
}
