// src/components/CreateTodoModal.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Button
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Todo, TodoStatus } from '../types/Todo';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { TodoService } from '@/services/TodoService';

interface ViewTodoModalProps {
    visible: boolean;
    todo?: Todo | null;
    loading: boolean;
    onClose: () => void;
    onSubmit: (todoData: Omit<Todo, 'id'> | Partial<Todo>) => void;
    onDelete: () => void;
}

const ViewTodoModal: React.FC<ViewTodoModalProps> = ({
    visible,
    todo,
    onClose,
    onSubmit,
    loading,
    onDelete,
}) => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [status, setStatus] = useState<TodoStatus>('not started');
    const [mode, setMode] = useState('view');
    const [isProcessing, setIsProcessing] = useState(false);
    const [todos, setTodos] = useState<any>([]);

    // Reset form when modal opens/closes or todo changes
    useEffect(() => {
        if (todo) {
            setTitle(todo.title || todos.title);
            setDetails(todo.details || todos.details);
            setStatus(todo.status);
        } else {
            // Reset to defaults when creating new todo
            setTitle('');
            setDetails('');
            setStatus('not started');
        }
    }, [todo, visible, todos]);

    const handleFetchTodo = async (id: number) => {
        try {
            setIsProcessing(true);
           const fetchedTodo = await TodoService.findTodoById(id);
            setTodos(fetchedTodo);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Todo fetched successfully!',
            });
            // fetchTodos();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to failed todo.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

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
            setMode('view');
        } else {
            onSubmit(todoData);
        }
    };

    const getStatusStyle = () => {
        switch (status) {
            case 'completed':
                return styles.completedStatus;
            case 'in progress':
                return styles.inProgressStatus;
            default:
                return styles.pendingStatus;
        }
    };

    useEffect(() => {
        if (loading) {
            setIsProcessing(true);
        } else {
            setIsProcessing(false);
        }
    }, [loading])



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 10, right: 10 }}
                        onPress={() => {
                            onClose();
                            setMode('view');
                        }}
                    >
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    {
                        !(isProcessing) && mode === 'view' &&
                        <View>
                            <Text style={[styles.status, getStatusStyle()]}>{status}</Text>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <Text style={styles.details}>{details}</Text>
                            <View style={styles.viewButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => {
                                        onDelete();
                                        setMode('view');
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.submitButton]}
                                    onPress={() => {
                                        setMode('update');
                                    }}
                                >
                                    <Text style={styles.buttonText}>
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                    {
                        (isProcessing) && <View style={styles.loader}>
                            <ActivityIndicator size="large" color="rgba(0, 0, 0, 0.5)" />
                        </View>
                    }
                    {!(isProcessing) && mode === 'update' && <><Text style={styles.modalTitle}>
                        {todo ? 'Edit Todo' : 'Create Todo'}
                    </Text>
                        <TextInput
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
                        </Picker>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setMode('view');
                                }}
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
                        </View>
                    </>
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
    status: {
        marginTop: 0,
        marginBottom: 10,
        fontSize: 12,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    details: {
        color: '#666',
        marginTop: 5,
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
    viewButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 30,
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
    deleteButton: {
        backgroundColor: '#DC3545',
    },
    loader: {
        width: '100%',
        height: 80,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
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
});

export default ViewTodoModal;