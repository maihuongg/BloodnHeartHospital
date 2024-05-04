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
  const fiveEvent = useSelector((state) => state.user.allevent.getEvent);
  const [activeItem, setActiveItem] = useState('home');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [dataBestEvent, setDataBestEvent] = useState([]);
  const [count, setCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventSearch, setEventSearch] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const currentIndex = Math.floor(contentOffsetX / viewSize);
    setScrollIndex(currentIndex);
  };

  console.log("hgjh", dataBestEvent);

  const data = [
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6yGQtvQodKeGyIEFWy0KESTweLmHbnqXRvw&s',
      title: 'Được tư vấn về sức khoẻ',
      description: [
        '- Được giải thích về quy trình hiến máu và các tai biến có thể xảy ra trong và sau khi hiến máu.',
        '- Được cung cấp thông tin về dấu hiệu, triệu chứng do nhiễm vi rút viêm gan, HIV và một số bệnh lây qua đường truyền máu, tình dục khác.',
        '- Được xét nghiệm sàng lọc một số vi rút lây qua đường truyền máu, tình dục sau khi hiến máu.',
        '- Được tư vấn hướng dẫn cách chăm sóc sức khỏe, tư vấn về kết quả bất thường sau hiến máu.'
      ]
    },
    {
      image: 'https://karaoke.com.vn/wp-content/uploads/2020/02/Hi%E1%BA%BFn-m%C3%A1u.jpg',
      title: 'Được cấp Giấy chứng nhận hiến máu tình nguyện',
      description: [
        '1. Giấy chứng nhận được trao cho người hiến máu sau mỗi lần hiến máu tình nguyện.',
        '2. Người hiến máu cần xuất trình Giấy chứng nhận để làm cơ sở cho các cơ sở y tế thực hiện việc truyền máu miễn phí.',
      ]
    },


  ];

  const renderItem = ({ item }) => {
    return (
      <View className="flex-auto items-center justify-center" >
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: 450, borderRadius: 10 }}
        />
        <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', width: '100%', padding: 10 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{item.title}</Text>
          <FlatList
            data={item.description}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={{ color: 'white', fontSize: 16 }}>{item}</Text>}
            contentContainerStyle={{ paddingHorizontal: 5 }} // Căn lề hai bên cho mỗi mục trong FlatList

          />
        </View>
      </View>
    );
  };
  useEffect(() => {
    const handleBestEvent = async () => {
      try {
        const response2 = await fetch(`${baseUrl}/v1/user/bestevent`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response2.ok) {
          console.log("Get Best Event Fail.")
        }
        else {
          const bestEvent = await response2.json();
          console.log("c", bestEvent.listusers.count);
          setCount(bestEvent.listusers.count);
          setDataBestEvent(bestEvent);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    handleBestEvent();
  }, [setCount, setDataBestEvent]);

  const handleToDetailEvent = async (eventId, hospitalId) => {
    if (user) {
      dispatch(eventProfileStart());
      try {
        const response1 = await fetch(`${baseUrl}/v1/user/getevent/` + eventId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${accessToken}`
          }
        });
        if (!response1.ok) {
          dispatch(eventProfileFailed());
        } else {
          const data1 = await response1.json();
          dispatch(eventProfileSuccess(data1));
        }
      } catch (error) {
        dispatch(eventProfileFailed());
      }

      dispatch(hospitalStart());
      try {
        const response2 = await fetch(`${baseUrl}/v1/user/gethospital/` + hospitalId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${accessToken}`
          }
        });
        if (!response2.ok) {
          dispatch(hospitalFailed());
        } else {
          const data2 = await response2.json();
          dispatch(hospitalSuccess(data2));
        }
      } catch (error) {
        dispatch(hospitalFailed());
      }

      navigation.navigate('DetailScreen');
    } else {
      Alert.alert('Thông báo', 'Cần đăng nhập để xem chi tiết.');
      navigation.navigate('LoginScreen');
    }
  };

  const fetchDataSearcg = async (keyword) => {
    try {
      const response2 = await fetch(`${baseUrl}/v1/user/search/event?keyword=${keyword}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response2.ok) {
        const data2 = await response2.json();
        setEventSearch(data2);
      }
      else return 0;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEvent = () => {
    navigation.navigate('Sukien');
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

      <View className="flex-row p-2 mx-4 mt-2 border-2 border-blue rounded-lg bg-gray">
        <FontAwesome name="search" size={24} color='#0891b2' />
        <TextInput
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          className="text-blue pl-1"
          placeholder=" Nhập tên sự kiện / bệnh viện" />
        <View className="ml-auto">
          <TouchableOpacity onPress={() => fetchDataSearcg(searchQuery)}>
            <MaterialIcons name="arrow-forward" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* slider */}
      {/* <View className="flex-row "> */}
      {eventSearch === null ? (
        <ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false} >
            <View className="flex-row m-2 shadow-sm ">
              <View className="w-80 h-32 mx-2">
                <Image
                  source={require('../../assets/1.png')}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
              <View className="w-80 h-32 mx-2 ">
                <Image
                  source={require('../../assets/2.png')}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
              <View className="w-80 h-32 mx-2">
                <Image
                  source={require('../../assets/3.png')}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
            </View>

          </ScrollView>
          {/* THÔNG TIN CHUNG */}

          <View className="flex-auto justify-center items-center">
            <Text className="text-blue font-bold text-[16px] my-4">Quyền lợi của người hiến máu</Text>

            <Carousel
              data={data}
              renderItem={renderItem}
              sliderWidth={400} // Chiều rộng của Carousel
              itemWidth={350}
              layout={'default'}
              loop={true}
              autoplay={true}
              autoplayInterval={3000}
            />
          </View>

          {/* TIEU CHUẨN HIẾN MÁU */}
          <View className="flex-row bg-[#FFC621] items-center rounded-md mx-2 my-2 py-2  shadow-sm justify-center">
            <View className="flex-column justify-center items-center mx-2 ">
              <Text className="text-black font-bold text-[18px]"> TIÊU CHUẨN</Text>
              <Text className="text-black  font-bold text-[16px]"> THAM GIA HIẾN MÁU</Text>
            </View>

          </View>
          <View className="bg-white mx-2 ">
            <View className="flex-row mx-4 my-2">
              <FontAwesome name="id-card" size={24} color="black" />
              <Text className="font-normal text-black mx-2 text-justify" > Mang theo CCCD / CMND / hộ chiếu</Text>
            </View>
            <View className="flex-row mx-4 my-2">
              <MaterialCommunityIcons name="needle" size={24} color="black" />
              <Text className="font-normal text-black mx-2 text-justify" > Không nghiện ma túy, rượu bia và các chất kích thích</Text>
            </View>
            <View className="flex-row mx-4 my-2">
              <FontAwesome5 name="virus" size={24} color="black" />
              <Text className="font-normal text-black mx-2 text-justify" > Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV, không nhiễm viêm gan B, viêm gan C, và các virus lây qua đường truyền máu</Text>
            </View>
            <View className="flex-row mx-4 my-2">
              <FontAwesome name="heartbeat" size={24} color="black" />
              <Text className="font-normal text-black mx-2 text-justify" > Không mắc các bệnh mãn tính hoặc cấp tính về tim mạch, huyết áp, hô hấp, dạ dày…</Text>
            </View>
            <View className="flex-row mx-4 my-2">
              <MaterialIcons name="18-up-rating" size={24} color="black" />
              <Text className="font-normal text-black mx-2 text-justify" > Người khỏe mạnh trong độ tuổi từ đủ 18 đến 60 tuổi</Text>
            </View>
            <View className="flex-row mx-4 my-2">
              <FontAwesome5 name="weight" size={24} color="black" />
              <Text className="font-normal text-black mx-2 text-justify" > Cân nặng: Nam ≥ 45 kg & Nữ ≥ 45 kg</Text>
            </View>
            <View className="flex-row mx-4 my-2">
              <MaterialIcons name="date-range" size={24} color="black" />
              <Text className="font-normal text-black mx-2 text-justify" > Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ</Text>
            </View>
          </View>

          {/* </View> */}
          {/* info */}
          <View className="flex-auto bg-silver">
            <Text className="text-xl font-bold text-blue px-4 my-2">Sự kiện nổi bật</Text>
            {/* SỰ kiện */}
            <View className="bg-white">
              <TouchableOpacity className="bg-white rounded-lg px-4 mx-4 my-2 shadow-md">
                <Image source={require('../../assets/1.png')} className="w-full h-32 rounded-md mb-2" />
                <View className="mb-2">
                  <Text className="text-lg font-bold" >{dataBestEvent.eventName}</Text>
                  <View className="flex-row">
                    <Text>Địa chỉ : </Text>
                    <Text className="font-bold">{dataBestEvent.address}</Text>
                  </View>
                  <View className="flex-row">
                    <Text>Số lượng đăng ký : {count}/</Text>
                    <Text className="font-bold">{dataBestEvent.amount}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleToDetailEvent(dataBestEvent._id, dataBestEvent.hospital_id)}
                    className="items-center bg-blue p-2 mx-8 my-2 rounded-md" >
                    <View className="flex-row">
                      <Text className="text-white font-bold">Xem chi tiết</Text>
                    </View>
                  </TouchableOpacity>
                </View>

              </TouchableOpacity>
            </View>
          </View>
          {/* 5 Sự kiện nổi bật */}
          <View className="flex-auto bg-silver">
            <Text className="text-xl font-bold text-blue px-4 my-2">Top 5 Sự kiện</Text></View>
          <View className="flex-auto bg-white justify-center items-center relative">

            <Carousel
              data={fiveEvent}
              renderItem={({ item, index }) => (
                <View key={index} style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={{ width: 320, height: 350 }}
                    className="bg-white rounded-lg my-2  shadow-md">
                    <Image source={require('../../assets/1.png')} className="w-full h-32 rounded-md mb-2" />
                    <View className="m-2">
                      <Text className="text-lg font-bold">{item.eventName}</Text>
                      <View className="flex-row">
                        <Text>Địa chỉ :
                          <Text className="font-bold"> {item.address}</Text></Text>
                      </View>
                      <View className="flex-row">
                        <Text>Số lượng đăng ký : {item.listusers.count}/</Text>
                        <Text className="font-bold">{item.amount}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleToDetailEvent(item._id, item.hospital_id)}
                      className="bg-blue p-2 mx-12 my-2 rounded-md absolute inset-x-0 bottom-0">
                      <View className="flex-row justify-center">
                        <Text className="text-white font-bold">Xem chi tiết</Text>
                      </View>
                    </TouchableOpacity>

                  </TouchableOpacity>
                </View>
              )}
              sliderWidth={400}
              itemWidth={320}
              layout={'default'}
              loop={false}
              autoplay={false}
              autoplayInterval={3000}
            />
          </View>
          {/* BENH VIEN HOP TAC */}
          <View className="flex-auto bg-silver">
            <Text className="text-xl font-bold text-blue px-4 my-2">Một số bệnh viện hợp tác</Text>
            {/* BV HỢP TÁC */}
            <View className="bg-white">
              <View className="bg-white mx-4 rounded-lg shadow-md my-3">
                <TouchableOpacity className="bg-gray mx-auto rounded-full w-52 h-52 mt-2 justify-center items-center ">
                  <Image
                    source={require('../../assets/2.png')}
                    className="rounded-full w-48 h-48">
                  </Image>
                </TouchableOpacity>
                <View className="bg-gray justify-center mx-4 items-center -mt-10 -z-10 rounded-lg mb-3">
                  <Text className="mt-8 py-1 text-black font-bold text-lg">Bệnh viện Thủ Đức</Text>
                  <View className="flex-row mx-4">
                    <Text className="font-bold">Địa chỉ :
                      <Text className="text-black font-normal"> 64 Lê Văn Chí, Phường Linh Trung, Thủ Đức, TP. Hồ Chí Minh</Text></Text>
                  </View>
                  <View className="flex-row mx-auto mb-2 ">
                    <Text className="font-bold">Hotline:</Text>
                    <Text className="text-black font-normal">19001175</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="bg-white">
              <View className="bg-white mx-4 rounded-lg shadow-md my-3">
                <TouchableOpacity className="bg-gray mx-auto rounded-full w-52 h-52 mt-2 justify-center items-center ">
                  <Image
                    source={require('../../assets/2.png')}
                    className="rounded-full w-48 h-48">
                  </Image>
                </TouchableOpacity>
                <View className="bg-gray justify-center mx-4 items-center -mt-10 -z-10 rounded-lg mb-3">
                  <Text className="mt-8 py-1 text-black font-bold text-lg">Bệnh viện Quân Y</Text>
                  <View className="flex-row mx-4">
                    <Text className="font-bold">Địa chỉ :
                      <Text className="text-black font-normal"> 786 Nguyễn Kiệm, P.3, Q.Gò Vấp, TP. Hồ Chí Minh</Text></Text>
                  </View>
                  <View className="flex-row mx-auto mb-2 ">
                    <Text className="font-bold">Hotline:</Text>
                    <Text className="text-black font-normal">19001175</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView >
      ) : (
        <ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false} >
            <View className="flex-row m-2 shadow-sm ">
              <View className="w-80 h-32 mx-2 ">
                <Image
                  source={require('../../assets/2.png')}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
              <View className="w-80 h-32 mx-2">
                <Image
                  source={require('../../assets/1.png')}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
              <View className="w-80 h-32 mx-2">
                <Image
                  source={require('../../assets/3.png')}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
            </View>

          </ScrollView>
          {/* </View> */}
          <View className="flex-auto bg-silver">
            <Text className="text-xl font-bold text-blue px-4 my-2">Kết quả tìm kiếm</Text>
            {/* SỰ kiện */}
            {eventSearch.map((result) => (
              <View className="bg-white">
                <TouchableOpacity className="bg-white rounded-lg px-4 mx-4 my-2 shadow-md">
                  <Image source={require('../../assets/1.png')} className="w-full h-32 rounded-md mb-2" />
                  <View className="mb-2">
                    <Text className="text-lg font-bold" >{result.eventName}</Text>
                    <View className="flex-row">
                      <Text>Địa chỉ : </Text>
                      <Text className="font-bold">{result.address}</Text>
                    </View>
                    <View className="flex-row">
                      <Text>Số lượng đăng ký : {result.listusers.count}/</Text>
                      <Text className="font-bold">{result.amount}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleToDetailEvent(result._id, result.hospital_id)}
                      className="items-center bg-blue p-2 mx-8 my-2 rounded-md" >
                      <View className="flex-row">
                        <Text className="text-white font-bold">Xem chi tiết</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                </TouchableOpacity>
              </View>
            ))}
          </View>
          {/* info */}
          <View className="flex-auto bg-silver">
            <Text className="text-xl font-bold text-blue px-4 my-2">Sự kiện nổi bật</Text>
            {/* SỰ kiện */}

            <View className="bg-white">
              <TouchableOpacity className="bg-white rounded-lg px-4 mx-4 my-2 shadow-md">
                <Image source={require('../../assets/1.png')} className="w-full h-32 rounded-md mb-2" />
                <View className="mb-2">
                  <Text className="text-lg font-bold" >{dataBestEvent.eventName}</Text>
                  <View className="flex-row">
                    <Text>Địa chỉ : </Text>
                    <Text className="font-bold">{dataBestEvent.address}</Text>
                  </View>
                  <View className="flex-row">
                    <Text>Số lượng đăng ký : {count}/</Text>
                    <Text className="font-bold">{dataBestEvent.amount}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleToDetailEvent(dataBestEvent._id, dataBestEvent.hospital_id)}
                    className="items-center bg-blue p-2 mx-8 my-2 rounded-md" >
                    <View className="flex-row">
                      <Text className="text-white font-bold">Xem chi tiết</Text>
                    </View>
                  </TouchableOpacity>
                </View>

              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-auto bg-silver">
            <Text className="text-xl font-bold text-blue px-4 my-2">Một số bệnh viện hợp tác</Text>
            {/* BV HỢP TÁC */}
            <View className="bg-white">
              <View className="bg-white mx-4 rounded-lg shadow-md my-3">
                <TouchableOpacity className="bg-gray mx-auto rounded-full w-52 h-52 mt-2 justify-center items-center ">
                  <Image
                    source={require('../../assets/2.png')}
                    className="rounded-full w-48 h-48">
                  </Image>
                </TouchableOpacity>
                <View className="bg-gray justify-center mx-4 items-center -mt-10 -z-10 rounded-lg mb-3">
                  <Text className="mt-8 py-1 text-black font-bold text-lg">Bệnh viện Thủ Đức</Text>
                  <View className="flex-row mx-4">
                    <Text className="font-bold">Địa chỉ :
                      <Text className="text-black font-normal"> 64 Lê Văn Chí, Phường Linh Trung, Thủ Đức, TP. Hồ Chí Minh</Text> </Text>
                  </View>
                  <View className="flex-row mx-auto mb-2 ">
                    <Text className="font-bold">Hotline:</Text>
                    <Text className="text-black font-normal">19001175</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="bg-white">
              <View className="bg-white mx-4 rounded-lg shadow-md my-3">
                <TouchableOpacity className="bg-gray mx-auto rounded-full w-52 h-52 mt-2 justify-center items-center ">
                  <Image
                    source={require('../../assets/2.png')}
                    className="rounded-full w-48 h-48">
                  </Image>
                </TouchableOpacity>
                <View className="bg-gray justify-center mx-4 items-center -mt-10 -z-10 rounded-lg mb-3">
                  <Text className="mt-8 py-1 text-black font-bold text-lg">Bệnh viện Quân Y</Text>
                  <View className="flex-row mx-4">
                    <Text className="font-bold">Địa chỉ :
                      <Text className="text-black font-normal"> 64 Lê Văn Chí, Phường Linh Trung, Thủ Đức, TP. Hồ Chí Minh</Text></Text>
                  </View>
                  <View className="flex-row mx-auto mb-2 ">
                    <Text className="font-bold">Hotline:</Text>
                    <Text className="text-black font-normal">19001175</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView >
      )}




    </SafeAreaView >
  );
};
export default HomeScreen;
