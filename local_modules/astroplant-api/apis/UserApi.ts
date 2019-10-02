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
import { BaseAPI, HttpHeaders, throwIfRequired } from '../runtime';
import {
    FullUser,
    InlineResponse429,
    InlineResponse500,
    NewUser,
    ProblemDetails,
} from '../models';

export interface CreateUserRequest {
    newUser: NewUser;
}

/**
 * no description
 */
export class UserApi extends BaseAPI {

    /**
     * Create a user.
     */
    createUser = (requestParameters: CreateUserRequest): Observable<void> => {
        throwIfRequired(requestParameters, 'newUser', 'createUser');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<void>({
            path: '/users',
            method: 'POST',
            headers,
            body: requestParameters.newUser,
        });
    };

    /**
     * Your user information.
     */
    showMe = (): Observable<FullUser> => {
        const headers: HttpHeaders = {
            ...(this.configuration.username && this.configuration.password && { Authorization: `Basic ${btoa(this.configuration.username + ':' + this.configuration.password)}` }),
        };

        return this.request<FullUser>({
            path: '/me',
            method: 'GET',
            headers,
        });
    };

}