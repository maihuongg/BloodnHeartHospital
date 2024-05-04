import { View, Text, TextInput, Button, ScrollView, Modal, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo } from "@expo/vector-icons";
import moment from "moment";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
    userprofileStart,
    userprofileSuccess,
    userprofileFailed,
} from "../redux/userSlice";
import baseUrl from '../utils/constant';
const ProfileScreen = () => {


    const user = useSelector((state) => state.auth.login.currentUser);
    const userId = user?._id;
    const accessToken = user?.accessToken
    const userPro = useSelector((state) => state.user.profile.getUser);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [fullName, setfullName] = useState(userPro?.fullName);
    const [birthDay, setbirthDay] = useState(moment(userPro?.birthDay).format('DD/MM/YYYY'));

    const [gender, setGender] = useState(userPro?.gender);
    const [bloodgroup, setbloodGroup] = useState(userPro?.bloodgroup);
    const [address, setAddress] = useState(userPro?.address);
    const [phone, setPhone] = useState(userPro?.phone);
    const [email, setEmail] = useState(userPro?.email);

    const [modalVisible, setModalVisible] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const bloodGroupData = [
        { key: 'A-', value: 'A-' },
        { key: 'A+', value: 'A+' },
        { key: 'B-', value: 'B-' },
        { key: 'B+', value: 'B+' },
        { key: 'AB-', value: 'AB-' },
        { key: 'AB+', value: 'AB+' },
        { key: 'O-', value: 'O-' },
        { key: 'O+', value: 'O+' },

        // Thêm các nhóm máu khác nếu cần
    ];

    const data = [
        { key: 'Nam', value: 'Nam' },
        { key: 'Nữ', value: 'Nữ' },

    ]

    useEffect(() => {
        (async () => {
            // Yêu cầu quyền truy cập vào thư viện ảnh khi component được tải lần đầu
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập để chọn ảnh từ thư viện.');
            }
        })();
        const handleProfile = async () => {
            dispatch(userprofileStart());
            try {
                const response1 = await fetch(`${baseUrl}/v1/user/profile/` + userId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: `Bearer ${accessToken}`
                    }
                });
                if (!response1.ok) {
                    dispatch(userprofileFailed());
                } else {
                    const data1 = await response1.json();
                    dispatch(userprofileSuccess(data1));
                    console.log("bbb");
                }
            } catch (error) {
                dispatch(userprofileFailed());
            }
        }
        handleProfile();
    }, [dispatch]);

    const handleUpdate = async (e) => {
        const [day, month, year] = birthDay.split("/"); // Tách ngày, tháng, năm từ chuỗi
        const formattedDate = new Date(`${year}-${month}-${day}`);
        const updateUser = {
            fullName: fullName,
            birthDay: formattedDate,
            gender: gender,
            bloodgroup: bloodgroup,
            phone: phone,
            email: email,
            address: address,
        };
        dispatch(userprofileStart());
        try {
            const response = await fetch(`${baseUrl}/v1/user/profile/` + userId, {
                method: 'PUT',
                body: JSON.stringify(updateUser),
                headers: {
                    'Content-Type': 'application/json',
                    token: `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                dispatch(userprofileFailed());
                Alert.alert('Thất bại', 'Không thể cập nhật thông tin');
            } else {
                const data = await response.json();
                dispatch(userprofileSuccess(data));
                setModalVisible(false);
                Alert.alert('Thành công', 'Đã cập nhật thông tin.');
                navigation.navigate('Profile');
            }
        } catch (error) {
            dispatch(userprofileFailed());
            Alert.alert('Lỗi', 'Đã xảy ra lỗi không mong muốn.');
        }
    }

    const handleChooseImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                
                console.log("uri", result.assets[0].uri);
                const base64Image = await convertImageToBase64(result.assets[0].uri);
                console.log("Base64 Image:", base64Image);
                setSelectedImage(base64Image);
            }
        } catch (error) {
            console.error('Lỗi khi chọn ảnh:', error);
        }
    };

    const convertImageToBase64 = async (imageUri) => {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const base64String = await blobToBase64(blob);
        return base64String;
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    };

    const handleUpdateImage = async () => {
        const formData = new FormData();
        formData.append('images', selectedImage);

        dispatch(userprofileStart());

        try {
            const response = await fetch(`${baseUrl}/v1/user/profileimage/` + userId, {
                method: 'PUT',
                body: formData,
                headers: {
                    token: `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                dispatch(userprofileFailed());
                Alert.alert('Thất bại', 'Không thể cập nhật hình ảnh');
            } else {
                const data = await response.json();
                dispatch(userprofileSuccess(data));
                Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện.');
                navigation.navigate('Profile');
            }
        } catch (error) {
            dispatch(userprofileFailed());
            Alert.alert('Lỗi', 'Đã xảy ra lỗi không mong muốn.');
        }
    }

    const handleBack = () => {
        navigation.navigate('InformationScreen');
    }
    return (
        <View className="flex-1">
            <View className="flex-row h-32 bg-blue">
                <TouchableOpacity onPress={handleBack}>
                    <View className="my-10 ml-5">
                        <MaterialIcons name="keyboard-backspace" size={32} color="white" /></View>

                </TouchableOpacity>
            </View>
            <View className="flex-row w-32 h-32 bg-white  rounded-full mx-auto py-2 -mt-16 shadow-md">
                <Image
                    className="w-28 h-28 rounded-full mx-auto items-center justify-centerr"
                    source={{ uri: userPro?.images }} ></Image>
                <TouchableOpacity style={{ position: 'absolute', bottom: 10, right: 10 }} onPress={handleOpenModal}>
                    <FontAwesome5 name="edit" size={20} style={{ color: 'rgb(8, 145, 178)' }} />
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={() => {
                        setModalVisible(!showModal);
                    }}
                >
                    <View className="flex-1 bg-rnb justify-center items-center">
                        <View className="h-[45%] w-[75%]">

                            <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                                <Text>Ảnh đại diện</Text>

                                <Image
                                    source={{ uri: selectedImage ? selectedImage : (userPro?.images ? userPro.images : '') }}
                                    style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'rgb(8, 145, 178)' }}
                                />
                                <TouchableOpacity onPress={handleChooseImage}>
                                    <View className="flex-row bg-blue rounded-md mx-24 p-2 mt-3 items-center justify-center">
                                        <Text className="text-white font-bold text-sx ml-4">Chọn ảnh</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                    <Button title="Lưu lại" disabled={!selectedImage} style={{ marginRight: 10 }} onPress={handleUpdateImage}/>
                                    <Button title="Hủy" onPress={handleCloseModal} />
                                </View>
                            </View>
                        </View>
                    </View>

                </Modal>
            </View>

            <View className=" justify-center items-center mx-2 ">
                <Text className="text-black font-bold text-[22px]"> {userPro?.fullName}</Text>
            </View>

            <View className="bg-white mx-4 rounded-xl my-3 py-2 shadow-sm">
                <View className="flex-row mx-2 items-center">
                    <MaterialCommunityIcons name="information" size={24} color="#0891b2" />
                    <Text className="text-blue font-bold text-[20px]"> Thông tin cá nhân </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">CCCD/CMND :  </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto"> {userPro?.cccd}  </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Họ tên: </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto"> {userPro?.fullName}  </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Ngày sinh :  </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto"> {moment(userPro?.birthDay).format('DD/MM/YYYY')} </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Giới tính :  </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto"> {userPro?.gender}</Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Nhóm máu </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto"> {userPro?.bloodgroup} </Text>
                </View>
            </View>
            <View className="bg-white mx-4 rounded-xl my-2 py-2 shadow-sm">
                <View className="flex-row mx-2 items-center">
                    <MaterialCommunityIcons name="information" size={24} color="#0891b2" />
                    <Text className="text-blue font-bold text-[20px]"> Thông tin liên hệ </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Số điện thoại :  </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto">{userPro?.phone}  </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Email : </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto">{userPro?.email} </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Địa chỉ :
                        <Text className="text-black font-normal text-[18px] whitespace-pre-wrap "> {userPro?.address} </Text></Text>
                </View>

            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View className="flex-row bg-blue rounded-md mx-24 p-2 mt-3 items-center justify-center">
                    <FontAwesome5 name="edit" size={24} color="white" />
                    <Text className="text-white font-bold text-sx ml-4">Chỉnh sửa</Text>

                </View>
            </TouchableOpacity>
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
                                <Text className="text-xl font-bold text-blue mb-2">Chỉnh sửa thông tin cá nhân</Text>
                                <Text className="text-black text-[16px] font-bold my-2"> CCCD/CMND </Text>
                                <TextInput
                                    defaultValue={userPro?.cccd}
                                    placeholder="Nhập số CCCD/CMND"
                                    className="border border-gray-300 rounded-md p-2"
                                    editable={false} />

                                <Text className="text-black text-[16px] font-bold my-2"> Họ tên </Text>
                                <TextInput
                                    defaultValue={userPro?.fullName}
                                    onChangeText={(text) => setfullName(text)}
                                    placeholder="Họ và tên"
                                    className="border border-gray-300 rounded-md p-2" />
                                <Text className="text-black text-[16px] font-bold my-2"> Ngày sinh </Text>
                                <TextInput
                                    defaultValue={moment(userPro?.birthDay).format('DD/MM/YYYY')}
                                    onChangeText={(text) => setbirthDay(text)}
                                    placeholder="15/05/1999"
                                    className="border border-gray-300 rounded-md p-2" />
                                <View className="flex-row">
                                    <View className="flex-col w-[45%]">
                                        <Text className="text-black text-[16px] font-bold my-2"> Giới tính </Text>
                                        <SelectList
                                            setSelected={(val) => setGender(val || userPro?.gender)}
                                            data={data}
                                            save="value"
                                        />

                                    </View>
                                    <View className="flex-col w-[45%] ml-auto">
                                        <Text className="text-black text-[16px] font-bold my-2"> Nhóm máu </Text>
                                        <SelectList
                                            setSelected={(val) => setbloodGroup(val || userPro?.bloodgroup)}
                                            data={bloodGroupData}
                                            save="value"
                                        />
                                    </View>
                                </View>

                                <Text className="text-black text-[16px] font-bold my-2"> Email </Text>
                                <TextInput
                                    defaultValue={userPro?.email}
                                    onChangeText={(text) => setEmail(text)}
                                    placeholder="Email"
                                    className="border border-gray-300 rounded-md  p-2" />
                                <Text className="text-black text-[16px] font-bold my-2"> Số điện thoại </Text>
                                <TextInput
                                    defaultValue={userPro?.phone}
                                    onChangeText={(text) => setPhone(text)}
                                    placeholder="0955662301"
                                    className="border border-gray-300 rounded-md  p-2" />
                                <Text className="text-black text-[16px] font-bold my-2"> Địa chỉ </Text>
                                <TextInput
                                    defaultValue={userPro?.address}
                                    onChangeText={(text) => setAddress(text)}
                                    placeholder="1 Võ Văn Ngân, TP.Thủ Đức, TPHCM"
                                    className="border border-gray-300 rounded-md  p-2" />


                                {/* Khi hoàn thành, bạn cần một cách nào đó để lưu thông tin đã chỉnh sửa và đóng modal */}
                                <TouchableOpacity onPress={handleUpdate}>
                                    <View className="justify-center bg-blue mx-auto my-4 p-3 rounded-md">

                                        <Text className="text-white font-bold text-[16px]">Lưu thay đổi</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                </View>

            </Modal>




            {/* <TopBar activeItem={activeItem} handleItemClick={handleItemClick} /> */}

        </View>

    );
}
export default ProfileScreen;