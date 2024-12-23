import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  GestureResponderEvent,
} from 'react-native';
import { Todo } from '../types/Todo';
import { Ionicons } from '@expo/vector-icons';

interface TodoItemProps {
  todo: Todo;
  onEdit: () => void;
  onDelete: () => void;
  onView?: () => void;
  menuVisible: boolean;
  viewVisible: boolean;
  onToggleView: (isVisible: boolean) => void;
  onToggleMenu: (isVisible: boolean) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onView, onEdit, onDelete, onToggleMenu, menuVisible, onToggleView, viewVisible }) => {
  const toggleMenu = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onToggleMenu(!menuVisible);
  };

  const toggleView = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onToggleView(!viewVisible);
  };

  const getStatusStyle = () => {
    switch (todo.status) {
      case 'completed':
        return styles.completedStatus;
      case 'in progress':
        return styles.inProgressStatus;
      default:
        return styles.pendingStatus;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleView} style={styles.todoContent}>
        <Text style={[styles.status, getStatusStyle()]}>{todo.status}</Text>
        <Text style={styles.title}>{todo.title}</Text>
        {viewVisible && <Text style={styles.details}>{todo.details}</Text>}
      </TouchableOpacity>

      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onView && onView();
              }}
            >
              <Ionicons name="eye" size={24} color="#007BFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onEdit();
              }}
            >
              <Ionicons name="pencil" size={24} color="#17A2B8" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onDelete();
              }}
            >
              <Ionicons name="trash" size={24} color="#DC3545" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todoContent: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    color: '#666',
    marginTop: 5,
  },
  status: {
    marginTop: 0,
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  completedStatus: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  },
  inProgressStatus: {
    backgroundColor: '#D1ECF1',
    color: '#0C5460',
  },
  pendingStatus: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
  },
  menuContainer: {
    position: 'relative',
  },
  menu: {
    position: 'absolute',
    top: 30,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99,
    width: 150,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  menuItem: {
    marginHorizontal: 10,
  },
});

export default TodoItem;
