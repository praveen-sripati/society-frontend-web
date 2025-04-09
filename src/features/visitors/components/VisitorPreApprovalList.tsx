import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Modal, Space, Table, TableColumnsType, Tooltip, Typography, message, notification } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../../../context/LoadingContext'; // Adjust the import path
import { useUser } from '../../../hooks/useUser';
import visitorsService from '../../../services/visitorsService';
import { PreApproval } from '../../../types/visitors';

const { Title } = Typography;

const VisitorPreApprovalList: React.FC = () => {
  const [preApprovals, setPreApprovals] = useState<PreApproval[]>([]);
  const { startLoading, stopLoading } = useLoading(); // Use Loading Context
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const { user } = useUser();

  const fetchPreApprovals = async () => {
    startLoading();
    try {
      const response = await visitorsService.getPaginatedPreApprovals(currentPage, pageSize);
      setPreApprovals(response.data);
      setTotalItems(response.total);
    } catch (error: any) {
      console.error('Error fetching pre-approvals:', error);
      message.error(error.response?.data?.error || 'Failed to fetch pre-approvals');
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchPreApprovals();
  }, [currentPage, pageSize]);

  const handleEditClick = (id: number) => {
    navigate(`/visitor-pre-approvals/${id}/edit`); // Adjust the edit route as needed
  };

  const handleDeleteClick = async (id: number) => {
    modalApi.confirm({
      title: 'Delete Visitor Pre-Approval',
      content: `Are you sure you want to delete?`,
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
          await visitorsService.deletePreApproval(id);
          message.success('Pre-approval deleted successfully.');
          // After successful deletion, refresh the list
          fetchPreApprovals();
        } catch (error: any) {
          console.error('Error deleting pre-approval:', error);
          message.error(error.response?.data?.error || 'Failed to delete pre-approval.');
        } finally {
          stopLoading();
        }
      },
    });
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns: TableColumnsType<PreApproval> = [
    {
      title: 'Visitor Name',
      dataIndex: 'visitor_name',
      key: 'visitor_name',
      sorter: (a: PreApproval, b: PreApproval) => a.visitor_name.localeCompare(b.visitor_name),
    },
    {
      title: 'Apartment',
      dataIndex: 'apartment_number',
      key: 'apartment_number',
    },
    {
      title: 'Arrival Time',
      dataIndex: 'arrival_time',
      key: 'arrival_time',
      render: (text: string) => (text ? dayjs(text).format('MMM D, YYYY h:mm A') : 'Not Specified'),
      defaultSortOrder: 'ascend',
      sorter: (a: PreApproval, b: PreApproval) => dayjs(a.arrival_time).valueOf() - dayjs(b.arrival_time).valueOf(),
    },
    {
      title: 'Departure Time',
      dataIndex: 'departure_time',
      key: 'departure_time',
      render: (text: string) => (text ? dayjs(text).format('MMM D, YYYY h:mm A') : 'Not Specified'),
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => (text ? dayjs(text).format('MMM D, YYYY h:mm A') : 'Not Specified'),
      sorter: (a: PreApproval, b: PreApproval) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PreApproval) => (
        <Space size="middle">
          {user && (user.role === 'admin' || user.id === record.resident_id) ? (
            <>
              <Button type="primary" size="small" onClick={() => handleEditClick(record.id)}>
                Edit
              </Button>
              <Button danger size="small" onClick={() => handleDeleteClick(record.id)}>
                Delete
              </Button>
            </>
          ) : (
            <Tooltip title="Not Applicable">
              <span>NA</span>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-yt-black text-white min-h-screen p-8">
      {modalContextHolder}
      {contextHolder}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Visitor Pre-Approvals</Breadcrumb.Item>
      </Breadcrumb>

      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/dashboard')}
        className="mb-4 text-white hover:text-blue-400 p-0"
      >
        Back to Dashboard
      </Button>
      <div className="flex items-center justify-between mb-4">
        <Title level={2}>Visitor Pre-Approvals</Title>
        <Button type="primary" onClick={() => navigate('/visitor-pre-approvals/create')} className="ml-auto">
          Create Pre-Approval
        </Button>
      </div>

      <Table<PreApproval>
        columns={columns}
        dataSource={preApprovals}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showSizeChanger: true, // Enable page size selection
          pageSizeOptions: ['10', '20', '50', '100'], // Options for page size
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default VisitorPreApprovalList;
