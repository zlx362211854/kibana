/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonIcon,
  EuiButtonEmpty,
  EuiButton,
  EuiOverlayMask,
  EuiModal,
  EuiModalHeader,
  EuiModalBody,
  EuiText,
  EuiImage,
  EuiPanel,
  EuiModalFooter,
  EuiModalHeaderTitle,
  EuiFlexGrid,
  EuiProgress,
  EuiSpacer,
  EuiTextColor,
  EuiToolTip,
  EuiFilePicker,
  EuiEmptyPrompt,
} from '@elastic/eui';
import { ConfirmModal } from '../confirm_modal';
import { Clipboard } from '../clipboard';
import { Download } from '../download';
import { Loading } from '../loading';
import { ASSET_MAX_SIZE } from '../../../common/lib/constants';

export class AssetManager extends React.PureComponent {
  static propTypes = {
    assetValues: PropTypes.array,
    addImageElement: PropTypes.func,
    removeAsset: PropTypes.func.isRequired,
    copyAsset: PropTypes.func.isRequired,
    onAssetAdd: PropTypes.func.isRequired,
  };

  state = {
    deleteId: null,
    isModalVisible: false,
    loading: false,
  };

  _isMounted = true;

  showModal = () => this.setState({ isModalVisible: true });
  closeModal = () => this.setState({ isModalVisible: false });

  doDelete = () => {
    this.resetDelete();
    this.props.removeAsset(this.state.deleteId);
  };

  handleFileUpload = files => {
    this.setState({ loading: true });
    Promise.all(Array.from(files).map(file => this.props.onAssetAdd(file))).finally(() => {
      this._isMounted && this.setState({ loading: false });
    });
  };

  addElement = assetId => {
    this.props.addImageElement(assetId);
  };

  resetDelete = () => this.setState({ deleteId: null });

  renderAsset = asset => (
    <EuiFlexItem key={asset.id}>
      <EuiPanel className="canvasAssetManager__asset" paddingSize="s">
        <div className="canvasAssetManager__thumb canvasCheckered">
          <EuiImage
            className="canvasAssetManager__img"
            size="original"
            url={asset.value}
            fullScreenIconColor="dark"
            alt="Asset thumbnail"
            style={{ backgroundImage: `url(${asset.value})` }}
          />
        </div>

        <EuiSpacer size="s" />

        <EuiText size="xs" className="eui-textBreakAll">
          <p className="eui-textBreakAll">
            <strong>{asset.id}</strong>
            <br />
            <EuiTextColor color="subdued">
              <small>({Math.round(asset.value.length / 1024)} kb)</small>
            </EuiTextColor>
          </p>
        </EuiText>

        <EuiSpacer size="s" />

        <EuiFlexGroup alignItems="baseline" justifyContent="center" responsive={false}>
          <EuiFlexItem className="asset-create-image" grow={false}>
            <EuiToolTip content="创建图像元素">
              <EuiButtonIcon
                iconType="vector"
                aria-label="创建图像元素"
                onClick={() => {
                  this.addElement(asset.id);
                  this.closeModal();
                }}
              />
            </EuiToolTip>
          </EuiFlexItem>
          <EuiFlexItem className="asset-download" grow={false}>
            <EuiToolTip content="下载">
              <Download fileName={asset.id} content={asset.value}>
                <EuiButtonIcon iconType="sortDown" aria-label="下载" />
              </Download>
            </EuiToolTip>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiToolTip content="将ID复制到剪贴板">
              <Clipboard
                content={asset.id}
                onCopy={result => result && this.props.copyAsset(asset.id)}
              >
                <EuiButtonIcon iconType="copyClipboard" aria-label="将ID复制到剪贴板" />
              </Clipboard>
            </EuiToolTip>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiToolTip content="Delete">
              <EuiButtonIcon
                color="danger"
                iconType="trash"
                aria-label="删除"
                onClick={() => this.setState({ deleteId: asset.id })}
              />
            </EuiToolTip>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
    </EuiFlexItem>
  );

  render() {
    const { isModalVisible, loading } = this.state;
    const { assetValues } = this.props;

    const assetsTotal = Math.round(
      assetValues.reduce((total, { value }) => total + value.length, 0) / 1024
    );

    const percentageUsed = Math.round((assetsTotal / ASSET_MAX_SIZE) * 100);

    const emptyAssets = (
      <EuiPanel className="canvasAssetManager__emptyPanel">
        <EuiEmptyPrompt
          iconType="importAction"
          title={<h2>没有可用的资产</h2>}
          titleSize="s"
          body={
            <Fragment>
              <p>上传您的资产以开始使用</p>
            </Fragment>
          }
        />
      </EuiPanel>
    );

    const assetModal = isModalVisible ? (
      <EuiOverlayMask>
        <EuiModal
          onClose={this.closeModal}
          className="canvasAssetManager canvasModal--fixedSize"
          maxWidth="1000px"
        >
          <EuiModalHeader className="canvasAssetManager__modalHeader">
            <EuiModalHeaderTitle className="canvasAssetManager__modalHeaderTitle">
             管理工作台资产
            </EuiModalHeaderTitle>
            <EuiFlexGroup className="canvasAssetManager__fileUploadWrapper">
              <EuiFlexItem grow={false}>
                {loading ? (
                  <Loading animated text="图像更新中" />
                ) : (
                  <EuiFilePicker
                    initialPromptText="选择或拖放图像"
                    compressed
                    multiple
                    onChange={this.handleFileUpload}
                    accept="image/*"
                  />
                )}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiText size="s" color="subdued">
              <p>
              以下是您添加到此工作台的图像资源。 要回收空间，请删除不再需要的资产。 不幸的是，目前无法确定任何实际使用的资产。
              </p>
            </EuiText>
            <EuiSpacer />
            {assetValues.length ? (
              <EuiFlexGrid responsive={false} columns={4}>
                {assetValues.map(this.renderAsset)}
              </EuiFlexGrid>
            ) : (
              emptyAssets
            )}
          </EuiModalBody>
          <EuiModalFooter className="canvasAssetManager__modalFooter">
            <EuiFlexGroup className="canvasAssetManager__meterWrapper" responsive={false}>
              <EuiFlexItem>
                <EuiProgress
                  value={assetsTotal}
                  max={ASSET_MAX_SIZE}
                  color={percentageUsed < 90 ? 'secondary' : 'danger'}
                  size="s"
                  aria-labelledby="CanvasAssetManagerLabel"
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false} className="eui-textNoWrap">
                <EuiText id="CanvasAssetManagerLabel">{percentageUsed}% 空间使用</EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiButton size="s" onClick={this.closeModal}>
              关闭
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    ) : null;

    return (
      <Fragment>
        <EuiButtonEmpty onClick={this.showModal}>管理资产</EuiButtonEmpty>

        {assetModal}

        <ConfirmModal
          isOpen={this.state.deleteId != null}
          title="删除资产"
          message="确定要删除此资产?"
          confirmButtonText="删除"
          onConfirm={this.doDelete}
          onCancel={this.resetDelete}
        />
      </Fragment>
    );
  }
}
