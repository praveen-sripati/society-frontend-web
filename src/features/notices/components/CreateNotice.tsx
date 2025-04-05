import React from 'react';
import { Button, Form, Input, Select, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreateNoticePayload, NoticeCategory } from '../../../types/notice';
import { noticeService } from '../../../services/noticeService';
import { useLoading } from '../../../context/LoadingContext';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const categoryOptions = [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'events', label: 'Events' },
    { value: 'security', label: 'Security' },
    { value: 'general', label: 'General' }
];

const CreateNotice: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { startLoading, stopLoading } = useLoading();
    const [api, contextHolder] = notification.useNotification();

    const handleSubmit = async (values: CreateNoticePayload) => {
        try {
            startLoading();
            await noticeService.createNotice(values);
            notification.success({
                message: 'Notice Created',
                description: 'The notice has been created successfully.',
                duration: 5,
                placement: 'top'
            });
            navigate('/notice-board');
        } catch (error: any) {
            api.error({
                message: 'Failed to create notice',
                description: error.response?.data?.error || 'Please try again later.',
                duration: 5,
                placement: 'top'
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

            <div className="max-w-2xl mx-auto">
                <Title level={2} className="text-white mb-6">Create Notice</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="bg-yt-light-gray p-6 rounded"
                >
                    <Form.Item
                        label={<span className="text-white">Title</span>}
                        name="title"
                        rules={[{ required: true, message: 'Please enter a title!' }]}
                    >
                        <Input placeholder="Enter notice title" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-white">Category</span>}
                        name="category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select
                            placeholder="Select notice category"
                            options={categoryOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-white">Content</span>}
                        name="content"
                        rules={[{ required: true, message: 'Please enter the notice content!' }]}
                    >
                        <TextArea
                            placeholder="Enter notice content"
                            rows={6}
                        />
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