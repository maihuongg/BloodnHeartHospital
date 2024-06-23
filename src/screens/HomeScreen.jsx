import { View, Text, TextInput, Button, ScrollView, Modal, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import baseUrl from '../utils/constant';
import { AntDesign } from '@expo/vector-icons';
import moment from "moment";
import isEmpty from "validator/lib/isEmpty";
import { Alert } from 'react-native';
import {
  eventProfileStart,
  eventProfileSuccess,
  eventProfileFailed,
} from "../redux/eventSlice";
const HomeScreen = () => {


  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;
  const hospitalProfile = useSelector((state) => state.hospital.profile.gethospital);
  const hospitalId = hospitalProfile?._id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false)
  const [close, setModalClose] = useState(false)
  const [eventName, setEventName] = useState("");
  const [date_start, setDate_start] = useState(new Date());
  const [date_end, setDate_end] = useState(new Date());
  const [amount, setAmount] = useState(1);
  const [address, setAddress] = useState("");
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
    if (!modalVisible || close) {
      const handleEventByHospital = async () => {
        try {
          const response2 = await fetch(`${baseUrl}/v1/hospital/event/` + hospitalId, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: `Bearer ${accessToken}`
            }
          });
          if (response2.ok) {
            const data2 = await response2.json();
            console.log("data ok", data2)
            setData(data2.allEvent);
          }
          else return 0;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      handleEventByHospital();
    }
  }, [modalVisible, close]);

  const handleAddEvent = async () => {
    if (isEmpty(eventName) || isEmpty(address)) {
      Alert.alert("Vui lòng điền vào các mục (*)");
    } else {
      const datestart = date_start.toISOString().split('T')[0];
      const dateend = date_end.toISOString().split('T')[0];
      const newEvent = {
        hospital_id: hospitalId,
        eventName: eventName,
        date_start: datestart,
        date_end: dateend,
        amount: amount,
        address: address
      }
      try {
        console.log('lỗi aaaaa');
        const response = await fetch(`${baseUrl}/v1/hospital/event/add`, {
          method: 'POST',
          body: JSON.stringify(newEvent),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          Alert.alert('Thất bại', errorData.message);
          console.log('lỗi');
        } else {
          const data = await response.json();

          console.log('dataEvent', data);
          setModalVisible(false);
          navigation.navigate('Home');
          Alert.alert("Thêm sự kiện thành công!");
        }
      } catch (error) {
        console.log('lỗi1');
        Alert.alert("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
      }
    }

  }

  const handleCloseEvent = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/v1/hospital/close/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert(errorData.message);
      }
      else {
        const data = await response.json();
        console.log("data", data);
        navigation.navigate('Home');
        Alert.alert("Đóng sự kiện thành công!");
        setModalClose(true);
      }
    } catch (error) {
      Alert.alert("Lỗi", error);
    }
  }
  const handleNavigateToDetailEvent = async (eventId) => {
    dispatch(eventProfileStart());
    try {
      const response1 = await fetch(`${baseUrl}/v1/hospital/detail/` + eventId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response1.ok) {
        dispatch(eventProfileFailed());
      } else {
        const data1 = await response1.json();
        console.log('data event', data1);
        dispatch(eventProfileSuccess(data1));
        navigation.navigate('DetailEvent');
      }
    } catch (error) {
      dispatch(eventProfileFailed());
    }
  }

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
          <Text className="text-white font-bold text-[16px] mt-2 mx-4">Xin chào, {hospitalProfile.hospitalName} </Text>
          <Text className="text-white font-normal text-[14px]  mx-4 my-2 ">Chúc bạn ngày mới tràn đầy năng lượng ! </Text>
          {/* <View className="flex-row px-4 py-2 m-2 border-2 border-blue rounded-lg bg-gray">
            <FontAwesome name="search" size={24} color='#0891b2' />
            <TextInput
              // value={searchQuery}
              // onChangeText={(text) => setSearchQuery(text)}
              className="text-blue pl-1"
              placeholder=" Nhập tên sự kiện của bệnh viện" />
            <View className="pl-4 ml-auto">
              <TouchableOpacity>
                <MaterialIcons name="arrow-forward" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View> */}
          <View className="bg-white mb-2 mx-2 rounded-md h-32 items-center">
            <Image
              source={require('../../assets/hosImg.png')}
              style={{ width: '90%', height: '65%', flex: 1, resizeMode: 'cover', justifyContent: 'center' }}
            />
          </View>
        </View>

        <View className="flex-row bg-silver justify-center items-center p-2">

          <Text className="font-extrabold text-black text-[16px]">Quản lý sự kiện</Text>
          <View className="ml-auto mr-4">
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <MaterialIcons name="add" size={20} color="black" />
            </TouchableOpacity></View>
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
                  <Text className="text-xl font-bold text-blue mb-2">Thêm sự kiện mới</Text>
                  <Text className="text-black text-[16px] font-bold my-2"> Tên sự kiện </Text>
                  <TextInput
                    onChangeText={(text) => setEventName(text)}
                    placeholder="VD: Sự kiện A"
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
                          value={date_start}
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
                          value={date_end}
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
                    onChangeText={(text) => setAmount(parseInt(text, 10))}
                    placeholder="VD: 50"
                    className="border border-gray-300 rounded-md p-2" />
                  <Text className="text-black text-[16px] font-bold my-2"> Địa chỉ </Text>
                  <TextInput
                    onChangeText={(text) => setAddress(text)}
                    placeholder="VD: Ho Chi Minh"
                    className="border border-gray-300 rounded-md p-2" />
                  <View className="flex-row justify-center">
                    <TouchableOpacity onPress={handleAddEvent}>
                      <View className="justify-center bg-blue mx-auto my-4 p-3 rounded-md">
                        <Text className="text-white font-bold text-[16px]">Lưu thay đổi</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="ml-2" onPress={() => setModalVisible(false)}>
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
        <View className=" bg-silver">
          {/* Item từng event bắt đầu ở đây */}
          {data.map((event) => (
            <View className="shadow-sm border-b-2 bg-white rounded-md">
              <View className="flex-col ml-2 pl-2 pt-2">
                <Text className="text-black font-semibold text-[16px]" > Tên sự kiện: {event?.eventName} </Text>
              </View>
              <View className="flex-row">
                <View className="flex-col ml-2 pl-2">
                  <Text className=" text-metal font-semibold text-[16px]"> Ngày bắt đầu : {moment(event?.date_start).format('DD/MM/YYYY')}</Text>
                  <Text className=" text-red font-semibold text-[16px]"> Ngày kết thúc : {moment(event?.date_end).format('DD/MM/YYYY')}</Text>
                  <Text className=" font-semibold text-[16px]">
                    {event?.status === "0"
                      ? " Tình trạng: Đã đóng"
                      : moment(event?.date_start).toDate() > moment().toDate()
                        ? " Tình trạng: Sắp diễn ra"
                        : " Tình trạng: Đang diễn ra"
                    }
                  </Text>
                </View>
                <View className="flex-col pl-2 pt-1 pr-6 ml-auto">
                  <View className="flex-row">
                    <TouchableOpacity className="bg-[#fcf00a] p-1 items-center justify-center " onPress={() => handleNavigateToDetailEvent(event?._id)}>
                      <AntDesign name="eye" size={26} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-red p-1 ml-4 items-center justify-center" onPress={() => handleCloseEvent(event?._id)}>
                      <AntDesign name="closecircle" size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView >
  );
};
export default HomeScreen;
