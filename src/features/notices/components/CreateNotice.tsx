import { ArrowLeftOutlined, InboxOutlined } from '@ant-design/icons';
import {
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FORM_RULES, NOTICE_CATEGORIES, NOTICE_MESSAGES, NOTIFICATION_CONFIG } from '../../../constants';
import { useLoading } from '../../../context/LoadingContext';
import { noticeService } from '../../../services/noticeService';
import { CreateNoticePayload } from '../../../types/notice';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

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

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

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

      await axios.post('http://localhost:3000/api/notices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      message.success(NOTICE_MESSAGES.CREATE.SUCCESS);
      form.resetFields();
      setFileList([]);
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
                  className="create-notice-upload"
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

          <Form.Item label={<span className="text-white">Upload Attachments</span>} name="attachments">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
                files.
              </p>
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
