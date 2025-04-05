import { Button, Form, Input, message, notification, Typography } from 'antd'; // Import notification
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

const { Title } = Typography;

interface RegistrationPageProps {}

const RegistrationPage: React.FC<RegistrationPageProps> = () => {
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { startLoading, stopLoading, isLoading } = useLoading();

    const handleRegistration = () => {
        form.validateFields()
            .then((values) => {
                registerUser(values);
            })
            .catch((errorInfo) => {
                api.error({
                    message: 'Validation Failed',
                    description: 'Please check your input and try again.',
                    duration: 5,
                    placement: 'top'
                });
            });
    };

    const registerUser = async (values: any) => {
        try {
            startLoading();
            await axios.post('http://localhost:3000/api/users/register/resident', {
                apartment_number: values.apartmentNumber,
                mobile_number: values.mobileNumber,
                password: values.password,
            }, {
                withCredentials: true
            });

            message.success('Registration successful!');
            navigate('/login', { replace: true });
        } catch (error: any) {
            api.error({
                message: 'Registration Failed',
                description: error.response?.data?.error || 'Please try again.',
                duration: 5,
                placement: 'top'
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