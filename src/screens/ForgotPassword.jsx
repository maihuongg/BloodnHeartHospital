import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import baseUrl from '../utils/constant';
import isEmpty from "validator/lib/isEmpty";
const ForgotPassword = () => {

    const [cccd, setCccd] = useState("");
    const [email, setEmail] = useState("");
    const navigation = useNavigation();

    const generateRandomDigits = () => {
        let result = '';
        for (let i = 0; i < 6; i++) {
            const randomDigit = Math.floor(Math.random() * 10); // Sinh số ngẫu nhiên từ 0 đến 9
            result += randomDigit.toString();
        }
        return result;
    };

    const handleSendCode = async () => {
        const random = generateRandomDigits();
        const requestForgot = {
            cccd: cccd,
            email: email,
            code: random,
        };
        console.log('request :', requestForgot);
        if (isEmpty(cccd) || isEmpty(email)) {
            Alert.alert('Lỗi', 'Vui lòng điền vào các mục còn trống');
        } else {
            try {
                const response = await fetch(`${baseUrl}/v1/user/forgot-password`, {
                    method: 'POST',
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
                    const successMsg = await response.json();
                    Alert.alert('Thành công', successMsg.message);
                    // Trong một thành phần khác
                    navigation.navigate('CodeScreen', { cccd: cccd, code: random });

                }
            } catch (error) {
                Alert.alert('Thất bại', 'Vui lòng thử lại');
                console.log("ForgotPassword Error: ", error);
            }
        }
    }

    return (
            <View className="flex-1  bg-white" >
                <Image source={require('../../assets/logo.png')} style={{ width: 220, height: 200, alignSelf: 'center' }}
                    resizeMode="contain"
                    className="mt-20"></Image>
                <Text className="mx-auto justify-center font-bold text-xl">QUÊN MẬT KHẨU </Text>

                <TextInput
                    value={cccd}
                    onChangeText={(text) => setCccd(text)}
                    className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                    placeholder="Số định danh cá nhân"
                />
                <TextInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                    placeholder="Email đã đăng ký"
                />
                <TouchableOpacity onPress={handleSendCode}
                    style={{ alignItems: 'center', backgroundColor: 'blue', padding: 10, margin: 10, borderRadius: 6 }}
                    className="items-center bg-blue-500 p-4 m-4 rounded-md" >
                    <Text className="text-white font-bold">GỬI MÃ</Text>
                </TouchableOpacity>
            </View>
    );
};

export default ForgotPassword