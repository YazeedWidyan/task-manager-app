import React from 'react';
import {View, StyleSheet} from 'react-native';
import {auth} from '../../firebase';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import {colors} from '../theme/theme';
import {useNavigation} from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <CustomText size={28} font="poppinsMedium" style={styles.title}>
        Profile
      </CustomText>

      {user ? (
        <>
          <CustomText size={18} color="text" style={styles.email}>
            Email: {user.email}
          </CustomText>

          <CustomButton title="Log Out" onPress={handleLogout} />
        </>
      ) : (
        <CustomText size={16} color="textSecondary">
          No user info available
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  email: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProfileScreen;
