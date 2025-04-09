import React, {useEffect, useState} from 'react';
import {View, FlatList, Modal, StyleSheet, Platform, Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import {auth, db} from '../../firebase';
import {colors} from '../theme/theme';
import CustomText from '../components/CustomText';
import TaskCard from '../components/Cards/TaskCard';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const TaskListScreen = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const user = auth.currentUser;
  console.log(editingTask, 'editingTask');
  console.log(newTaskDeadline);

  useEffect(() => {
    if (!user) return;

    const taskCollection = collection(db, 'users', user.uid, 'tasks');
    const taskQuery = query(taskCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(taskQuery, snapshot => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'tasks'), {
        title: newTaskTitle,
        completed: false,
        createdAt: new Date(),
        deadline: newTaskDeadline,
      });

      Alert.alert('Task Added', 'Your task has been successfully added.');

      setNewTaskTitle('');
      setNewTaskDeadline(new Date());
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const handleMarkAsComplete = async (taskId, completed) => {
    try {
      await updateDoc(doc(db, 'users', user.uid, 'tasks', taskId), {
        completed: !completed,
      });
    } catch (error) {
      console.error('Error marking task as complete: ', error);
    }
  };

  const handleDeleteTask = async taskId => {
    Alert.alert(
      'Are you sure?',
      'This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: ' Delete',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId));
              console.log('Task deleted');
            } catch (error) {
              console.error('Error deleting task: ', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleEditTask = async () => {
    if (!editingTask || !editingTask.title.trim()) return;

    try {
      await updateDoc(doc(db, 'users', user.uid, 'tasks', editingTask.id), {
        title: editingTask.title,
        deadline: editingTask.deadline,
      });

      Alert.alert('Task Edited', 'Your task has been successfully updated.');

      setEditingTask(null);
    } catch (error) {
      console.error('Error editing task: ', error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <CustomText size={24} font="poppinsMedium" style={styles.header}>
        Your Tasks
      </CustomText>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TaskCard
            task={item}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onToggleComplete={() =>
              handleMarkAsComplete(item.id, item.completed)
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <CustomButton
        title="Add Task"
        onPress={() => setIsModalVisible(true)}
        variant="primaryOne"
        style={{marginTop: 16}}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.modalCard, {backgroundColor: colors.card}]}>
            <CustomText
              font="poppinsMedium"
              color="text"
              size={24}
              style={styles.modalHeader}>
              Add a New Task
            </CustomText>

            <CustomInput
              label="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Enter task title"
              style={{marginBottom: 16}}
            />

            <CustomButton
              title="Pick Deadline"
              onPress={() => setShowDatePicker(true)}
              variant="secondaryOne"
              style={{marginBottom: 12}}
            />

            <CustomText color="error" size={14} style={styles.deadlineText}>
              Deadline: {newTaskDeadline.toDateString()}
            </CustomText>

            {showDatePicker && (
              <DateTimePicker
                value={newTaskDeadline}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setNewTaskDeadline(selectedDate);
                }}
              />
            )}

            <View style={styles.buttonRow}>
              <CustomButton
                title="Add"
                onPress={handleAddTask}
                variant="primaryOne"
              />
              <CustomButton
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                variant="secondaryOne"
                color={colors.error}
              />
            </View>
          </View>
        </View>
      </Modal>

      {editingTask && (
        <Modal visible={true} animationType="slide" transparent>
          <View style={styles.overlay}>
            <View style={[styles.modalCard, {backgroundColor: colors.card}]}>
              <CustomText
                font="poppinsMedium"
                color="text"
                size={24}
                style={styles.modalHeader}>
                Edit Task
              </CustomText>

              <CustomInput
                label="Task Title"
                value={editingTask.title}
                onChangeText={text =>
                  setEditingTask({...editingTask, title: text})
                }
                placeholder="Update task title"
                style={{marginBottom: 16}}
              />

              <CustomButton
                title="Pick New Deadline"
                onPress={() => setShowDatePicker(true)}
                variant="secondaryOne"
                style={{marginBottom: 12}}
              />

              <CustomText color="error" size={14} style={styles.deadlineText}>
                Deadline:{' '}
                {editingTask.deadline
                  ? new Date(
                      editingTask.deadline?.toDate?.() || editingTask.deadline,
                    ).toDateString()
                  : 'Not set'}
              </CustomText>

              {showDatePicker && (
                <DateTimePicker
                  value={
                    new Date(editingTask.deadline?.toDate?.() || new Date())
                  }
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setEditingTask({
                        ...editingTask,
                        deadline: selectedDate,
                      });
                    }
                  }}
                />
              )}

              <View style={styles.buttonRow}>
                <CustomButton
                  title="Save"
                  onPress={handleEditTask}
                  variant="primaryOne"
                />
                <CustomButton
                  title="Cancel"
                  onPress={() => setEditingTask(null)}
                  variant="secondaryOne"
                  color={colors.error}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    marginBottom: 16,
    color: colors.text,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    marginBottom: 20,
    textAlign: 'center',
  },
  deadlineText: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    marginTop: 20,
  },
});

export default TaskListScreen;
