import { Button, Form, Input, notification, Typography } from 'antd';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { 
    API_ENDPOINTS, 
    NOTIFICATION_CONFIG, 
    FORM_RULES,
    VALIDATION_MESSAGES 
} from '../constants';

const { Title } = Typography;

const RegistrationPage: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { startLoading, stopLoading, isLoading } = useLoading();

    const handleRegistration = () => {
        form.validateFields()
            .then((values) => {
                registerUser(values);
            })
            .catch(() => {
                api.error({
                    message: 'Validation Failed',
                    description: VALIDATION_MESSAGES.REQUIRED,
                    ...NOTIFICATION_CONFIG
                });
            });
    };

    const registerUser = async (values: any) => {
        try {
            startLoading();
            const response = await axios.post(
                `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}/resident`,
                {
                    apartment_number: values.apartmentNumber,
                    mobile_number: values.mobileNumber,
                    password: values.password,
                },
                { withCredentials: true }
            );

            notification.success({
                message: 'Registration Successful',
                description: response.data.message,
                ...NOTIFICATION_CONFIG
            });
            navigate('/login', { replace: true });
        } catch (error: any) {
            api.error({
                message: 'Registration Failed',
                description: error.response?.data?.message || 'Please try again.',
                ...NOTIFICATION_CONFIG
            });
        } finally {
            stopLoading();
        }
    };

    return (
        <>
            {contextHolder}
            <div className="flex justify-center items-center h-screen bg-yt-black">
                <div className="bg-yt-light-gray rounded-lg shadow-xl p-12 w-96 text-white">
                    <Title level={2} className="text-center mb-16 text-white">Create Account</Title>
                    <Form form={form} layout="vertical" onFinish={handleRegistration}>
                        <Form.Item
                            label="Apartment Number"
                            name="apartmentNumber"
                            rules={[{ required: true, message: 'Please enter your apartment number!' }]}
                            className="mb-8"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input
                                placeholder="e.g., A-101"
                                size="large"
                                className="py-2"
                                disabled={isLoading}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mobile Number"
                            name="mobileNumber"
                            rules={[{ required: true, message: 'Please enter your mobile number!' }]}
                            className="mb-8"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input
                                placeholder="Enter your mobile number"
                                size="large"
                                className="py-2"
                                disabled={isLoading}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                            className="mb-8"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.Password
                                placeholder="Enter your password"
                                size="large"
                                className="py-2"
                                disabled={isLoading}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                            className="mb-8"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.Password
                                placeholder="Re-enter your password"
                                size="large"
                                className="py-2"
                                disabled={isLoading}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full mb-8 h-12"
                            loading={isLoading}
                        >
                            Register
                        </Button>
                    </Form>
                    <Typography.Link
                        onClick={() => navigate('/login')}
                        className="block text-center mb-4 text-blue-400"
                    >
                        Already have an account? Log in
                    </Typography.Link>
                </div>
            </div>
        </>
    );
};

export default RegistrationPage;