/**
 * Created by wgwxf on 2018/6/11.
 */
import React, { PureComponent } from 'react';
import { Form, Input, Button, Row, Col, Upload, message, Icon, Popover, Select, Slider } from 'antd';
import { CirclePicker } from 'react-color';
import styles from '../image.less';

const { Option } = Select;

function getAvatarBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    let image    = new Image();
    image.src    = reader.result;
    image.onload = function () {
      const canvas = document.createElement("canvas");
      const scale  = image.width / image.height;
      canvas.width  = image.width < 160 ? image.width : 160;
      canvas.height = parseInt(canvas.width / scale, 10);
      canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/jpeg", 0.75);
      callback(imageUrl)
    };
  });
  reader.readAsDataURL(img);
}

function getBackgroundBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    let image    = new Image();
    image.src    = reader.result;
    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width  = image.width < 463 ? image.width : 463;
      canvas.height = image.height < 262 ? image.height : 262;
      canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/jpeg", 0.75);
      callback(imageUrl)
    };
  });
  reader.readAsDataURL(img);
}

@Form.create()
export default class ImageForm extends PureComponent {

  state = {
    imageUrl: '',
    uploadLoading: false,
    fontPanelVisible: false,
    fontColors: {},
  };

  beforeAvatarUpload = (file) => {
    if (!file.type === 'image/png') {
      message.error('请选择图片!');
      return false;
    }
    if (file.size > (1024 * 1024)) {
      message.error('最大不得超过1MB!');
      return false;
    }
    return true;
  };

  handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getAvatarBase64(info.file.originFileObj, imageUrl => {
        this.props.setInputValue('teacherImage', imageUrl);
        this.setState({
          imageUrl,
          uploadLoading: false,
        })
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  beforeBackgroundUpload = (file) => {
    if (!file.type === 'image/jpeg') {
      message.error('请选择图片!');
      return false;
    }
    if (file.size > (1024 * 1024)) {
      message.error('最大不得超过1MB!');
      return false;
    }
    return true;
  };

  handleBackgroundChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBackgroundBase64(info.file.originFileObj, imageUrl => {
        this.props.setBackground('backgroundImage', imageUrl);
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  setValue = (item, e) => {
    const value = e.target.value;
    this.props.setInputValue(item, value);
  };

  renderFontPanel = (item) => {
    return (
      <div style={{width: '285px'}}>
        <Row>
          <Col span={24}>
            <Select placeholder="字体" style={{width: '100%'}} defaultValue='Times New Roman' onSelect={this.fontFamilyChange.bind(this, item)}>
              <Option value="Times New Roman" style={{fontFamily: 'Times New Roman'}}>Times New Roman</Option>
              <Option value="monospace" style={{fontFamily: 'monospace'}}>monospace</Option>
            </Select>
          </Col>

        </Row>
        <Row>
          <Col span={5}>
            <div style={{height: '155px'}}>
              <Slider defaultValue={20} min={10} max={80} step={5} vertical={true} onChange={this.fontSizeChange.bind(this, item)}/>
            </div>
          </Col>
          <Col span={19}>
            <div className={styles.colorList}>
              <CirclePicker onChangeComplete={ this.fontColorChange.bind(this, item) }
                            color={this.state.fontColors[item]}
                            width='100%'
                            colors={
                              ['#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00',
                                '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
                                '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
                                '#808900', '#0C797D', '#0062B1',]
                            }/>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  fontFamilyChange = (item, famliy) => {
    this.setStyle(item, "fontFamily", famliy);
  };

  fontSizeChange = (item, size) => {
    this.setStyle(item, "fontSize", size);
  };

  fontColorChange = (item, color) => {
    let fontColors = this.state.fontColors;
    fontColors[item] = color;
    this.setState({
      fontColors,
    });
    this.setStyle(item, "fill", color.hex);
  };

  setStyle = (item, style, styleValue) => {
    this.props.setInputStyle(item, style, styleValue);
  };

  toggleFontPanelVisible = (item) => {
    let fontPanelVisible = this.state.fontPanelVisible;
    if (fontPanelVisible === item) {
      fontPanelVisible = null;
    } else {
      fontPanelVisible = item;
    }
    this.setState({
      fontPanelVisible,
    });
  };

  handleFontPanelVisibleChange = (item, fontPanelVisible) => {
    if (fontPanelVisible) {
      this.setState({
        fontPanelVisible: item,
      });
    } else {
      this.setState({
        fontPanelVisible: null,
      });
    }
  };

  backgroundColorChange = (value) => {
    this.props.setBackground('backgroundColor', value.hex);
  };

  render() {
    const { imageUrl, uploadLoading, fontPanelVisible } = this.state;

    const avatarProps = {
      accept: 'image/png',
      beforeUpload: this.beforeAvatarUpload,
      showUploadList: false,
      onChange: this.handleAvatarChange,
    };

    const backgroundProps = {
      accept: 'image/*',
      beforeUpload: this.beforeBackgroundUpload,
      showUploadList: false,
      onChange: this.handleBackgroundChange,
    };

    return (
      <div>
        <Row>
          <Col span={24}>
            <Input type="text" placeholder="课程标题" onChange={this.setValue.bind(this, 'courseName')} />
            <Popover
              content={this.renderFontPanel("courseName")}
              title="设置字体"
              trigger="click"
              visible={fontPanelVisible === 'courseName'}
              onVisibleChange={this.handleFontPanelVisibleChange.bind(this, 'courseName')}
            >
              <Button type="primary" icon="bars" size='small' onClick={this.toggleFontPanelVisible.bind(this, 'courseName')}/>
            </Popover>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Input type="text" placeholder="课程副标题" onChange={this.setValue.bind(this, 'subCourseName')} />
            <Popover
              content={this.renderFontPanel("subCourseName")}
              title="设置字体"
              trigger="click"
              visible={fontPanelVisible === 'subCourseName'}
              onVisibleChange={this.handleFontPanelVisibleChange.bind(this, 'subCourseName')}
            >
              <Button type="primary" icon="bars" size='small' onClick={this.toggleFontPanelVisible.bind(this, 'subCourseName')}/>
            </Popover>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Input type="text" placeholder="姓名" onChange={this.setValue.bind(this, 'teacherName')}
                   style={{ width: '100px', marginRight: '5px' }}/>
            <Popover
              content={this.renderFontPanel("teacherName")}
              title="设置字体"
              trigger="click"
              visible={fontPanelVisible === 'teacherName'}
              onVisibleChange={this.handleFontPanelVisibleChange.bind(this, 'teacherName')}
            >
              <Button type="primary" icon="bars" size='small' style={{ marginRight: '5px' }} onClick={this.toggleFontPanelVisible.bind(this, 'teacherName')}/>
            </Popover>
            <Input type="text" placeholder="称号" onChange={this.setValue.bind(this, 'teacherHeader')}
                   style={{ width: '178px', marginRight: '5px' }}/>
            <Popover
              content={this.renderFontPanel("teacherHeader")}
              title="设置字体"
              trigger="click"
              visible={fontPanelVisible === 'teacherHeader'}
              onVisibleChange={this.handleFontPanelVisibleChange.bind(this, 'teacherHeader')}
            >
              <Button type="primary" icon="bars" size='small' onClick={this.toggleFontPanelVisible.bind(this, 'teacherHeader')}/>
            </Popover>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <div className={styles.avatarUploader}>
              {imageUrl ?
                <div className="ant-upload ant-upload-select ant-upload-select-picture-card"><img src={imageUrl} alt="" /></div>
                :
                <div className="ant-upload ant-upload-select ant-upload-select-picture-card">
                  <span className="ant-upload">
                    <Icon type={uploadLoading ? 'loading' : 'plus'} />
                    <div className="ant-upload-text">讲师照片</div>
                  </span>
                </div>
              }
            </div>
            <div className={styles.avatarTips}>
              <Row>
                <Upload {...avatarProps}>
                  <a>
                    <Icon type="upload" /> 上传讲师照片
                  </a>
                </Upload>
                <Upload {...backgroundProps} style={{marginLeft: '35px'}}>
                  <a>
                    <Icon type="upload" /> 上传背景图片
                  </a>
                </Upload>
              </Row>
              <Row>注意：讲师照片需上传背景透明的PNG格式，或与背景色一致！</Row>
              <Row>图片大小必须小于1M<br/>建议尺寸：讲师160*250,背景463*262</Row>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5" style={{textAlign: 'left'}}><label>纯色背景</label></div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19 ant-col-md-19">
              <div className="ant-form-item-control">
                <span className="ant-form-item-children">
                  <CirclePicker className={styles.twitterPicker} onChangeComplete={ this.backgroundColorChange }
                                width='100%'
                                colors={
                                  ['#000000', '#999999', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA']
                                }/>
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type="primary" icon="download" onClick={this.props.download}>生成图片</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
