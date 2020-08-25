import React, { Component } from 'react';
import styles from './image.less';
import ImageForm from './components/ImageForm';
import ImageCanvas from './components/ImageCanvas';
import TEMPLATE_DATA from './data';

export default class ImageRoute extends Component {
  state = {
    defaultOptions: {},
    inputValues: {},
    inputStyles: {},
  };

  componentDidMount() {
    this.initData(0);
  }

  initData = (index) => {
    const { backgroundImage, backgroundColor, defaultOptions, defaultStyles, defaultValues } = TEMPLATE_DATA[ index ];
    console.log(TEMPLATE_DATA[index]);
    this.setState({
      backgroundImage,
      backgroundColor,
      defaultOptions,
      inputStyles: defaultStyles,
      inputValues: defaultValues,
    });
  };

  setInputValue = (item, value) => {
    let inputValues = this.state.inputValues;
    inputValues[item] = value;
    this.setState({
      inputValues,
    });
  };

  setInputStyle = (item, style, styleValue) => {
    let inputStyles = this.state.inputStyles;
    if (!inputStyles[ item ]) {
      inputStyles[ item ] = {};
    }
    inputStyles[item][style] = styleValue;
    this.setState({
      inputStyles,
    });
  };

  setBackground = (item, value) => {
    this.setState({
      backgroundImage: '',
      backgroundColor: '',
      [item]: value
    })
  };

  changeTemplate = (index) => {
    this.setState({
      backgroundImage: '',
      backgroundColor: '',
      defaultOptions: {},
      inputStyles: {},
      inputValues: {},
    }, () => {
      this.initData(index);
    });
  };

  download = () => {
    this.imageCanvasRef.download();
  };

  render() {
    const { backgroundImage, backgroundColor, defaultOptions, inputValues, inputStyles } = this.state;

    return (
      <div className={styles.images}>
        <div className={styles.imageCanvas}>
          <ImageCanvas
            ref={(ref) => this.imageCanvasRef = ref}
            backgroundImage={backgroundImage}
            backgroundColor={backgroundColor}
            defaultOptions={defaultOptions}
            inputStyles={inputStyles}
            inputValues={inputValues}
          />
          <ul className={styles.imageTemplates}>
            {TEMPLATE_DATA.map((item, index) => {
              return (
                <li key={index}>
                  <a onClick={this.changeTemplate.bind(this, index)}>
                    <img src={item.thumbcache} width={82} height={47} alt={`模板${index}`} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.imageForm}>
          <ImageForm
            setInputValue={this.setInputValue}
            setInputStyle={this.setInputStyle}
            setBackground={this.setBackground}
            download={this.download}
          />
        </div>
      </div>
    );
  }
}
