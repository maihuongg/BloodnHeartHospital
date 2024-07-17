import React, { useEffect, useState, useRef, useId } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, Button, TextInput, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import baseUrl from '../utils/constant';
import { AntDesign } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import isEmpty from "validator/lib/isEmpty";
import { Alert } from 'react-native';
import {
    eventProfileStart,
    eventProfileSuccess,
    eventProfileFailed,
} from "../redux/eventSlice";
import Stepper from 'react-native-step-indicator'; // Đảm bảo bạn import Stepper từ thư viện react-native-step-indicator
import StepIndicator from 'react-native-step-indicator';

const DetailEvent = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.login.currentUser);
    const eventDetail = useSelector((state) => state.event.eventProfile.getEvent);
    const eventId = eventDetail._id;
    const accessToken = user?.accessToken;
    const handleNavigateToDetailEvent = () => {
        navigation.navigate('DetailEvent');

    }
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null); // Khai báo và gán giá trị cho biến selected
    const [userId, setUserId] = useState("");
    const [data, setData] = useState([]);
    const [eventName, setEventName] = useState(eventDetail?.eventName);
    const [date_start, setDate_start] = useState(eventDetail?.date_start);
    const [date_end, setDate_end] = useState(eventDetail?.date_end);
    const [amount, setAmount] = useState(eventDetail?.amount);
    const [address, setAddress] = useState(eventDetail?.address);
    const [showPicker1, setShowPicker1] = useState(false);
    const [showPicker2, setShowPicker2] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date_start;
        setShowPicker1(false);
        setDate_start(currentDate);
    };

    const onChange1 = (event, selectedDate) => {
        const currentDate = selectedDate || date_end;
        setShowPicker2(false);
        setDate_end(currentDate);
    };

    const minDate = new Date();

    useEffect(() => {
        if (!modalVisible) {
            const handleListUserWithReward = async () => {
                try {
                    const response = await fetch(`${baseUrl}/v1/hospital/getuserwithreward/` + eventId, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            token: `Bearer ${accessToken}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("data ok", data)
                        setData(data);
                    }
                    else return 0;
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            handleListUserWithReward();
        }

    }, [modalVisible]);
    const steps = [
        { label: 'Kiểm tra tiêu chuẩn máu', description: 'Đang kiểm tra chất lượng máu của người hiến.' },
        { label: 'Đang chờ hiến máu', description: 'Người dùng đang chờ để hiến máu.' },
        { label: 'Đang hiến máu', description: 'Người dùng đang hiến máu.' },
        { label: 'Đã hiến máu xong', description: 'Người dùng đã hoàn thành quá trình hiến máu.' },
    ];
    const stepIndicatorStyles = {
        stepIndicatorSize: 30,
        currentStepIndicatorSize: 40,
        separatorStrokeWidth: 3,
        currentStepStrokeWidth: 5,
        stepStrokeCurrentColor: '#fe7013',
        separatorFinishedColor: '#fe7013',
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: '#fe7013',
        stepIndicatorUnFinishedColor: '#aaaaaa',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 15,
        currentStepIndicatorLabelFontSize: 15,
        stepIndicatorLabelCurrentColor: '#000000',
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
        labelColor: '#666666',
        labelSize: 15,
        currentStepLabelColor: '#fe7013',
    };


    const handleOpenModal = async (userId) => {
        console.log("Opening modal...");
        setUserId(userId);
        console.log('userId selected:', userId)
        setModalVisible(true);
        try {
            const response1 = await fetch(`${baseUrl}/v1/hospital/find-user-in-event/?eventId=${eventId}&userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response1.ok) {
                const err = await response1.json();
                // showNotificationErr(err.message);
            } else {
                const dataUserProfile = await response1.json();
                console.log('dataUserProfile:', dataUserProfile)

                const blood_status = dataUserProfile.blood_status;
                console.log(' blood_status: ', blood_status)
                setBloodStatus(blood_status);

                const status_user = dataUserProfile.status_user;
                if (blood_status == null)
                    setActiveStep(0);
                if (bloodStatus == 0) {
                    setActiveStep(1); // Directly set to end step if not qualified
                }
                if (blood_status == 1 && status_user == -1) {
                    setActiveStep(1);
                }
                if (blood_status == 1 && status_user == 0) {
                    setActiveStep(2);
                }
                if (blood_status == 1 && status_user == 1) {
                    setActiveStep(3);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleCloseModal = () => {
        console.log("Opening modal...");
        setModalVisible(false);
    };
    const handleGoBackHome = () => {
        navigation.navigate('Home', { screen: 'HomeScreen' });
    }
    const handleUpdateStatus = async () => {
        if (selected === null) {
            Alert.alert('Vùi lòng chọn trạng thái muốn cập nhật');
        }
        else {
            let statususer;
            if (selected === 'Đã hiến') {
                statususer = "1";
            } else {
                if (selected === 'Đang chờ hiến') {
                    statususer = "0";
                } else {
                    statususer = "-1";
                }
            }
            console.log('status', statususer);
            console.log('userid', userId);
            const updateStatus = {
                eventId: eventId,
                userId: userId,
                status: statususer
            }

            try {
                console.log('lỗi aaaaa');
                const response = await fetch(`${baseUrl}/v1/hospital/update-status1`, {
                    method: 'PUT',
                    body: JSON.stringify(updateStatus),
                    headers: {
                        'Content-Type': 'application/json',
                        token: `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    dispatch(eventProfileFailed());
                    Alert.alert('Thất bại', errorData.message);
                } else {
                    const data = await response.json();
                    dispatch(eventProfileSuccess(data.event));
                    setModalVisible(false);
                    Alert.alert("Thành công", "Bạn đã cập nhật thành công!");
                }
            } catch (error) {
                dispatch(eventProfileFailed());
                console.log('lỗi1');
                Alert.alert("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
            }
        }
    }
    const statusHienMau = [
        { key: 'Đã hiến', value: 'Đã hiến' },
        { key: 'Đang chờ hiến', value: 'Đang chờ hiến' },
        { key: 'Chưa hiến', value: 'Chưa hiến' },

        // Thêm các nhóm máu khác nếu cần
    ];
    const handleNext = async () => {
        if (activeStep === 0) {
            // Gọi API để cập nhật blood_status và description
            try {
                const updateBloodStatus = {
                    eventId: eventId,
                    userId: userId,
                    bloodStatus: bloodStatus,
                    description: description,
                }
                const response = await fetch(`${baseUrl}/v1/hospital/update-blood-status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json', token: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(updateBloodStatus),
                });
                if (!response.ok) {
                    throw new Error('Cập nhật không thành công');
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } catch (error) {
                console.error('Lỗi khi cập nhật:', error);
                // Xử lý lỗi khi cập nhật không thành công
            }
        }
        if (activeStep === 1) {
            // 
            try {
                const updateCheckinData = {
                    eventId: eventId,
                    userId: userId,
                    checkin_time: new Date(), // Assuming this is the current time
                    status_user: 0, // Assuming this is the status update value
                };

                const response = await fetch(`${baseUrl}/v1/hospital/update-checkin`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json', token: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(updateCheckinData),
                });

                if (!response.ok) {
                    throw new Error('Cập nhật không thành công');
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } catch (error) {
                console.error('Lỗi khi cập nhật:', error);
                // Xử lý lỗi khi cập nhật không thành công
            }
        }
        if (activeStep === 2) {
            // 
            try {
                const updateCheckoutData = {
                    eventId: eventId,
                    userId: userId,
                    checkout_time: new Date(), // Assuming this is the current time
                    status_user: 1, // Assuming this is the status update value
                };

                const response = await fetch(`${baseUrl}/v1/hospital/update-checkout`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json', token: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(updateCheckoutData),
                });

                if (!response.ok) {
                    throw new Error('Cập nhật không thành công');
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } catch (error) {
                console.error('Lỗi khi cập nhật:', error);
                // Xử lý lỗi khi cập nhật không thành công
            }
        }
        // setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleUpdateInforEvent = async () => {
        if (isEmpty(eventName) || isEmpty(address)) {
            Alert.alert("Vui lòng điền vào các mục (*)");
        } else {
            dispatch(eventProfileStart());
            const updateEvent = {
                eventName: eventName,
                date_start: date_start,
                date_end: date_end,
                amount: amount,
                address: address
            }
            try {
                console.log('lỗi aaaaa');
                const response = await fetch(`${baseUrl}/v1/hospital/update-profile/` + eventId, {
                    method: 'PUT',
                    body: JSON.stringify(updateEvent),
                    headers: {
                        'Content-Type': 'application/json',
                        token: `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    dispatch(eventProfileFailed());
                    Alert.alert('Thất bại', errorData.message);
                } else {
                    const data = await response.json();
                    dispatch(eventProfileSuccess(data));
                    console.log('dataEvent', data);
                    setModalVisible1(false);
                    Alert.alert("Thành công", "Bạn đã cập nhật thành công!");
                }
            } catch (error) {
                dispatch(eventProfileFailed());
                console.log('lỗi1');
                Alert.alert("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
            }
        }

    }
    const [bloodStatus, setBloodStatus] = useState('');
    const [description, setDescription] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    return (
        <ScrollView>
            <SafeAreaView className=" flex-1">

                <View className="w-full bg-midnight h-32 relative">

                </View>
                <View className="flex-row bg-white items-center justify-center rounded-xl mx-4 py-6 -mt-10 shadow-md">
                    <Text className="text-black font-bold text-[20px]">THÔNG TIN SỰ KIỆN</Text>
                </View>
                <TouchableOpacity onPress={handleGoBackHome} className="absolute my-10 ml-5">
                    <MaterialIcons name="keyboard-backspace" size={32} color="white" />
                </TouchableOpacity>

                <View className="flex-1 bg-white rounded-md  border-b-[1px] border-semigray-10 shadow-md mx-2 mt-2">
                    <Image
                        source={require('../.././assets/2.png')}
                        className="w-full h-32 rounded-md"
                    />
                    <Text className="text-black font-bold text-[18px] mx-4 mt-2 text-justify">{eventDetail?.eventName}</Text>
                    <View className="flex-row border-t-[1px] border-semigray-10 mt-2">
                        <Text className="text-black font-bold text-[16px] my-2 mx-4">Địa chỉ:
                            <Text className="text-black font-normal text-[16px] my-2 leading-6"> {eventDetail?.address}</Text></Text>

                    </View>
                    <View className="flex-row  bg-[#d7faf5] mx-4 my-2 justify-center ">
                        <Text className="text-black font-bold text-[16px] my-4 mx-2">Ngày bắt đầu: </Text>
                        {/* <Text className="text-black font-normal text-[16px] my-4">{moment(eventDetail?.date_start).format('DD/MM/YYYY')}</Text> */}
                        <Text className="text-black font-normal text-[16px] my-4">{moment(eventDetail?.date_start).format('DD/MM/YYYY')}</Text>
                    </View>
                    <View className="flex-row  bg-[#f7e1d7] mx-4 my-2 justify-center">
                        <Text className="text-black font-bold text-[16px] my-4 mx-2">Ngày kết thúc: </Text>
                        <Text className="text-black font-normal text-[16px] my-4">{moment(eventDetail?.date_end).format('DD/MM/YYYY')}</Text>
                    </View>
                    <View className="flex-row  bg-[#e7eaed] mx-4 my-2 justify-center">
                        <Text className="text-black font-bold text-[16px] my-4 mx-2">Số lượng đã đăng ký: </Text>
                        {/* <Text className="text-black font-normal text-[16px] my-4">{eventDetail?.listusers.count}/<Text className="text-black font-bold text-[16px]">{eventDetail?.amount}</Text></Text> */}
                        <Text className="text-black font-normal text-[16px] my-4">{eventDetail?.listusers.count}/<Text className="text-black font-bold text-[16px]"> {eventDetail?.amount}</Text></Text>
                    </View>

                    <TouchableOpacity onPress={() => setModalVisible1(true)}>
                        <View className="bg-blue mx-auto items-center justify-center rounded-md my-2">
                            <Text className="text-white font-bold p-3 mx-3 text-[16px]">CHỈNH SỬA</Text>
                        </View>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible1}
                        onRequestClose={() => {
                            setModalVisible1(!modalVisible1);
                        }}
                    >
                        <View className="flex-1 bg-rnb justify-center items-center">
                            <View className="h-[85%] w-[95%]">
                                {/* Phần nội dung của modal */}
                                <ScrollView>
                                    <View className=" mx-2 bg-white p-4 rounded-md ">
                                        {/* Đặt các trường để người dùng có thể chỉnh sửa thông tin */}
                                        <Text className="text-xl font-bold text-blue mb-2">Chỉnh sửa sự kiện</Text>
                                        <Text className="text-black text-[16px] font-bold my-2"> Tên sự kiện </Text>
                                        <TextInput
                                            defaultValue={eventDetail?.eventName}
                                            onChangeText={(text) => setEventName(text)}
                                            className="border border-gray-300 rounded-md p-2" />
                                        <Text className="text-black text-[16px] font-bold my-2"> Ngày bắt đầu </Text>
                                        <View className="flex-row border rounded-md my-2">
                                            <Text className="text-black font-normal text-[16px] ml-2 my-4">{moment(date_start).format('DD/MM/YYYY')}</Text>
                                            <View className="ml-auto">
                                                <TouchableOpacity className="my-2" onPress={() => setShowPicker1(true)} >
                                                    <MaterialIcons name="today" size={32} color="red" />
                                                </TouchableOpacity>
                                                {showPicker1 && (
                                                    <DateTimePicker
                                                        testID="dateTimePicker"
                                                        value={new Date(date_start)}
                                                        mode="date"
                                                        display="default"
                                                        minimumDate={minDate}
                                                        onChange={onChange}
                                                    />
                                                )}
                                            </View>
                                        </View>

                                        <Text className="text-black text-[16px] font-bold my-2"> Ngày kết thúc </Text>
                                        <View className="flex-row border rounded-md  my-2">
                                            <Text className="text-black font-normal text-[16px] ml-2 my-4">{moment(date_end).format('DD/MM/YYYY')}</Text>
                                            <View className="ml-auto">
                                                <TouchableOpacity className="my-2" onPress={() => setShowPicker2(true)} >
                                                    <MaterialIcons name="today" size={32} color="red" />
                                                </TouchableOpacity>
                                                {showPicker2 && (
                                                    <DateTimePicker
                                                        testID="dateTimePicker1"
                                                        value={new Date(date_end)}
                                                        mode="date"
                                                        display="default"
                                                        minimumDate={new Date(date_start)}
                                                        onChange={onChange1}
                                                    />
                                                )}
                                            </View>
                                        </View>
                                        <Text className="text-black text-[16px] font-bold my-2"> Số lượng đăng ký tối đa </Text>
                                        <TextInput
                                            defaultValue={eventDetail?.amount.toString()}
                                            onChangeText={(text) => setAmount(parseInt(text, 10))}
                                            className="border border-gray-300 rounded-md p-2" />
                                        <Text className="text-black text-[16px] font-bold my-2"> Địa chỉ </Text>
                                        <TextInput
                                            defaultValue={eventDetail?.address}
                                            onChangeText={(text) => setAddress(text)}
                                            className="border border-gray-300 rounded-md p-2" />
                                        <View className="flex-row justify-center">
                                            <TouchableOpacity onPress={handleUpdateInforEvent}>
                                                <View className="justify-center bg-blue mx-auto my-4 p-3 rounded-md">
                                                    <Text className="text-white font-bold text-[16px]">Lưu thay đổi</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="ml-2" onPress={() => setModalVisible1(false)}>
                                                <View className="justify-center bg-blue mx-auto my-4 p-3 rounded-md">
                                                    <Text className="text-white font-bold text-[16px]">Hủy</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>

                        </View>

                    </Modal>
                </View>
                <View className="flex-row bg-metal items-center justify-center my-2 p-2">
                    <Text className="text-white font-bold text-[16px]">DANH SÁCH ĐĂNG KÝ SỰ KIỆN</Text>
                </View>
                <View className="bg-white p-2 rounded-lg shadow-md">
                    {/* Header */}
                    <View className="flex-row border-b border-gray-200">
                        <Text className="w-1/12 text-center font-bold text-[12px]">STT</Text>
                        <Text className="w-1/3 text-center font-bold text-[12px]">Họ tên</Text>
                        <Text className="w-1/6 text-center font-bold text-[12px]">Điểm thưởng</Text>
                        <Text className="w-1/6 text-center font-bold text-[12px]">Tình trạng</Text>
                        <Text className="w-1/4 text-center font-bold text-[12px]">Thao tác</Text>
                    </View>

                    {/* Data Rows */}
                    {data.map((item, index) => (
                        <View key={index} className="flex-row border-b border-gray-200">
                            <Text className="w-1/12 text-center text-[12px]">{index + 1}</Text>
                            <Text className="w-1/3 text-center text-[12px]">{item.username}</Text>
                            <Text className="w-1/6 text-center text-[12px]">{item.reward}</Text>
                            <Text className="w-1/6 text-center text-[12px]">
                                {item.status_user === "-1"
                                    ? "Chưa hiến"
                                    : item.status_user === "0"
                                        ? "Đang chờ hiến"
                                        : "Đã hiến"}
                            </Text>
                            {item.status_user === "1" ? (
                                <Text className="w-1/3 flex items-center justify-center text-[12px] text-blue-500">
                                    Hiến thành công
                                </Text>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => handleOpenModal(item.userid)}
                                    className="w-1/4 flex items-center justify-center text-[12px]">
                                    <AntDesign name="edit" size={24} color="black" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, width: '95%' }}>
                            <StepIndicator
                                customStyles={stepIndicatorStyles}
                                currentPosition={activeStep}
                                labels={steps.map(step => step.label)}
                                stepCount={steps.length}
                            />
                            {activeStep === 0 && (
                                <View>
                                    <Text style={{ marginTop: 20, marginBottom: 20 }}>{steps[0].description}</Text>
                                    <SelectList
                                        setSelected={(val) => setBloodStatus(val)}
                                        data={[
                                            { key: '1', value: 'Máu đạt tiêu chuẩn' },
                                            { key: '0', value: 'Máu không đạt tiêu chuẩn' }
                                        ]}
                                        placeholder="Chọn trạng thái máu"
                                        boxStyles={{ width: '100%' }}
                                    />
                                    {bloodStatus === '0' && (
                                        <SelectList
                                            setSelected={(val) => setDescription(val)}
                                            data={[
                                                { key: 'Vừa uống rượu, bia', value: 'Vừa uống rượu, bia' },
                                                { key: 'Có các bệnh mãn tính', value: 'Có các bệnh mãn tính' },
                                                { key: 'Đang mắc các bệnh cấp tính', value: 'Đang mắc các bệnh cấp tính' },
                                                { key: 'Đã nhiễm HIV, viêm gan B, C', value: 'Đã nhiễm HIV, viêm gan B, C' },
                                                { key: 'Có nguy cơ cao lây nhiễm HIV, viêm gan B, C', value: 'Có nguy cơ cao lây nhiễm HIV, viêm gan B, C' },
                                                { key: 'Nghiện ma túy', value: 'Nghiện ma túy' },
                                                { key: 'Có quan hệ tình dục không an toàn', value: 'Có quan hệ tình dục không an toàn' },
                                                { key: 'Nam giới có quan hệ tình dục với người cùng giới khác', value: 'Nam giới có quan hệ tình dục với người cùng giới khác' },
                                                { key: 'Người đang bị bệnh thiếu máu', value: 'Người đang bị bệnh thiếu máu' }
                                            ]}
                                            placeholder="Lý do không đạt tiêu chuẩn"
                                            boxStyles={{ width: '100%' }}
                                        />
                                    )}
                                </View>
                            )}

                            {activeStep === 1 && (
                                <View>
                                    <Text style={{ marginTop: 20, marginBottom: 20 }}>{steps[1].description}</Text>
                                    {bloodStatus === '0' ? (
                                        <Text>Không đủ tiêu chuẩn hiến máu</Text>
                                    ) : (
                                        // Thêm nội dung chi tiết cho bước 2 khi bloodStatus không bằng 0
                                        <Text>Nội dung bước 2</Text>
                                    )}
                                </View>
                            )}

                            {activeStep === 2 && (
                                <View>
                                    <Text style={{ marginTop: 20, marginBottom: 20 }}>{steps[2].description}</Text>
                                    {/* Thêm nội dung chi tiết cho bước 3 */}
                                </View>
                            )}

                            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'flex-end' }}>
                                <Button
                                    title="Quay lại"
                                    onPress={handleBack}
                                    disabled={activeStep === 0}
                                />
                                <Button
                                    title={activeStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
                                    onPress={handleNext}
                                    color="#3498db"
                                    style={{ marginLeft: 10 }}
                                />
                            </View>

                            {activeStep === steps.length - 1 && (
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ marginBottom: 20 }}>
                                        {bloodStatus === '0' ? 'Không đủ tiêu chuẩn hiến máu' : 'Quá trình hoàn thành'}
                                    </Text>
                                    <Button
                                        title="Đặt lại"
                                        onPress={handleReset}
                                        color="#3498db"
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>


            </SafeAreaView >
        </ScrollView >
    );
};
export default DetailEvent;
