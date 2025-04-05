import React, { useEffect, useState } from 'react';
import { Button, Card, Typography, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Notice } from '../../../types/notice';
import { noticeService } from '../../../services/noticeService';
import { useLoading } from '../../../context/LoadingContext';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const NoticeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [notice, setNotice] = useState<Notice | null>(null);
    const { startLoading, stopLoading } = useLoading();
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotice = async () => {
            if (!id) return;
            
            try {
                startLoading();
                const data = await noticeService.getNoticeById(id);
                setNotice(data);
            } catch (error: any) {
                api.error({
                    message: 'Failed to fetch notice',
                    description: error.response?.data?.error || 'Please try again later.',
                    duration: 5,
                    placement: 'top'
                });
                navigate('/notice-board');
            } finally {
                stopLoading();
            }
        };

        fetchNotice();
    }, [id, navigate]);

    if (!notice) {
        return null;
    }

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
            
            <Card className="bg-yt-light-gray">
                <Title level={2} className="text-white mb-2">{notice.title}</Title>
                <div className="flex justify-between items-center mb-6">
                    <Text className="text-blue-400">{notice.category}</Text>
                    <Text className="text-gray-400">
                        Posted on {new Date(notice.createdAt).toLocaleDateString()}
                    </Text>
                </div>
                <Paragraph className="text-white whitespace-pre-wrap">
                    {notice.content}
                </Paragraph>
                <Text className="text-gray-400 block mt-4">
                    Posted by: {notice.createdBy}
                </Text>
            </Card>
        </div>
    );
};

export default NoticeDetails; 