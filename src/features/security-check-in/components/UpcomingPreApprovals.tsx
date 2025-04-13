import { Button, Input, Table, TableColumnsType, Typography, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useLoading } from '../../../context/LoadingContext';
import visitorsService from '../../../services/visitorsService';
import { PreApproval } from '../../../types/visitors';
import { API_ENDPOINTS } from '../../../constants';
import axios from 'axios';

const { Title } = Typography;

const UpcomingPreApprovals: React.FC = () => {
  const [preApprovals, setUpcomingApprovals] = useState<PreApproval[]>([]);
  const { startLoading, stopLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchName, setSearchName] = useState('');

  const handleCheckIn = async (visitor: any) => {
    startLoading();
    try {
      const response = await axios.post(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals/arrivals`, {
        // Adjust URL if needed
        pre_approval_id: visitor.id,
        visitor_name: visitor.visitor_name,
      });

      console.log('Visitor checked in successfully:', response.data);
      message.success(`Checked in ${visitor.visitor_name}`);
      // Optionally: Update the UI to reflect the check-in (e.g., remove from the list)
      // You might call a function to refresh the pre-approval list here
      // or update the state directly
      fetchPreApprovals();
    } catch (error: any) {
      console.error('Check-in error:', error);
      message.error(error.response?.data?.error || 'Failed to check in visitor.');
    }  finally {
      stopLoading();
    }
  };

  const fetchPreApprovals = async () => {
    startLoading();
    try {
      const response = await visitorsService.getPaginatedPreApprovalsStatusUpcoming(currentPage, pageSize);
      setUpcomingApprovals(response.data);
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

  const columns: TableColumnsType<PreApproval> = [
    {
      title: 'Visitor Name',
      dataIndex: 'visitor_name',
      key: 'visitor_name',
    },
    {
      title: 'Expected Arrival',
      dataIndex: 'arrival_time',
      key: 'arrival_time',
      render: (text: string) => (text ? dayjs(text).format('MMM D, YYYY h:mm A') : 'Not Specified'),
      defaultSortOrder: 'ascend',
      sorter: (a: PreApproval, b: PreApproval) => dayjs(a.arrival_time).valueOf() - dayjs(b.arrival_time).valueOf(),
    },
    {
      title: 'Apartment',
      dataIndex: 'apartment_number',
      key: 'apartment_number',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="primary" size="small" onClick={() => handleCheckIn(record)}>
          Check In
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Upcoming Visitors</Title>
      <Input.Search
        placeholder="Search visitor"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="mb-4"
      />
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
      />
    </div>
  );
};

export default UpcomingPreApprovals;
