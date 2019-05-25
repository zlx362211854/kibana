/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  FeatureCatalogueRegistryProvider,
  FeatureCatalogueCategory,
} from 'ui/registry/feature_catalogue';

FeatureCatalogueRegistryProvider.register(() => {
  return {
    id: 'canvas',
    title: 'Canvas',
    description: '以完美像素的方式展示您的数据。',
    icon: 'canvasApp',
    path: '/app/canvas',
    showOnHomePage: true,
    category: FeatureCatalogueCategory.DATA,
  };
});
