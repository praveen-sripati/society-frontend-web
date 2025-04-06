import React, { useEffect, useState } from 'react';
import { Button, Card, Typography, notification, Modal, Badge, Breadcrumb, Image } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Notice } from '../../../types/notice';
import { noticeService } from '../../../services/noticeService';
import { useLoading } from '../../../context/LoadingContext';
import { ArrowLeftOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import { CATEGORY_COLORS, NOTICE_MESSAGES } from '../../../constants';
import { NOTIFICATION_CONFIG } from '../../../types/api';
import { usePermission } from '../../../hooks/usePermission';

const { Title, Text, Paragraph } = Typography;

interface Attachment {
  url: string;
  filename: string;
}

const NoticeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const { startLoading, stopLoading } = useLoading();
  const [api, contextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [ellipsis, setEllipsis] = useState(true);
  const navigate = useNavigate();
  const { can } = usePermission();

  useEffect(() => {
    const fetchNotice = async () => {
      if (!id) return;

      try {
        startLoading();
        const data = await noticeService.getNoticeById(id);
        setNotice(data);
      } catch (error: any) {
        api.error({
          message: NOTICE_MESSAGES.FETCH.SINGLE_ERROR,
          description: error.response?.data?.message || 'Please try again later.',
          ...NOTIFICATION_CONFIG,
        });
        navigate('/notice-board');
      } finally {
        stopLoading();
      }
    };

    fetchNotice();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id || !notice) return;

    modalApi.confirm({
      title: 'Delete Notice',
      content: `Are you sure you want to delete "${notice.title}"?`,
      okText: 'Yes, Delete',
      okButtonProps: {
        danger: true,
        className: 'bg-red-500',
      },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          startLoading();
          await noticeService.deleteNotice(id);
          api.success({
            message: 'Notice Deleted',
            description: 'The notice has been successfully deleted.',
            ...NOTIFICATION_CONFIG,
          });
          navigate('/notice-board');
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

  if (!notice) {
    return null;
  }

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
        <Breadcrumb.Item>
          <Link to="/notice-board">Notice Board</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Notice Detail</Breadcrumb.Item>
      </Breadcrumb>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/notice-board')}
        className="mb-4 text-white hover:text-blue-400"
      >
        Back to Notice Board
      </Button>

      <Card className="max-w-3xl mx-auto bg-yt-light-gray">
        <div className="flex justify-between items-start">
          <Title level={2} className="text-white mb-0">
            {notice.title}
          </Title>
          {can('delete:notice') && (
            <Button
              type="text"
              danger
              size="large"
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600"
            />
          )}
        </div>
        <Text className="text-gray-400 block mb-4">Posted by: {notice.posted_by}</Text>
        <div className="max-w-80">
          <Image
            width="100%"
            className="mb-4 rounded"
            src={notice?.image_url}
            preview={false}
            placeholder={
              <Image
                preview={false}
                src={notice?.image_url + '?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200'}
              />
            }
            style={{ objectFit: 'cover' }}
            fallback="data:image/png;base64,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"
          />
        </div>
        <Paragraph ellipsis={ellipsis ? { rows: 5, expandable: true, symbol: 'more' } : false}>
          {notice.content}
        </Paragraph>
        {notice.attachments && notice.attachments.length > 0 && (
          <div className="my-4">
            <Text strong className="text-white mb-2 pr-2">
              Attachments:
            </Text>
            {notice.attachments.map((attachment: Attachment, index: number) => (
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                {attachment.filename}
              </a>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center">
          <Badge color={CATEGORY_COLORS[notice.category]} text={notice.category} />
          <Text className="text-gray-400">
            Posted on{' '}
            {new Date(notice.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default NoticeDetails;
