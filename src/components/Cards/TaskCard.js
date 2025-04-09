import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from '../CustomText';
import {colors} from '../../theme/theme';
import CustomButton from '../CustomButton';

const TaskCard = ({task, onEdit, onDelete, onToggleComplete}) => {
  const deadline = new Date(task.deadline?.toDate?.() || task.deadline);

  return (
    <View style={[styles.card, {backgroundColor: colors.card}]}>
      <View style={styles.header}>
        <CustomText font="poppinsSemiBold" size={18} style={styles.title}>
          {task.title}
        </CustomText>

        <CustomText
          size={12}
          font="poppinsMedium"
          style={[
            styles.status,
            {
              backgroundColor: task.completed ? '#45c983' : '#F29339',
            },
          ]}>
          {task.completed ? 'Completed' : 'Pending'}
        </CustomText>
      </View>

      <CustomText color="error" size={12} style={styles.deadline}>
        Due: {deadline.toDateString()}
      </CustomText>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <CustomButton
          title="Edit"
          onPress={() => onEdit(task)}
          variant="secondaryOne"
          style={styles.actionButton}
        />

        <CustomButton
          title="Delete"
          onPress={() => onDelete(task.id)}
          variant="secondaryOne"
          style={styles.actionButton}
          color={colors.error}
        />

        <CustomButton
          title={task.completed ? 'Mark as Pending' : 'Mark as Completed'}
          onPress={onToggleComplete}
          variant="secondaryOne"
          style={styles.actionButton}
          color={task.completed ? colors.warning : colors.success}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    marginRight: 10,
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
  deadline: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 12,
  },

  actionButton: {
    paddingVertical: 10,
    borderRadius: 12,
  },
  editText: {
    fontSize: 14,
    marginRight: 8,
  },
  deleteText: {
    fontSize: 14,
    marginRight: 8,
  },
  completeText: {
    fontSize: 14,
  },
});

export default TaskCard;
