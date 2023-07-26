import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { auth } from './firebase';
import { sendEmailVerification, onAuthStateChanged } from 'firebase/auth';

export default function EmailVerification({ verified, setVerified }) {
    const [displayError, setDisplayError] = useState('');
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        emailSend()
    }, [])

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (user) => {setUser(user)})
        return () => unSubscribe();
    }, [])  

    const checkEmailVerification = async () => {
        if (user) {
            setUser(user);
            await user.reload();
            if (user.emailVerified) {
                setVerified(true)
            } else {
                setDisplayError('You have not verified your email')
            }
        }
    };

    const emailSend = async () => {
        try {
            await sendEmailVerification(auth.currentUser);
        } catch (error) {
            setDisplayError(error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container} behavior="padding">
            <View style={styles.content}>
                <MaterialCommunityIcons name="email-outline" size={60} style={styles.icon} />
                <Text style={styles.title}>Verify your email</Text>
                <Text style={styles.description}>A verification email has been sent to your email. If you cannot find it, check your spam folder.</Text>
                <TouchableOpacity style={styles.checkVerification} onPress={() => checkEmailVerification()}>
                    <Text style={styles.checkVerificationText}>Check verification</Text>
                </TouchableOpacity>
            </View>
            {displayError !== "" && (
                <View style={styles.error}>
                    <Text style={styles.errorText}>{displayError}</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        textAlign: 'center',
        marginBottom: 20,
        width: 260
    },
    checkVerification: {
        backgroundColor: "#00FF00",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        width: 200,
        borderRadius: 50,
        elevation: 1,
        marginTop: 10,
    },
    checkVerificationText: {
        fontWeight: "bold",
        color: "white",
    },
    error: {
        position: "absolute",
        bottom: 20,
        backgroundColor: "red",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 10,
    },
    errorText: {
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        padding: 5,
    },
});