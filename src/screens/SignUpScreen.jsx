import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Alert } from 'react-native';
import isEmpty from "validator/lib/isEmpty";
import baseUrl from '../utils/constant';
import axios from 'axios';
const SignUpScreen = () => {

    const [email, setEmail] = useState("");
    const [cccd, setCccd] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [msgErr, setMsgErr] = useState(null);
    const navigation = useNavigation();
    const handleDangNhap = () => {
        navigation.navigate('LoginScreen');
    }
    const handleForgotPassword = () => {
    }
    const handleDangKy = async () => {
        const newUser = {
            cccd: cccd,
            password: password,
            email: email
        };
        console.log('cccd', cccd);
        const repw = repassword;
        // dispatch(registerStart());
        if (isEmpty(repassword)) {
            // setMsgErr("Vui lòng điền vào các mục còn trống");
            Alert.alert('Lỗi', 'Vui lòng điền vào các mục còn trống');

            // dispatch(registerFailed());
        } else {
            if (repw == newUser.password) {
                try {
                    const response = await fetch(`${baseUrl}/v1/auth/register`, {
                        method: 'POST',
                        body: JSON.stringify(newUser),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    //const response = await axios.post('https://192.168.246.136:8000/v1/auth/register', newUser);

                    if (!response.ok) {
                        const errorData = await response.json();
                        Alert.alert('Thất bại', errorData.message);
                    } else {
                        Alert.alert('Thành công', 'Đăng ký thành công!');
                    }
                } catch (error) {
                    console.error('Có lỗi:', error);
                    Alert.alert('Lỗi', 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
                }
            } else {
                Alert.alert('Lỗi', 'Xác nhận lại mật khẩu không trùng nhau.');
            }
        }
    }
    return (
        <ScrollView>
            <View className="flex-1  bg-white" >
                <Image source={require('../../assets/logo.png')} style={{ width: 220, height: 200, alignSelf: 'center' }}
                    resizeMode="contain"
                    className="mt-20"></Image>
                <Text className="mx-auto justify-center font-bold text-xl">ĐĂNG KÝ </Text>
                <Text className="mt-2 ml-4 font-bold">CCCD/Số định danh</Text>
                <TextInput
                    value={cccd}
                    onChangeText={(text) => setCccd(text)}
                    className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                    placeholder="Số định danh cá nhân"
                />
                <Text className="mt-2 ml-4 font-bold">Email</Text>
                <TextInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                    placeholder="Nhập email"
                />
                <Text className="mt-2 ml-4 font-bold">Mật khẩu</Text>
                <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                    placeholder="Nhập mật khẩu"
                    secureTextEntry
                />
                <Text className="mt-2 ml-4 font-bold">Xác nhận mật khẩu</Text>
                <TextInput
                    value={repassword}
                    onChangeText={(text) => setRepassword(text)}
                    className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                    placeholder="Xác nhận mật khẩu"
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleDangKy}
                    style={{ alignItems: 'center', backgroundColor: 'blue', padding: 10, margin: 10, borderRadius: 6 }}
                    className="items-center bg-blue-500 p-4 m-4 rounded-md" >
                    <Text className="text-white font-bold">ĐĂNG KÝ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text className="text-blue font-bold mx-auto justify-center">Quên mật khẩu ?</Text>
                </TouchableOpacity>
                <View className="flex-row justify-center m-2">
                    <Text className="text-black ">Đã có tài khoản ?</Text>
                    <TouchableOpacity onPress={handleDangNhap}>
                        <Text className="text-blue font-bold ml-1">Đăng nhập ngay</Text>
                    </TouchableOpacity></View>
            </View>
        </ScrollView>
    );
};

export default SignUpScreen;
