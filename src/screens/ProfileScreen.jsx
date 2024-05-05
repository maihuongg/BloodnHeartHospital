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
    hospitalprofileStart,
    hospitalprofileSuccess,
    hospitalrofileFailed
} from "../redux/hospitalSlice";
import baseUrl from '../utils/constant';
const ProfileScreen = () => {

    const user = useSelector((state) => state.auth.login.currentUser);
    const userId = user?._id;
    const accessToken = user?.accessToken
    const hospitalProfile = useSelector((state) => state.hospital.profile.gethospital);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [hospitalName, setHospitalName] = useState(hospitalProfile?.hospitalName);
    const [leaderName, setLeaderName] = useState(hospitalProfile?.leaderName);
    const [address, setAddress] = useState(hospitalProfile?.address);
    const [phone, setPhone] = useState(hospitalProfile?.phone);
    const [email, setEmail] = useState(hospitalProfile?.email);

    const [modalVisible, setModalVisible] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    useEffect(() => {
        (async () => {
            // Yêu cầu quyền truy cập vào thư viện ảnh khi component được tải lần đầu
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập để chọn ảnh từ thư viện.');
            }
        })();
        const handleProfile = async () => {
            dispatch(hospitalprofileStart());
            try {
                const response1 = await fetch(`${baseUrl}/v1/hospital/profile/` + userId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: `Bearer ${accessToken}`
                    }
                });
                if (!response1.ok) {
                    dispatch(hospitalrofileFailed());
                    Alert.alert('Lỗi', 'Đã xảy lỗi ');
                } else {
                    const data1 = await response1.json();
                    dispatch(hospitalprofileSuccess(data1));
                }
            } catch (error) {
                dispatch(hospitalrofileFailed());
                Alert.alert('Lỗi', 'Đã xảy ra lỗi không mong muốn.');
            }
        }
        handleProfile();
    }, [dispatch]);

    const handleUpdate = async (e) => {
        const updateUser = {
            hospitalName: hospitalName,
            leaderName: leaderName,
            phone: phone,
            email: email,
            address: address,
        };
        dispatch(hospitalprofileStart());
        try {
            const response = await fetch(`${baseUrl}/v1/hospital/profile-update/` + userId, {
                method: 'PUT',
                body: JSON.stringify(updateUser),
                headers: {
                    'Content-Type': 'application/json',
                    token: `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                dispatch(hospitalrofileFailed());
                Alert.alert('Thất bại', 'Không thể cập nhật thông tin');
            } else {
                const data = await response.json();
                dispatch(hospitalprofileSuccess(data));
                setModalVisible(false);
                Alert.alert('Thành công', 'Đã cập nhật thông tin.');
                navigation.navigate('Profile');
            }
        } catch (error) {
            dispatch(hospitalrofileFailed());
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

        dispatch(hospitalprofileStart());

        try {
            const response = await fetch(`${baseUrl}/v1/hospital/profile-update-image/` + userId, {
                method: 'PUT',
                body: formData,
                headers: {
                    token: `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                dispatch(hospitalrofileFailed());
                Alert.alert('Thất bại', 'Không thể cập nhật hình ảnh');
            } else {
                const data = await response.json();
                dispatch(hospitalprofileSuccess(data));
                Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện.');
                navigation.navigate('Profile');
            }
        } catch (error) {
            dispatch(hospitalrofileFailed());
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
                    source={{ uri: hospitalProfile?.images }} ></Image>
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
                                    source={{ uri: selectedImage ? selectedImage : (hospitalProfile?.images ? hospitalProfile.images : '') }}
                                    style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'rgb(8, 145, 178)' }}
                                />
                                <TouchableOpacity onPress={handleChooseImage}>
                                    <View className="flex-row bg-blue rounded-md mx-24 p-2 mt-3 items-center justify-center">
                                        <Text className="text-white font-bold text-sx ml-4">Chọn ảnh</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                    <Button title="Lưu lại" disabled={!selectedImage} style={{ marginRight: 10 }} onPress={handleUpdateImage} />
                                    <Button title="Hủy" onPress={handleCloseModal} />
                                </View>
                            </View>
                        </View>
                    </View>

                </Modal>
            </View>

            <View className=" justify-center items-center mx-2 ">
                <Text className="text-black font-bold text-[22px]"> {hospitalProfile?.hospitalName}</Text>
            </View>

            <View className="bg-white mx-4 rounded-xl my-3 py-2 shadow-sm">
                <View className="flex-row mx-2 items-center">
                    <MaterialCommunityIcons name="information" size={24} color="#0891b2" />
                    <Text className="text-blue font-bold text-[20px]"> Thông tin bệnh viện </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Số định danh :  </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto"> {hospitalProfile?.cccd}  </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Tên bệnh viện : </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto" style={{ flexWrap: 'wrap', maxWidth: '60%', textAlign: 'right' }}>
                        {hospitalProfile?.hospitalName}
                    </Text>


                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Tên người đại diện : </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto"> {hospitalProfile?.leaderName} </Text>
                </View>
            </View>
            <View className="bg-white mx-4 rounded-xl my-2 py-2 shadow-sm">
                <View className="flex-row mx-2 items-center">
                    <MaterialCommunityIcons name="information" size={24} color="#0891b2" />
                    <Text className="text-blue font-bold text-[20px]"> Thông tin liên hệ </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Số điện thoại :  </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto">{hospitalProfile?.phone}  </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Email : </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto">{hospitalProfile?.email} </Text>
                </View>
                <View className="flex-row mx-2">
                    <Text className="text-black font-bold text-[18px]">Địa chỉ : </Text>
                    <Text className="text-black font-normal text-[18px] ml-auto" style={{ flexWrap: 'wrap', maxWidth: '70%', textAlign: 'right' }}> {hospitalProfile?.address} </Text>
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
                                <Text className="text-xl font-bold text-blue mb-2">Chỉnh sửa thông tin bệnh viện</Text>
                                <Text className="text-black text-[16px] font-bold my-2"> Số định danh </Text>
                                <TextInput
                                    defaultValue={hospitalProfile?.cccd}
                                    placeholder="Nhập số định danh"
                                    className="border border-gray-300 rounded-md p-2"
                                    editable={false} />

                                <Text className="text-black text-[16px] font-bold my-2"> Tên bệnh viện </Text>
                                <TextInput
                                    defaultValue={hospitalProfile?.hospitalName}
                                    onChangeText={(text) => setHospitalName(text)}
                                    placeholder="Tên bệnh viện"
                                    className="border border-gray-300 rounded-md p-2" />
                                <Text className="text-black text-[16px] font-bold my-2"> Tên người đại diện </Text>
                                <TextInput
                                    defaultValue={hospitalProfile?.leaderName}
                                    onChangeText={(text) => setLeaderName(text)}
                                    placeholder="Tên người đại diện"
                                    className="border border-gray-300 rounded-md p-2" />
                                <Text className="text-black text-[16px] font-bold my-2"> Email </Text>
                                <TextInput
                                    defaultValue={hospitalProfile?.email}
                                    onChangeText={(text) => setEmail(text)}
                                    placeholder="Email"
                                    className="border border-gray-300 rounded-md  p-2" />
                                <Text className="text-black text-[16px] font-bold my-2"> Số điện thoại </Text>
                                <TextInput
                                    defaultValue={hospitalProfile?.phone}
                                    onChangeText={(text) => setPhone(text)}
                                    placeholder="0955662301"
                                    className="border border-gray-300 rounded-md  p-2" />
                                <Text className="text-black text-[16px] font-bold my-2"> Địa chỉ </Text>
                                <TextInput
                                    defaultValue={hospitalProfile?.address}
                                    onChangeText={(text) => setAddress(text)}
                                    placeholder="1 Võ Văn Ngân, TP.Thủ Đức, TPHCM"
                                    className="border border-gray-300 rounded-md  p-2" />


                                {/* Khi hoàn thành, bạn cần một cách nào đó để lưu thông tin đã chỉnh sửa và đóng modal */}
                                <TouchableOpacity onPress={handleUpdate} >
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