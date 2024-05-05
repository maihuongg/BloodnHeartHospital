import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import baseUrl from '../utils/constant';
import { AntDesign } from '@expo/vector-icons';
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
    const handleGoBackHome = () => {
        navigation.navigate('Home', { screen: 'HomeScreen' });
    }
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
            </SafeAreaView >
        </ScrollView>
    );
};
export default DetailEvent;
