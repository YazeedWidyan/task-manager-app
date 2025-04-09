import React from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {createUserWithEmailAndPassword} from '@react-native-firebase/auth';
import {setDoc, doc} from '@react-native-firebase/firestore'; // Firestore modular SDK
import {auth, db} from '../../firebase';
import CustomText from '../components/CustomText'; // Import CustomText component
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const RegisterScreen = ({navigation}) => {
  const handleRegister = async values => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: values.email,
        createdAt: new Date(),
      });
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <CustomText size={24} font="poppinsMedium" style={styles.title}>
        Register
      </CustomText>

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}>
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
              title="Register"
              style={styles.button}
              onPress={handleSubmit}
              variant="primaryOne"
              disabled={false}
            />

            <CustomText
              font="poppins"
              size={14}
              style={styles.link}
              onPress={() => navigation.navigate('Login')}>
              Already have an account? Login
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
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
  },
  error: {marginBottom: 8},
});

export default RegisterScreen;
