import React, { useEffect, useState } from 'react';
import { Card, Input, Select, Space, Typography, notification, Empty, Button } from 'antd';
import { Notice, NoticeCategory, NoticeFilters, NoticeCategoryFilter } from '../../../types/notice';
import { noticeService } from '../../../services/noticeService';
import { useLoading } from '../../../context/LoadingContext';
import { usePermission } from '../../../hooks/usePermission';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

const categoryOptions = [
    { value: 'all', label: 'All' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'events', label: 'Events' },
    { value: 'security', label: 'Security' },
    { value: 'general', label: 'General' }
];

const NoticeBoard: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [filters, setFilters] = useState<NoticeFilters>({ category: 'all' });
    const { startLoading, stopLoading } = useLoading();
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const { can } = usePermission();

    const fetchNotices = async (currentFilters: NoticeFilters = {}) => {
        try {
            startLoading();
            // Only include category in API call if it's not 'all'
            const apiFilters = {
                ...currentFilters,
                category: currentFilters.category === 'all' ? undefined : currentFilters.category as NoticeCategory
            };
            const data = await noticeService.getNotices(apiFilters);
            setNotices(data);
        } catch (error: any) {
            api.error({
                message: 'Failed to fetch notices',
                description: error.response?.data?.error || 'Please try again later.',
                duration: 5,
                placement: 'top'
            });
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        fetchNotices(filters);
    }, [filters]);

    const handleCategoryChange = (category: NoticeCategoryFilter) => {
        setFilters(prev => ({
            ...prev,
            category: category
        }));
    };

    const handleSearch = (value: string) => {
        setFilters(prev => ({
            ...prev,
            search: value
        }));
    };

    const handleNoticeClick = (id: string) => {
        navigate(`/notices/${id}`);
    };

    return (
        <div className="p-6">
            {contextHolder}
            <div className="flex items-center justify-between mb-6">
                <Button 
                    type="link" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/dashboard')}
                    className="text-white hover:text-blue-400"
                >
                    Back to Dashboard
                </Button>
                {can('create:notice') && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/notices/create')}
                    >
                        Create Notice
                    </Button>
                )}
            </div>
            
            <div className="mb-6">
                <Title level={2} className="text-white mb-6">Notice Board</Title>
                <Space className="w-full justify-end mb-4">
                    <Select
                        placeholder="Filter by category"
                        value={filters.category || 'all'}
                        style={{ width: 200 }}
                        options={categoryOptions}
                        onChange={handleCategoryChange}
                    />
                    <Search
                        placeholder="Search notices"
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                    />
                </Space>
            </div>

            {notices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notices.map(notice => (
                        <Card
                            key={notice.id}
                            className="bg-yt-light-gray cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleNoticeClick(notice.id)}
                        >
                            <Title level={4} className="text-white mb-2">{notice.title}</Title>
                            <Text className="text-gray-400 block mb-4">
                                {notice.content.length > 150 
                                    ? `${notice.content.substring(0, 150)}...` 
                                    : notice.content}
                            </Text>
                            <div className="flex justify-between items-center">
                                <Text className="text-blue-400">{notice.category}</Text>
                                <Text className="text-gray-400">
                                    {new Date(notice.createdAt).toLocaleDateString()}
                                </Text>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Empty
                    description={
                        <Text className="text-gray-400">
                            No notices found
                        </Text>
                    }
                />
            )}
        </div>
    );
};

export default NoticeBoard; 