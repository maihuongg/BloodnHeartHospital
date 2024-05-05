import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, Modal, TextInput, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
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

import {
    eventProfileStart,
    eventProfileSuccess,
    eventProfileFailed,
    hospitalStart,
    hospitalSuccess,
    hospitalFailed
} from "../redux/eventSlice";
const DetailEvent = () => {
    const navigation = useNavigation();

    const user = useSelector((state) => state.auth.login.currentUser);
    const userId = user?._id;
    const accessToken = user?.accessToken;
    const handleNavigateToDetailEvent = () => {
        navigation.navigate('DetailEvent');

    }
    const [modalVisible, setModalVisible] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null); // Khai báo và gán giá trị cho biến selected
    const [status, setStatus] = useState("Chưa hiến");

    const handleOpenModal = () => {
        console.log("Opening modal...");
        setModalVisible(true);
    };
    const handleCloseModal = () => {
        console.log("Opening modal...");
        setModalVisible(false);
    };
    const handleGoBackHome = () => {
        navigation.navigate('Home', { screen: 'HomeScreen' });
    }
    const handleUpdateStatus = () => {
    }
    const data = [
        { name: "John Doe", status: "Đã hiến" },
        { name: "Jane Jane Doe Doe", status: "Chưa hiến" },
        { name: "Alice Smith", status: "Hủy" },
        // Thêm các dòng dữ liệu khác ở đây
    ];
    const statusHienMau = [
        { key: 'Đã hiến', value: 'Đã hiến' },
        { key: 'Chưa hiến', value: 'Chưa hiến' },
        { key: 'Đã hủy', value: 'Đã hủy' },
      
        // Thêm các nhóm máu khác nếu cần
    ];

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
                    <Text className="text-black font-bold text-[18px] mx-4 mt-2 text-justify">TÊN SỰ KIỆN</Text>
                    <View className="flex-row border-t-[1px] border-semigray-10 mt-2">
                        <Text className="text-black font-bold text-[16px] my-2 mx-4">Địa chỉ:
                            <Text className="text-black font-normal text-[16px] my-2 leading-6"> TPHCM</Text></Text>

                    </View>
                    <View className="flex-row  bg-[#d7faf5] mx-4 my-2 justify-center ">
                        <Text className="text-black font-bold text-[16px] my-4 mx-2">Ngày bắt đầu: </Text>
                        {/* <Text className="text-black font-normal text-[16px] my-4">{moment(eventDetail?.date_start).format('DD/MM/YYYY')}</Text> */}
                        <Text className="text-black font-normal text-[16px] my-4">1/1/1121</Text>
                    </View>
                    <View className="flex-row  bg-[#f7e1d7] mx-4 my-2 justify-center">
                        <Text className="text-black font-bold text-[16px] my-4 mx-2">Ngày kết thúc: </Text>
                        <Text className="text-black font-normal text-[16px] my-4">1/1/1111</Text>
                    </View>
                    <View className="flex-row  bg-[#e7eaed] mx-4 my-2 justify-center">
                        <Text className="text-black font-bold text-[16px] my-4 mx-2">Số lượng đã đăng ký: </Text>
                        {/* <Text className="text-black font-normal text-[16px] my-4">{eventDetail?.listusers.count}/<Text className="text-black font-bold text-[16px]">{eventDetail?.amount}</Text></Text> */}
                        <Text className="text-black font-normal text-[16px] my-4">3/<Text className="text-black font-bold text-[16px]">100</Text></Text>
                    </View>

                    <TouchableOpacity >
                        <View className="bg-blue mx-auto items-center justify-center rounded-md my-2">
                            <Text className="text-white font-bold p-3 mx-3 text-[16px]">CHỈNH SỬA</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View className="flex-row bg-metal items-center justify-center my-2 p-2">
                    <Text className="text-white font-bold text-[16px]">DANH SÁCH ĐĂNG KÝ SỰ KIỆN</Text>
                </View>
                <View className="bg-white p-2 rounded-lg shadow-md">
                    {/* Header */}
                    <View className="flex-row border-b border-gray-200">
                        <Text className="w-1/6 text-center font-bold text-[14px]">STT</Text>
                        <Text className="w-1/3 text-center font-bold text-[14px]">Họ tên</Text>
                        <Text className="w-1/4 text-center font-bold text-[14px]">Tình trạng</Text>
                        <Text className="w-1/4 text-center font-bold text-[14px]">Thao tác</Text>
                    </View>

                    {/* Data Rows */}
                    {data.map((item, index) => (
                        <View key={index} className="flex-row border-b border-gray-200">
                            <Text className="w-1/6 text-center text-[14px]">{index + 1}</Text>
                            <Text className="w-1/3 text-center text-[14px]">{item.name}</Text>
                            <Text className="w-1/4 text-center text-[14px]">{item.status}</Text>
                            <TouchableOpacity
                                onPress={handleOpenModal}
                                className="w-1/4 flex items-center justify-center text-[14px]">
                                <AntDesign name="edit" size={24} color="black" />
                            </TouchableOpacity>
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
                    <View className="flex-1 bg-rnb justify-center items-center">
                        <View className="h-[85%] w-[95%]">
                            {/* Phần nội dung của modal */}

                            <View className=" mx-2 bg-white p-2 rounded-md ">
                                {/* Đặt các trường để người dùng có thể chỉnh sửa thông tin */}
                                <View className="bg-blue justify-center items-center">
                                    <Text className="text-xl font-bold text-white mb-2"> Cập nhật trạng thái hiến máu</Text>
                                </View>
                                <Text className="text-black text-[16px] font-bold my-2"> Trạng thái </Text>

                                <SelectList
                                             setSelected={(val) => setStatus()}
                                            data={statusHienMau}
                                            save="value"
                                        />
                                <View className="flex-row mx-8 justify-center items-center">
                                    <TouchableOpacity onPress={handleCloseModal}>
                                        <View className="justify-center bg-red mt-2 px-6 py-2 rounded-md ">
                                            <Text className="text-white font-bold text-[16px]">Hủy</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleUpdateStatus}>
                                        <View className="justify-center bg-blue ml-12 mt-2 px-6 py-2 rounded-md">
                                            <Text className="text-white font-bold text-[16px]">Cập nhật</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>
                    </View>

                </Modal>
            </SafeAreaView >
        </ScrollView>
    );
};
export default DetailEvent;
