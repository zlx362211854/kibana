"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const url_1 = require("url");
const error_auto_create_index_1 = require("../error_auto_create_index");
const kfetch_1 = require("../kfetch");
const case_conversion_1 = require("../utils/case_conversion");
const saved_object_1 = require("./saved_object");
const join = (...uriComponents) => uriComponents
    .filter((comp) => Boolean(comp))
    .map(encodeURIComponent)
    .join('/');
/**
 * Interval that requests are batched for
 * @type {integer}
 */
const BATCH_INTERVAL = 100;
const API_BASE_URL = '/api/saved_objects/';
class SavedObjectsClient {
    constructor() {
        /**
         * Throttled processing of get requests into bulk requests at 100ms interval
         */
        this.processBatchQueue = lodash_1.throttle(() => {
            const queue = lodash_1.cloneDeep(this.batchQueue);
            this.batchQueue = [];
            this.bulkGet(queue)
                .then(({ savedObjects }) => {
                queue.forEach(queueItem => {
                    const foundObject = savedObjects.find(savedObject => {
                        return savedObject.id === queueItem.id && savedObject.type === queueItem.type;
                    });
                    if (!foundObject) {
                        return queueItem.resolve(this.createSavedObject(lodash_1.pick(queueItem, ['id', 'type'])));
                    }
                    queueItem.resolve(foundObject);
                });
            })
                .catch(err => {
                queue.forEach(queueItem => {
                    queueItem.reject(err);
                });
            });
        }, BATCH_INTERVAL, { leading: false });
        /**
         * Persists an object
         *
         * @param {string} type
         * @param {object} [attributes={}]
         * @param {object} [options={}]
         * @property {string} [options.id] - force id on creation, not recommended
         * @property {boolean} [options.overwrite=false]
         * @property {object} [options.migrationVersion]
         * @returns
         */
        this.create = (type, attributes, options = {}) => {
            if (!type || !attributes) {
                return Promise.reject(new Error('requires type and attributes'));
            }
            const path = this.getPath([type, options.id]);
            const query = {
                overwrite: options.overwrite,
            };
            const createRequest = this.request({
                method: 'POST',
                path,
                query,
                body: {
                    attributes,
                    migrationVersion: options.migrationVersion,
                    references: options.references,
                },
            });
            return createRequest
                .then(resp => this.createSavedObject(resp))
                .catch((error) => {
                if (error_auto_create_index_1.isAutoCreateIndexError(error)) {
                    error_auto_create_index_1.showAutoCreateIndexErrorPage();
                }
                throw error;
            });
        };
        /**
         * Creates multiple documents at once
         *
         * @param {array} objects - [{ type, id, attributes, references, migrationVersion }]
         * @param {object} [options={}]
         * @property {boolean} [options.overwrite=false]
         * @returns The result of the create operation containing created saved objects.
         */
        this.bulkCreate = (objects = [], options = {}) => {
            const path = this.getPath(['_bulk_create']);
            const query = lodash_1.pick(options, ['overwrite']);
            const request = this.request({
                method: 'POST',
                path,
                query,
                body: objects,
            });
            return request.then(resp => {
                resp.saved_objects = resp.saved_objects.map(d => this.createSavedObject(d));
                return case_conversion_1.keysToCamelCaseShallow(resp);
            });
        };
        /**
         * Deletes an object
         *
         * @param type
         * @param id
         * @returns
         */
        this.delete = (type, id) => {
            if (!type || !id) {
                return Promise.reject(new Error('requires type and id'));
            }
            return this.request({ method: 'DELETE', path: this.getPath([type, id]) });
        };
        /**
         * Search for objects
         *
         * @param {object} [options={}]
         * @property {string} options.type
         * @property {string} options.search
         * @property {string} options.searchFields - see Elasticsearch Simple Query String
         *                                        Query field argument for more information
         * @property {integer} [options.page=1]
         * @property {integer} [options.perPage=20]
         * @property {array} options.fields
         * @property {object} [options.hasReference] - { type, id }
         * @returns A find result with objects matching the specified search.
         */
        this.find = (options = {}) => {
            const path = this.getPath(['_find']);
            const query = case_conversion_1.keysToSnakeCaseShallow(options);
            const request = this.request({
                method: 'GET',
                path,
                query,
            });
            return request.then(resp => {
                resp.saved_objects = resp.saved_objects.map(d => this.createSavedObject(d));
                return case_conversion_1.keysToCamelCaseShallow(resp);
            });
        };
        /**
         * Fetches a single object
         *
         * @param {string} type
         * @param {string} id
         * @returns The saved object for the given type and id.
         */
        this.get = (type, id) => {
            if (!type || !id) {
                return Promise.reject(new Error('requires type and id'));
            }
            return new Promise((resolve, reject) => {
                this.batchQueue.push({ type, id, resolve, reject });
                this.processBatchQueue();
            });
        };
        /**
         * Returns an array of objects by id
         *
         * @param {array} objects - an array ids, or an array of objects containing id and optionally type
         * @returns The saved objects with the given type and ids requested
         * @example
         *
         * bulkGet([
         *   { id: 'one', type: 'config' },
         *   { id: 'foo', type: 'index-pattern' }
         * ])
         */
        this.bulkGet = (objects = []) => {
            const path = this.getPath(['_bulk_get']);
            const filteredObjects = objects.map(obj => lodash_1.pick(obj, ['id', 'type']));
            const request = this.request({
                method: 'POST',
                path,
                body: filteredObjects,
            });
            return request.then(resp => {
                resp.saved_objects = resp.saved_objects.map(d => this.createSavedObject(d));
                return case_conversion_1.keysToCamelCaseShallow(resp);
            });
        };
        this.batchQueue = [];
    }
    /**
     * Updates an object
     *
     * @param {string} type
     * @param {string} id
     * @param {object} attributes
     * @param {object} options
     * @prop {integer} options.version - ensures version matches that of persisted object
     * @prop {object} options.migrationVersion - The optional migrationVersion of this document
     * @returns
     */
    update(type, id, attributes, { version, migrationVersion, references } = {}) {
        if (!type || !id || !attributes) {
            return Promise.reject(new Error('requires type, id and attributes'));
        }
        const path = this.getPath([type, id]);
        const body = {
            attributes,
            migrationVersion,
            references,
            version,
        };
        const request = this.request({
            method: 'PUT',
            path,
            body,
        });
        return request.then(resp => {
            return this.createSavedObject(resp);
        });
    }
    createSavedObject(options) {
        return new saved_object_1.SavedObject(this, options);
    }
    getPath(path) {
        return url_1.resolve(API_BASE_URL, join(...path));
    }
    request({ method, path, query, body }) {
        if (method === 'GET' && body) {
            return Promise.reject(new Error('body not permitted for GET requests'));
        }
        return kfetch_1.kfetch({ method, pathname: path, query, body: JSON.stringify(body) });
    }
}
exports.SavedObjectsClient = SavedObjectsClient;
