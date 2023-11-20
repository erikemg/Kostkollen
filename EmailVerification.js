import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { auth } from './firebase';
import { sendEmailVerification, onAuthStateChanged } from 'firebase/auth';

export default function EmailVerification({ verified, setVerified, setInfoEntered, setUser, user }) {
    const [displayError, setDisplayError] = useState('');

    useEffect(() => {
        emailSend()
    }, [])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (user) => { setUser(user); console.log(user.emailVerified) })
        return () => unSubscribe();
    }, [])

    const handleBackButtonClick = () => {
        setUser(null)
        setInfoEntered(false)
    };

    const checkEmailVerification = async () => {
        user.emailVerified
        if (user) {
            setUser(user);
            await user.reload();
            if (user.emailVerified) {
                setVerified(true)
            } else {
                setDisplayError('Du har inte verifierat din e-postadress')
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
                <Text style={styles.title}>Verifiera din e-post</Text>
                <Text style={styles.description}>Ett verifierings-e-postmeddelande har skickats till din e-postadress. Om du inte hittar det, kolla i din skräppostmapp.</Text>
                <TouchableOpacity style={styles.checkVerification} onPress={() => checkEmailVerification()}>
                    <Text style={styles.checkVerificationText}>Kontrollera verifiering</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginBackButton} onPress={() => handleBackButtonClick()}>
                    <Text style={styles.loginBackText}>Gå tillbaka till inloggning</Text>
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
        fontWeight: 'bold',
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
        fontWeight: 'bold',
        color: "white",
        textAlign: "center",
        padding: 5,
    },
    loginBackButton: {
        marginTop: 10,
        width: 300
      },
      loginBackText: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'thin',
        textDecorationLine: 'underline'
      },
});