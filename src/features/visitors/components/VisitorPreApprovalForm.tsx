import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Typography,
  message,
  Breadcrumb,
  Card,
  DatePickerProps,
} from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useLoading } from '../../../context/LoadingContext'; // Adjust import path
import { API_ENDPOINTS } from '../../../constants';
import visitorsService from '../../../services/visitorsService';
import dayjs from 'dayjs';
import { dateTimeUtils, validators } from '../../../utils';

const { Title } = Typography;

const VisitorPreApprovalForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { id } = useParams(); // Get the pre-approval ID (if editing)

  React.useEffect(() => {
    if (id) {
      startLoading();
      axios
        .get(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals/${id}`) // Adjust URL
        .then((response) => {
          const preApprovalData = response.data;
          form.setFieldsValue({
            visitor_name: preApprovalData.visitor_name,
            arrival_date: preApprovalData.arrival_time ? dayjs(preApprovalData.arrival_time) : null,
            arrival_time: preApprovalData.arrival_time ? dayjs(preApprovalData.arrival_time) : null,
            departure_time: preApprovalData.departure_time ? dayjs(preApprovalData.departure_time) : null,
            purpose: preApprovalData.purpose,
            apartment_number: preApprovalData.apartment_number,
          });
        })
        .catch((error) => {
          console.error('Error fetching pre-approval:', error);
          message.error('Failed to fetch pre-approval data.');
          navigate('/visitor-pre-approvals'); // Redirect on error
        })
        .finally(() => {
          stopLoading();
        });
    }
  }, [id]);

  const onFinish = async (values: any) => {
    startLoading();
    try {
      if (id) {
        await visitorsService.updatePreApproval(id, values);
        message.success('Pre-approval updated successfully.');
      } else {
        await visitorsService.createPreApproval(values);
        message.success('Pre-approval created successfully.');
      }
      navigate('/visitor-pre-approvals'); // Redirect to the list
    } catch (error: any) {
      console.error('Error:', error);
      message.error(error.response?.data?.error || 'An error occurred.');
    } finally {
      stopLoading();
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo);
  };

  const onOk = (value: DatePickerProps['value']) => {
    console.log('onOk: ', value);
  };

  return (
    <div className="bg-yt-black rounded-lg shadow-md p-4">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/visitor-pre-approvals">Visitor Pre-Approvals</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{id ? 'Edit Pre-Approval' : 'Create Pre-Approval'}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="max-w-[550px] mx-auto">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/visitor-pre-approvals')}
          className="p-0 mb-4"
        >
          Back to Pre-Approvals
        </Button>
        <Title level={2} className="mb-6">
          {id ? 'Edit Pre-Approval' : 'Create Pre-Approval'}
        </Title>
        <Card className="bg-yt-light-gray">
          <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Form.Item
              label="Visitor Name"
              name="visitor_name"
              rules={[{ required: true, message: 'Please enter visitor name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Arrival Time" name="arrival_time">
              <DatePicker showTime style={{ width: '100%' }} disabledDate={dateTimeUtils.disabledPreviousDate} />
            </Form.Item>

            <Form.Item
              label="Departure Time"
              name="departure_time"
              dependencies={['arrival_time']}
              rules={[({ getFieldValue }) => validators.validateDepartureTime({ getFieldValue })]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Purpose of Visit" name="purpose">
              <Input />
            </Form.Item>

            <Form.Item
              label="Apartment Number"
              name="apartment_number"
              rules={[{ required: true, message: 'Please enter apartment number!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" className="w-full">
                {id ? 'Update Pre-Approval' : 'Create Pre-Approval'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default VisitorPreApprovalForm;
