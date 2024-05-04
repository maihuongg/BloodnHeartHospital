import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import isEmpty from "validator/lib/isEmpty";
import baseUrl from '../utils/constant';
const ResetPassword = ({ route }) => {

    const { cccd } = route.params;
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const navigation = useNavigation();


    const handleResetPassword = async () => {
        const requestForgot = {
            cccd: cccd,
            newPassword: newPassword,
            repeatNewPassword: repeatNewPassword,
        };
        console.log('request :', requestForgot);
        if (isEmpty(newPassword) || isEmpty(repeatNewPassword)) {
            Alert.alert('Lỗi', 'Vui lòng điền vào các mục còn trống');
        } else {
            try {
                const response = await fetch(`${baseUrl}/v1/user/reset-password`, {
                    method: 'PUT',
                    body: JSON.stringify(requestForgot),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("data: ", errorData)
                    Alert.alert('Thất bại', errorData.message);

                } else {
                    Alert.alert('Thành công', 'Đặt lại mật khẩu thành công.');
                    navigation.navigate('LoginScreen');
                }
            } catch (error) {
                Alert.alert('Thất bại', 'Vui lòng thử lại');
                console.log("ForgotPassword Error: ", error);
            }
        }
    }

    return (
        <ScrollView>
            <View className="flex-1  bg-white" >
                <Image source={require('../../assets/logo.png')} style={{ width: 220, height: 200, alignSelf: 'center' }}
                    resizeMode="contain"
                    className="mt-20"></Image>
                <Text className="mx-auto justify-center font-bold text-xl">ĐẶT LẠI MẬT KHẨU</Text>

                <TextInput
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                    className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                    placeholder="Nhập mật khẩu mới"
                    secureTextEntry
                />
                <TextInput
                    value={repeatNewPassword}
                    onChangeText={(text) => setRepeatNewPassword(text)}
                    className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                    placeholder="Nhập lại mật khẩu"
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleResetPassword}
                    style={{ alignItems: 'center', backgroundColor: 'blue', padding: 10, margin: 10, borderRadius: 6 }}
                    className="items-center bg-blue-500 p-4 m-4 rounded-md" >
                    <Text className="text-white font-bold">XÁC NHẬN</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ResetPassword