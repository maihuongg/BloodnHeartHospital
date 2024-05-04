import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { Alert } from 'react-native';
import { Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import baseUrl from '../utils/constant';
const InformationScreen = () => {
    // const user = useSelector((state) => state.auth.login.currentUser);
    // const userId = user?._id;
    // const accessToken = user?.accessToken;
    const userPro = useSelector((state) => state.user.profile.getUser);
    const [activeItem, setActiveItem] = useState('user');
    const handleItemClick = (item) => {
        setActiveItem(item);
        console.log('bạn đã nhấn:', item);
    };
    const navigation = useNavigation();

    const handleProfie = () => {
        navigation.navigate('Profile');
    }
    const handleLichHen = () => {
        navigation.navigate('LichHen');
    }
    const handleLichSu = () => {
        navigation.navigate('LichSu');
    }

    const handleReward = () => {
        navigation.navigate('Reward');
    }
    const handleThongKe = () => {
        navigation.navigate('ThongKe');
    }

    return (
        <View className="flex-1">
            <View className="flex-row h-32 bg-bubble-gum">
                <Text>

                </Text>
            </View>
            <View className="flex-row bg-white items-center rounded-xl mx-4 py-2 -mt-10 shadow-md">
                <Image
                    className="w-24 h-24 rounded-full ml-4"
                    source={{ uri: userPro?.images }} ></Image>
                <View className="flex-column justify-center items-center mx-2 ">
                    <Text className="text-black font-bold text-[18px]"> {userPro?.fullName}</Text>
                    <Text className="text-black text-[16px]"> {userPro?.address}</Text>
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
            <TouchableOpacity onPress={handleLichHen}>
                <View className="bg-white mx-4 rounded-xl p-4 border-b-[1px] border-gray-200">
                    <View className="flex-row items-center">
                        <MaterialIcons name="date-range" size={24} color="black" />
                        <Text className="text-black font-semibold text-[18px] ml-4">Lịch hẹn của bạn</Text>
                        <View className="ml-auto">
                            <TouchableOpacity onPress={handleLichHen}>
                                <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLichSu}>
                <View className="bg-white mx-4 rounded-xl p-4 border-b-[1px] border-semigray-100">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="history" size={24} color="black" />
                        <Text className="text-black font-semibold text-[18px] ml-4">Lịch sử hiến máu</Text>
                        <View className="ml-auto">
                            <TouchableOpacity onPress={handleLichSu}>
                                <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
            <View className="bg-white mx-4 rounded-xl p-4 border-b-[1px] border-semigray-100">
                <View className="flex-row items-center">
                    <MaterialIcons name="password" size={24} color="black" />
                    <Text className="text-black font-semibold text-[18px] ml-4">Đổi mật khẩu</Text>
                    <View className="ml-auto">
                        <TouchableOpacity>
                            <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReward}>
            <View className="bg-white mx-4 rounded-xl p-4 border-b-[1px] border-semigray-100">
                <View className="flex-row items-center">
                    <MaterialCommunityIcons name="medal" size={24} color="black" />
                    <Text className="text-black font-semibold text-[18px] ml-4">Điểm thưởng</Text>
                    <View className="ml-auto">
                        <TouchableOpacity onPress={handleReward}>
                            <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleThongKe}>
            <View className="bg-white mx-4 rounded-xl p-4 border-b-[1px] border-semigray-100">
                <View className="flex-row items-center">
                <Ionicons name="analytics" size={24} color="black" />
                    <Text className="text-black font-semibold text-[18px] ml-4">Xem thống kê</Text>
                    <View className="ml-auto">
                        <TouchableOpacity>
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