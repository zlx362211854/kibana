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
const url_1 = require("url");
const utils_1 = require("../../../../core/public/utils");
const prepend_path_1 = require("./prepend_path");
/**
 * Represents the pieces that make up a url in Kibana, offering some helpful functionality
 * for translating those pieces into absolute or relative urls. A Kibana url with a basePath
 * looks like this: http://localhost:5601/basePath/app/appId#/an/appPath?with=query&params
 *
 *  - basePath is "/basePath"
 *  - appId is "appId"
 *  - appPath is "/an/appPath?with=query&params"
 *
 * Almost all urls in Kibana should have this structure, including the "/app" portion in front of the appId
 * (one exception is the login link).
 */
class KibanaParsedUrl {
    constructor(options) {
        const { appId, basePath = '', appPath = '', hostname, protocol, port } = options;
        // We'll use window defaults
        const hostOrProtocolSpecified = hostname || protocol || port;
        this.basePath = basePath;
        this.appId = appId;
        this.appPath = appPath;
        this.hostname = hostOrProtocolSpecified ? hostname : window.location.hostname;
        this.port = hostOrProtocolSpecified ? port : window.location.port;
        this.protocol = hostOrProtocolSpecified ? protocol : window.location.protocol;
    }
    getGlobalState() {
        if (!this.appPath) {
            return '';
        }
        const parsedUrl = url_1.parse(this.appPath, true);
        const query = parsedUrl.query || {};
        return query._g || '';
    }
    setGlobalState(newGlobalState) {
        if (!this.appPath) {
            return;
        }
        this.appPath = utils_1.modifyUrl(this.appPath, parsed => {
            parsed.query._g = newGlobalState;
        });
    }
    addQueryParameter(name, val) {
        this.appPath = utils_1.modifyUrl(this.appPath, parsed => {
            parsed.query[name] = val;
        });
    }
    getHashedAppPath() {
        return `#${this.appPath}`;
    }
    getAppBasePath() {
        return `/${this.appId}`;
    }
    getAppRootPath() {
        return `/app${this.getAppBasePath()}${this.getHashedAppPath()}`;
    }
    getRootRelativePath() {
        return prepend_path_1.prependPath(this.getAppRootPath(), this.basePath);
    }
    getAbsoluteUrl() {
        return utils_1.modifyUrl(this.getRootRelativePath(), parsed => {
            parsed.protocol = this.protocol;
            parsed.port = this.port;
            parsed.hostname = this.hostname;
        });
    }
}
exports.KibanaParsedUrl = KibanaParsedUrl;
