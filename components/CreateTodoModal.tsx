// src/components/CreateTodoModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Todo, TodoStatus } from '../types/Todo';
import FullScreenLoader from './FullScreenLoader';

interface CreateTodoModalProps {
  visible: boolean;
  todo?: Todo | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (todoData: Omit<Todo, 'id'> | Partial<Todo>) => void;
}

const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
  visible,
  todo,
  onClose,
  onSubmit,
  loading,
}) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<TodoStatus>('not started');

  // Reset form when modal opens/closes or todo changes
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDetails(todo.details);
      setStatus(todo.status);
    } else {
      // Reset to defaults when creating new todo
      setTitle('');
      setDetails('');
      setStatus('not started');
    }
  }, [todo, visible]);

  const handleSubmit = () => {
    // Validate input
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const todoData = {
      title,
      details,
      status
    };

    // If editing existing todo, include id
    if (todo) {
      onSubmit({ id: todo.id, ...todoData });
    } else {
      onSubmit(todoData);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {
            loading ? <View style={styles.loader}>
                  <ActivityIndicator size="large" color="rgba(0, 0, 0, 0.5)" />
            </View> :
              <><Text style={styles.modalTitle}>
                {todo ? 'Edit Todo' : 'Create Todo'}
              </Text><TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle} /><TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Details"
                  value={details}
                  onChangeText={setDetails}
                  multiline /><Text>Status:</Text><Picker
                    selectedValue={status}
                    style={styles.picker}
                    onValueChange={(itemValue) => setStatus(itemValue as TodoStatus)}
                  >
                  <Picker.Item label="Not started" value="not started" />
                  <Picker.Item label="In Progress" value="in progress" />
                  <Picker.Item label="Completed" value="completed" />
                </Picker><View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onClose}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.buttonText}>
                      {todo ? 'Update' : 'Create'}
                    </Text>
                  </TouchableOpacity>
                </View></>
          }
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  picker: {
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#28A745',
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loader: {
    width: '100%',
    height: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CreateTodoModal;