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
const HomeScreen = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  return (
    <SafeAreaView className=" flex-1 bg-white pt-6">
      <View className="bg-white flex-row p-1 items-center ml-4">
        <Image
          source={require('../../assets/logo1.png')}
          className="h-12 w-12 items-center"
        />
        <Text className="text-blue font-bold text-xl pl-2">BloodnHeart</Text>
        <View className="ml-auto">
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View className="flex  bg-blue my-2">
          <Text className="text-white font-bold text-[16px] mt-2 mx-4">Xin chào, Bệnh viện Quốc tế </Text>
          <Text className="text-white font-normal text-[14px]  mx-4">Chúc bạn ngày mới tràn đầy năng lượng ! </Text>
          <View className="flex-row px-4 py-2 m-2 border-2 border-blue rounded-lg bg-gray">
            <FontAwesome name="search" size={24} color='#0891b2' />
            <TextInput
              // value={searchQuery}
              // onChangeText={(text) => setSearchQuery(text)}
              className="text-blue pl-1"
              placeholder=" Nhập tên sự kiện của bệnh viện" />
            <View className="pl-4 ml-auto">
              <TouchableOpacity onPress={() => fetchDataSearcg(searchQuery)}>
                <MaterialIcons name="arrow-forward" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="bg-white mb-2 mx-2 rounded-md h-32 items-center">
            <Image
              source={require('../../assets/hosImg.png')}
              style={{ width: '90%', height: '65%', flex: 1, resizeMode: 'cover', justifyContent: 'center' }}
            />
          </View>
        </View>

        <View className="flex-row bg-silver justify-center items-center p-2">
          <Text className="font-extrabold text-black text-[16px]">Quản lý sự kiện</Text>
        </View>

        <View className=" bg-silver">
          {/* Item từng event bắt đầu ở đây */}
          <View className="flex-row shadow-sm border-b-2 bg-white rounded-md items-center">
            <View className="flex-col m-2 p-2 ">
              <Text className="text-black font-semibold text-[16px]"> Tên sự kiện </Text>
              <Text className=" text-metal font-semibold text-[16px]"> Ngày bắt đầu : 10/02/2024</Text>
              <Text className=" text-red font-semibold text-[16px]"> Ngày kết thúc : 17/02/2024</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity className="bg-[#fcf00a] p-1 items-center justify-center ">
                <AntDesign name="eye" size={26} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-red p-1 ml-4 items-center justify-center">
                <AntDesign name="closecircle" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row shadow-sm border-b-2 bg-white rounded-md items-center">
            <View className="flex-col m-2 p-2 ">
              <Text className="text-black font-semibold text-[16px]"> Tên sự kiện </Text>
              <Text className=" text-metal font-semibold text-[16px]"> Ngày bắt đầu : 10/02/2024</Text>
              <Text className=" text-red font-semibold text-[16px]"> Ngày kết thúc : 17/02/2024</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity className="bg-[#fcf00a] p-1 items-center justify-center ">
                <AntDesign name="eye" size={26} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-red p-1 ml-4 items-center justify-center">
                <AntDesign name="closecircle" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row shadow-sm border-b-2 bg-white rounded-md items-center">
            <View className="flex-col m-2 p-2 ">
              <Text className="text-black font-semibold text-[16px]"> Tên sự kiện </Text>
              <Text className=" text-metal font-semibold text-[16px]"> Ngày bắt đầu : 10/02/2024</Text>
              <Text className=" text-red font-semibold text-[16px]"> Ngày kết thúc : 17/02/2024</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity className="bg-[#fcf00a] p-1 items-center justify-center ">
                <AntDesign name="eye" size={26} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-red p-1 ml-4 items-center justify-center">
                <AntDesign name="closecircle" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row shadow-sm border-b-2 bg-white rounded-md items-center">
            <View className="flex-col m-2 p-2 ">
              <Text className="text-black font-semibold text-[16px]"> Tên sự kiện </Text>
              <Text className=" text-metal font-semibold text-[16px]"> Ngày bắt đầu : 10/02/2024</Text>
              <Text className=" text-red font-semibold text-[16px]"> Ngày kết thúc : 17/02/2024</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity className="bg-[#fcf00a] p-1 items-center justify-center ">
                <AntDesign name="eye" size={26} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-red p-1 ml-4 items-center justify-center">
                <AntDesign name="closecircle" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row shadow-sm border-b-2 bg-white rounded-md items-center">
            <View className="flex-col m-2 p-2 ">
              <Text className="text-black font-semibold text-[16px]"> Tên sự kiện </Text>
              <Text className=" text-metal font-semibold text-[16px]"> Ngày bắt đầu : 10/02/2024</Text>
              <Text className=" text-red font-semibold text-[16px]"> Ngày kết thúc : 17/02/2024</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity className="bg-[#fcf00a] p-1 items-center justify-center ">
                <AntDesign name="eye" size={26} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-red p-1 ml-4 items-center justify-center">
                <AntDesign name="closecircle" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
};
export default HomeScreen;
