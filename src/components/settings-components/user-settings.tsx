import React, { Component } from "react";
import { Row, Col, Input, Upload } from "antd";
import "./settings-components.scss";

interface IProps {}
interface IState {}

const { Search } = Input;

function getBase64(img: Blob, callback: any) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    console.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    console.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

export default class UserSettings extends Component<IProps, IState> {
  state = { imageUrl: "", loading: false };

  handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      console.log("uploading");
      return this.setState({ loading: true });
    }
    if (info.file.status === "done") {
      console.log("done");
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) =>
        this.setState({
          imageUrl: imageUrl,
          loading: false,
        })
      );
    }
  };

  render() {
    const { imageUrl } = this.state;
    return (
      <div>
        <Row>
          <Col span={10}>Change Avatar:</Col>
          <Col span={14}>
            <div className="change-avatar">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" />
                ) : (
                  <div>
                    <div className="ant-upload-text">Upload</div>
                  </div>
                )}
              </Upload>
            </div>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={10}>Change username:</Col>
          <Col span={14}>
            <Input placeholder="new username" />
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={10}>Change password:</Col>
          <Col span={14}>
            <Input.Password placeholder="new password" />
          </Col>
        </Row>
      </div>
    );
  }
} //<InfoCircleOutline style={{ color: "rgba(0,0,0,.45)" }} />
