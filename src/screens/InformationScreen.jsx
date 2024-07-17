import { View, Text, TextInput, ScrollView, Modal, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { Alert } from 'react-native';
import { Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import baseUrl from '../utils/constant';
const InformationScreen = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const userId = user?._id;
    const accessToken = user?.accessToken;
    const hospitalProfile = useSelector((state) => state.hospital.profile.gethospital);
    const [password, setPassword] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [renewpassword, setReNewPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false)
    const [activeItem, setActiveItem] = useState('user');
    const handleItemClick = (item) => {
        setActiveItem(item);
        console.log('bạn đã nhấn:', item);
    };
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleProfie = () => {
        navigation.navigate('Profile');
    }
    // const handleThongKe = () => {
    //     navigation.navigate('ThongKe');
    // }

    const handleUpdatePassword = async () => {
        const updatePassword = {
            password: password,
            newpassword: newpassword,
            account_id: hospitalProfile.account_id,
        };
        if (newpassword === renewpassword) {
            try {
                const response = await fetch(`${baseUrl}/v1/hospital/updatePassword`, {
                    method: 'PUT',
                    body: JSON.stringify(updatePassword),
                    headers: {
                        'Content-Type': 'application/json',
                        token: `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    const err = await response.json();
                    Alert.alert("Thất bại!", err.message);
                } else {
                    Alert.alert("Đổi mật khẩu thành công!");
                    setModalVisible(false);
                }
            } catch (error) {
                Alert.alert("Đổi mật khẩu thất bại!");
            }
        } else {
            Alert.alert("Nhập lại mật khẩu mới không trùng khớp!");
        }

    }

    const handleLogout = async () => {
        try {
            const res = await fetch(`${baseUrl}/v1/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: `Bearer ${accessToken}`
                }
            });
            if (!res.ok) {
                Alert.alert("Đăng xuất thất bại!");
            } else {
                Alert.alert("Đăng xuất thành công!");
                navigation.navigate('LoginScreen');
            }
        } catch (error) {
            Alert.alert("Đăng xuất thất bại!");
        }
    }

    return (
        <View className="flex-1">
            <View className="flex-row h-32 bg-bubble-gum">
                <Text>

                </Text>
            </View>
            <View className="flex-row bg-white items-center rounded-xl mx-4 py-2 -mt-10 shadow-md">
                <Image
                    className="w-24 h-24 rounded-full ml-2"
                    source={{ uri: hospitalProfile?.images }} ></Image>
                <View className="flex-column">
                    <Text className="text-black font-bold text-[17px]" >
                        {hospitalProfile?.hospitalName}
                    </Text>
                    <Text className="text-black text-[16px] w-[45%]"> {hospitalProfile?.address}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={handleProfie}>
                <View className="bg-white mx-4 mt-10 rounded-xl p-4 border-b-[1px] border-gray-200">
                    <View className="flex-row items-center">
                        <FontAwesome name="user-circle" size={24} color="black" />
                        <Text className="text-black font-semibold text-[18px] ml-4">Thông tin cá nhân</Text>
                        <View className="ml-auto">
                            <TouchableOpacity onPress={handleProfie}>
                                <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View className="bg-white mx-4 rounded-xl p-4 border-b-[1px] border-semigray-100">
                    <View className="flex-row items-center">
                        <MaterialIcons name="password" size={24} color="black" />
                        <Text className="text-black font-semibold text-[18px] ml-4">Đổi mật khẩu</Text>
                        <View className="ml-auto">
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
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
                            <ScrollView>
                                <View className=" mx-2 bg-white p-4 rounded-md ">
                                    {/* Đặt các trường để người dùng có thể chỉnh sửa thông tin */}
                                    <Text className="text-xl font-bold text-blue mb-2">Đổi mật khẩu</Text>
                                    <Text className="text-black text-[16px] font-bold my-2"> Mật khẩu cũ </Text>
                                    <TextInput
                                        value={password}
                                        onChangeText={(text) => setPassword(text)}
                                        className="border border-gray-300 rounded-md p-2"
                                        secureTextEntry />
                                    <Text className="text-black text-[16px] font-bold my-2"> Mật khẩu mới </Text>
                                    <TextInput
                                        value={newpassword}
                                        onChangeText={(text) => setNewPassword(text)}
                                        className="border border-gray-300 rounded-md p-2"
                                        secureTextEntry />
                                    <Text className="text-black text-[16px] font-bold my-2"> Nhập lại mật khẩu mới </Text>
                                    <TextInput
                                        value={renewpassword}
                                        onChangeText={(text) => setReNewPassword(text)}
                                        className="border border-gray-300 rounded-md p-2"
                                        secureTextEntry />
                                    <TouchableOpacity onPress={handleUpdatePassword} >
                                        <View className="justify-center bg-blue mx-auto my-4 p-3 rounded-md">

                                            <Text className="text-white font-bold text-[16px]">Lưu thay đổi</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>

                    </View>

                </Modal>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
                <View className="bg-white mx-4 rounded-xl p-4 border-b-[1px] border-semigray-100">
                    <View className="flex-row items-center">
                        <Ionicons name="analytics" size={24} color="black" />
                        <Text className="text-black font-semibold text-[18px] ml-4">Đăng xuất</Text>
                        <View className="ml-auto">
                            <TouchableOpacity onPress={handleLogout}>
                                <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        </View>

    );
}
export default InformationScreen;