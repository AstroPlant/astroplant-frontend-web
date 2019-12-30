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

import { Observable } from 'rxjs';
import { BaseAPI, HttpHeaders, HttpQuery, throwIfRequired } from '../runtime';
import {
    AggregateMeasurement,
    InlineResponse429,
    InlineResponse500,
} from '../models';

export interface ListAggregateMeasurementsRequest {
    kitSerial: string;
}

/**
 * no description
 */
export class MeasurementsApi extends BaseAPI {

    /**
     * Aggregate measurements made by a kit in the last 5 days.
     */
    listAggregateMeasurements = (requestParameters: ListAggregateMeasurementsRequest): Observable<Array<AggregateMeasurement>> => {
        throwIfRequired(requestParameters, 'kitSerial', 'listAggregateMeasurements');

        const headers: HttpHeaders = {
            ...(this.configuration.username && this.configuration.password && { Authorization: `Basic ${btoa(this.configuration.username + ':' + this.configuration.password)}` }),
        };

        const query: HttpQuery = {
            ...(requestParameters.kitSerial && { 'kitSerial': requestParameters.kitSerial }),
        };

        return this.request<Array<AggregateMeasurement>>({
            path: '/measurements/aggregate-measurements',
            method: 'GET',
            headers,
            query,
        });
    };

}