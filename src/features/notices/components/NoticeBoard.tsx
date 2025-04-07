import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, FilePdfOutlined, HomeOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Empty,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORY_COLORS, NOTICE_FILTER_CATEGORIES, NOTICE_MESSAGES } from '../../../constants';
import { useLoading } from '../../../context/LoadingContext';
import { usePermission } from '../../../hooks/usePermission';
import { noticeService } from '../../../services/noticeService';
import { NOTIFICATION_CONFIG } from '../../../types/api';
import { Notice, NoticeCategory, NoticeCategoryFilter, NoticeFilters } from '../../../types/notice';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filters, setFilters] = useState<NoticeFilters>({ category: 'all' });
  const { startLoading, stopLoading } = useLoading();
  const [api, contextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [ellipsis, _setEllipsis] = useState(true);
  const navigate = useNavigate();
  const { can } = usePermission();

  const fetchNotices = async (currentFilters: NoticeFilters = {}) => {
    try {
      startLoading();

      const apiFilters = {
        ...currentFilters,
        category: currentFilters.category === 'all' ? undefined : (currentFilters.category as NoticeCategory),
      };
      const data = await noticeService.getNotices(apiFilters);

      if (!data) {
        console.warn('[NoticeBoard] No data received, setting empty array');
        setNotices([]);
        return;
      }
      setNotices(data);
    } catch (error: any) {
      console.error('[NoticeBoard] Error in fetchNotices:', error);
      api.error({
        message: NOTICE_MESSAGES.FETCH.ERROR,
        description: error.response?.data?.message || 'Please try again later.',
        ...NOTIFICATION_CONFIG,
      });
      setNotices([]);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchNotices(filters);
  }, [filters]);

  // Add logging to render

  const handleCategoryChange = (category: NoticeCategoryFilter) => {
    setFilters((prev) => ({
      ...prev,
      category: category,
    }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleNoticeClick = (id: string) => {
    navigate(`/notices/${id}`);
  };

  const handleEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/notices/${id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent, notice: Notice) => {
    e.stopPropagation(); // Prevent card click when clicking delete button

    modalApi.confirm({
      title: 'Delete Notice',
      content: `Are you sure you want to delete "${notice.title}"?`,
      okText: 'Yes, Delete',
      okButtonProps: {
        danger: true,
        className: 'bg-red-500',
      },
      centered: true,
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          startLoading();
          await noticeService.deleteNotice(notice.id);
          api.success({
            message: 'Notice Deleted',
            description: 'The notice has been successfully deleted.',
            ...NOTIFICATION_CONFIG,
          });
          fetchNotices(filters); // Refresh the list
        } catch (error: any) {
          api.error({
            message: 'Failed to Delete Notice',
            description: error.response?.data?.message || 'Please try again later.',
            ...NOTIFICATION_CONFIG,
          });
        } finally {
          stopLoading();
        }
      },
    });
  };

  return (
    <div className="p-6">
      {modalContextHolder}
      {contextHolder}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Notice Board</Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex items-center justify-between mb-6">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard')}
          className="text-white hover:text-blue-400 p-0"
        >
          Back to Dashboard
        </Button>
        {can('create:notice') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/notices/create')}>
            Create Notice
          </Button>
        )}
      </div>

      <div className="mb-6">
        <Title level={2} className="text-white mb-6">
          Notice Board
        </Title>
        <Space className="w-full justify-end mb-4">
          <Select
            placeholder="Filter by category"
            value={filters.category || 'all'}
            style={{ width: 200 }}
            options={NOTICE_FILTER_CATEGORIES}
            onChange={handleCategoryChange}
          />
          <Search placeholder="Search notices" allowClear onSearch={handleSearch} style={{ width: 300 }} />
        </Space>
      </div>

      {notices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {notices.map((notice) => (
            <Card
              key={notice.id}
              className="bg-yt-light-gray cursor-pointer transition-transform transform hover:scale-[1.02] hover:shadow-lg relative group notice-card"
              onClick={() => handleNoticeClick(notice.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <Title
                  level={4}
                  className="text-white mb-0 pr-8"
                  ellipsis={ellipsis ? { tooltip: notice.title } : false}
                >
                  {notice.title}
                </Title>
                {can('delete:notice') && (
                  <Button
                    type="text"
                    danger
                    size="large"
                    icon={<DeleteOutlined />}
                    onClick={(e) => handleDelete(e, notice)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 text-red-500 hover:text-red-600"
                  />
                )}
              </div>
              <Image
                width="100%"
                className="mb-4 rounded"
                src={notice?.image_url}
                preview={false}
                placeholder={
                  <Image
                    preview={false}
                    src={
                      notice?.image_url + '?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200'
                    }
                  />
                }
                style={{ objectFit: 'cover' }}
                fallback="data:image/png;base64,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"
              />
              <Paragraph className="text-gray-400 mb-4" ellipsis={{ rows: 2 }}>
                {notice.content}
              </Paragraph>
              <div className="mb-4">
                <Text strong={true}>Attachments: </Text>
                {notice.attachments ? (
                  <Tooltip title={notice.attachments.filename} key={notice.attachments.filename}>
                    <a
                      onClick={(e) => e.stopPropagation()}
                      href={notice.attachments.url}
                      download={notice.attachments.filename} // Use the download attribute
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button type="link" icon={<FilePdfOutlined />}>
                        Download PDF
                      </Button>
                    </a>
                  </Tooltip>
                ) : (
                  <Text className="leading-[32px]">NA</Text>
                )}
              </div>
              <div className="flex justify-between items-center mt-auto">
                <Tag color={CATEGORY_COLORS[notice.category]}>
                  {notice?.category?.charAt(0).toUpperCase() + notice?.category?.slice(1)}
                </Tag>
                <Tooltip title="Edit Notice" key="edit">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={(e) => handleEditClick(e, notice.id)}
                        shape="circle" // Make it a circle
                        size="large"   // Make it smaller
                    />
                </Tooltip>
                <Text className="text-gray-400">
                  {new Date(notice.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty description={<Text className="text-gray-400">No notices found</Text>} />
      )}
    </div>
  );
};

export default NoticeBoard;
