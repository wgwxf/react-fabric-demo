import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {fabric} from 'fabric';

export default class ImageCanvas extends Component {
  constructor(props){
    super(props);
    this.currentObject = {};
    this.width = 463;
    this.height = 262;
  }

  static defaultProps = {
    inputValues: {},
    inputStyles: {},
    defaultOptions: {},
    backgroundImage: '',
    backgroundColor: '',
  };

  static contextTypes = {
    inputValues: PropTypes.object,
    inputStyles: PropTypes.object,
    defaultOptions: PropTypes.object,
    backgroundImage: PropTypes.string,
    backgroundColor: PropTypes.string,
  };

  componentDidMount(){
    this.canvas = new fabric.Canvas('canvas', {
      width: this.width,
      height: this.height
    });

    this.drawAvatar({}, this.props);
  }

  componentDidUpdate(prevProps){
    this.drawAvatar(prevProps, this.props);
  }

  drawAvatar = (prevProps, props) => {
    const { inputValues: {teacherImage, courseName, subCourseName, teacherName, teacherHeader, }, backgroundImage, backgroundColor, inputStyles, defaultOptions } = props;

    const { teacherImage: prevTeacherImage } = prevProps.inputValues || {};
    console.log(teacherImage, prevTeacherImage);
    if (teacherImage !== undefined && prevTeacherImage !== teacherImage) {
      this.reDrawImage('teacherImage', teacherImage, defaultOptions);
    }

    if (courseName !== undefined) {
      this.reDrawText('courseName', courseName, inputStyles, defaultOptions);
    }

    if (subCourseName !== undefined) {
      this.reDrawText('subCourseName', subCourseName, inputStyles, defaultOptions);
    }

    if (teacherName !== undefined) {
      this.reDrawText('teacherName', teacherName, inputStyles, defaultOptions);
    }

    if (teacherHeader !== undefined) {
      this.reDrawText('teacherHeader', teacherHeader ? (' ' + teacherHeader) : '', inputStyles, defaultOptions);
    }

    if (backgroundImage !== undefined && prevProps.backgroundImage !== backgroundImage) {
      this.reDrawBackground(backgroundImage, backgroundColor);
    }
    if (backgroundColor !== undefined && prevProps.backgroundColor !== backgroundColor) {
      this.reDrawBackground(backgroundImage, backgroundColor);
    }
  };

  reDrawImage = (item, src, defaultOptions) => {
    this.removeObject(item);

    if (src) {
      fabric.Image.fromURL(src, img => {
        img.set(defaultOptions[item]);
        this.addObject(item, img);
      });
    }
  };

  reDrawText = (item, text, inputStyles, defaultOptions) => {
    this.removeObject(item);
    if (text) {
      const style = (inputStyles && inputStyles[ item ]) || {};

      fabric.Text.fromObject({ text, ...style, }, img => {
        img.set(defaultOptions[ item ]);
        this.addObject(item, img);
      });
    }
  };

  reDrawBackground(backgroundImage, backgroundColor){
    if (backgroundImage) {
      this.canvas.setBackgroundImage(backgroundImage, this.canvas.renderAll.bind(this.canvas), {
        width: this.canvas.width,
        height: this.canvas.height,
        // Needed to position backgroundImage at 0/0
        originX: 'left',
        originY: 'top',
      });
    } else {
      this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
    }

    this.canvas.setBackgroundColor(backgroundColor, this.canvas.renderAll.bind(this.canvas));
  }

  addObject = (item, obj) => {
    this.currentObject[item] = obj;
    this.canvas.add(obj);
  };

  removeObject = (item) => {
    this.canvas.remove(this.currentObject[item]);
  };

  download = () => {
    let link = this.downloadLink;
    link.setAttribute('href', this.canvas.toDataURL());
    link.setAttribute('download', 'course_image.png');
    link.click();
  };

  render() {
    return (
      <div>
        <a ref={(ref) => this.downloadLink = ref} style={{display: 'none'}}>Download</a>
        <canvas id="canvas" />
      </div>
    );
  }
}
