import { ArrowLeftOutlined, HomeOutlined, InboxOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Form,
  GetProp,
  Image,
  Input,
  Select,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
  message,
  notification,
} from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FORM_RULES, NOTICE_CATEGORIES, NOTICE_MESSAGES, NOTIFICATION_CONFIG } from '../../../constants';
import { useLoading } from '../../../context/LoadingContext';
import { CreateNoticePayload } from '../../../types/notice';

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CreateNotice: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [api, contextHolder] = notification.useNotification();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pdfFileList, setPdfFileList] = useState<UploadFile[]>([]);

  const handlePdfUploadChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    const isPdf = file.type === 'application/pdf';
    const isLt10M = (file.size as number) / 1024 / 1024 < 10;
    if (!isPdf) {
      message.error('You can only upload PDF files!');
    }
    if (!isLt10M) {
      message.error('PDF must be smaller than 10MB!');
    }
    if (isPdf && isLt10M) {
      setPdfFileList(newFileList.slice(-1)); // Keep only the last added PDF
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    const isJpgPngGif = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    const isLt2M = (file.size as number) / 1024 / 1024 < 2;
    if (!isJpgPngGif) {
      message.error('You can only upload JPG, PNG, GIF files!');
    }
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    if (isJpgPngGif && isLt2M) {
      setFileList(newFileList);
    }
  };

  const handleSubmit = async (values: CreateNoticePayload) => {
    try {
      startLoading();
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('category', values.category);

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('image', file.originFileObj);
        }
      });

      pdfFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('pdfAttachment', file.originFileObj);
        }
      });

      await axios.post('http://localhost:3000/api/notices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success(NOTICE_MESSAGES.CREATE.SUCCESS);
      form.resetFields();
      setFileList([]);
      setPdfFileList([]);
      navigate('/notice-board');
    } catch (error: any) {
      api.error({
        message: NOTICE_MESSAGES.CREATE.ERROR,
        description: error.response?.data?.message || 'Please try again later.',
        ...NOTIFICATION_CONFIG,
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="p-6">
      {contextHolder}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/notice-board">Notice Board</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Create Notice</Breadcrumb.Item>
      </Breadcrumb>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/notice-board')}
        className="mb-4 text-white hover:text-blue-400"
      >
        Back to Notice Board
      </Button>

      <div className="max-w-xl mx-auto">
        <Title level={2} className="text-white mb-6">
          Create Notice
        </Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="bg-yt-light-gray p-6 rounded">
          <Form.Item label={<span className="text-white">Title</span>} name="title" rules={[FORM_RULES.required]}>
            <Input placeholder="Enter notice title" />
          </Form.Item>

          <Form.Item label={<span className="text-white">Category</span>} name="category" rules={[FORM_RULES.required]}>
            <Select placeholder="Select notice category" options={NOTICE_CATEGORIES} />
          </Form.Item>

          <Form.Item label="Upload Image" name="image">
            <div className="flex items-center gap-6">
              <div className="flex flex-nowrap">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={() => false}
                  className="create-notice-upload"
                  accept="image/*"
                >
                  {fileList.length < 1 && '+ Upload'}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </div>
              <span className="text-white-300 whitespace-pre-wrap">
                <strong>Note:</strong> Allowed types: JPG, PNG, GIF. Max size: 2MB. Please upload a clear image for the
                notice.
              </span>
            </div>
          </Form.Item>

          <Form.Item label={<span className="text-white">Content</span>} name="content" rules={[FORM_RULES.required]}>
            <TextArea placeholder="Enter notice content" rows={2} />
          </Form.Item>

          <Form.Item label="Upload PDF Attachment" name="pdfAttachment">
            <Dragger
              name="pdfAttachment"
              listType="text"
              fileList={pdfFileList}
              onChange={handlePdfUploadChange}
              beforeUpload={() => false}
              accept="application/pdf"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag PDF to this area to upload</p>
              <p className="ant-upload-hint">Only PDF files are allowed. Max size: 10MB.</p>
            </Dragger>
          </Form.Item>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" className="w-full">
              Create Notice
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateNotice;
