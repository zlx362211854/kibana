/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  FeatureCatalogueRegistryProvider,
  FeatureCatalogueCategory
} from 'ui/registry/feature_catalogue';
import { i18n } from '@kbn/i18n';
import { APP_ID, APP_ICON } from '../common/constants';
import { getAppTitle } from '../common/i18n_getters';

FeatureCatalogueRegistryProvider.register(() => {
  return {
    id: APP_ID,
    title: getAppTitle(),
    description: i18n.translate('xpack.maps.feature.appDescription', {
      defaultMessage: '探索Elasticsearch和Elastic 地图服务的地理空间数据'
    }),
    icon: APP_ICON,
    path: '/app/maps',
    showOnHomePage: true,
    category: FeatureCatalogueCategory.DATA
  };
});

