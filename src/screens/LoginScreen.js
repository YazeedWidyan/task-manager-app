import React from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {signInWithEmailAndPassword} from '@react-native-firebase/auth';
import {auth} from '../../firebase';
import CustomText from '../components/CustomText'; // Import CustomText component
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginScreen = ({navigation}) => {
  const handleLogin = async values => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password); // Use the auth instance
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <CustomText size={24} font="poppinsMedium" style={styles.title}>
        Login
      </CustomText>

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={styles.inputsContainer}>
              <CustomInput
                label="Email"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
              />
              <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
                error={touched.password && errors.password}
              />
            </View>
            <CustomButton
              title="Login"
              style={styles.button}
              onPress={handleSubmit}
              variant="primaryOne"
              disabled={false}
            />

            <CustomText
              font="poppins"
              size={14}
              style={styles.link}
              onPress={() => navigation.navigate('Register')}>
              Don't have an account? Register
            </CustomText>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  inputsContainer: {
    gap: 14,
  },
  button: {
    marginTop: 30,
  },
  title: {marginBottom: 20, textAlign: 'center'},
  link: {
    marginTop: 16,
    textAlign: 'center',
  },
  error: {marginBottom: 8},
});

export default LoginScreen;
