import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import isEmpty from "validator/lib/isEmpty";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    hospitalprofileStart,
    hospitalprofileSuccess,
    hospitalrofileFailed
}from "../redux/hospitalSlice";
import {
    loginFailed,
    loginStart,
    loginSuccess,
} from "../redux/authSlice";
import baseUrl from '../utils/constant';
const LoginScreen = () => {
    const [cccd, setCccd] = useState("");
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        const newUser = {
            cccd: cccd,
            password: password,
        };
        console.log('cccd', cccd);
        if (isEmpty(cccd) || isEmpty(password)) {
            Alert.alert('Lỗi', 'Vui lòng điền vào các mục còn trống');
        } else {
            dispatch(loginStart());
            try {
                const response = await fetch(`${baseUrl}/v1/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(newUser),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    Alert.alert('Thất bại', errorData.message);
                    dispatch(loginFailed());
                } else {
                    const data = await response.json();
                    dispatch(loginSuccess(data));
                    const userId = data._id;
                    console.log('userId', userId);
                    AsyncStorage.setItem('token', data.accessToken);
                    const accessToken = data.accessToken;
                    const isHospital = data.isHospital;
                    if (isHospital) {
                        console.log('user', 'fdffff');
                        dispatch(hospitalprofileStart());
                        console.log('user', 'fdffff');
                        try {
                            const response1 = await fetch(`${baseUrl}/v1/hospital/profile/` + userId, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    token: `Bearer ${accessToken}`
                                }
                            });
                            console.log('user', 'fdffff');
                            if (!response1.ok) {
                                dispatch(hospitalrofileFailed());
                                Alert.alert('Lỗi', 'Đã xảy lỗi ');
                            } else {
                                const data1 = await response1.json();
                                console.log('data', data1)
                                dispatch(hospitalprofileSuccess(data1));
                                navigation.navigate('Home');
                            }
                        } catch (error) {
                            dispatch(hospitalrofileFailed());
                            Alert.alert('Lỗi', 'Đã xảy ra lỗi không mong muốn.');
                        }
                    } else {
                        Alert.alert('Thất bại', 'Tài khoản này không phải của bệnh viện.');
                    }
                }

            } catch (error) {

                Alert.alert('Lỗi', 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
                dispatch(loginFailed());
            }
        }

    }
    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    }
    const handleDangKy = () => {
        navigation.navigate('SignUpScreen');
    }
    return (
        <View className="flex-1  bg-white" >
            <Image source={require('../../assets/logo.png')} style={{ width: 220, height: 200, alignSelf: 'center' }}
                resizeMode="contain"
                className="mt-20"></Image>
            <Text className="mx-auto justify-center font-bold text-xl">ĐĂNG NHẬP ĐỂ TRẢI NGHIỆM </Text>
            <TextInput
                value={cccd}
                onChangeText={(text) => setCccd(text)}
                className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                placeholder="Số định danh cá nhân"
            />
            <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                placeholder="Nhập mật khẩu"
                secureTextEntry
            />
            <TouchableOpacity onPress={handleLogin}
                style={{ alignItems: 'center', backgroundColor: 'blue', padding: 10, margin: 10, borderRadius: 6 }}
                className="items-center bg-blue-500 p-4 m-4 rounded-md" >
                <Text className="text-white font-bold">ĐĂNG NHẬP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleForgotPassword}>
                <Text className="text-blue font-bold mx-auto justify-center">Quên mật khẩu ?</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
