import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback, // Import TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

import { TodoService } from '../services/TodoService';
import { Todo, TodoFormData, TodoStatus } from '../types/Todo';
import TodoItem from '../components/TodoItem';
import CreateTodoModal from '../components/CreateTodoModal';
import ViewModal from '../components/ViewTodoModal';
import FullScreenLoader from '../components/FullScreenLoader';

const TodoListScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TodoStatus | ''>('');
  const [searchText, setSearchText] = useState(''); // Search text state
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [openDetails, setOpenDetails] = useState<number | null>(null);

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    try {
      setIsProcessing(true);
      const fetchedTodos = await TodoService.fetchTodos(filterStatus || undefined, searchText);
      setTodos(fetchedTodos);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch todos.',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [filterStatus, searchText]);

  useEffect(() => {
    fetchTodos();
  }, [filterStatus, searchText]); // Trigger fetching todos when searchText or filterStatus change

  // Add this function to close menu when clicking anywhere
  const handleScreenPress = () => {
    setOpenMenuId(null);
  };

  const handleCreateTodo = async (todoData: Omit<Todo, 'id'>) => {
    try {
      setIsProcessing(true);
      const newTodo = await TodoService.createTodo(todoData);
      setTodos((prev) => [...prev, newTodo]);
      setIsCreateModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Todo created successfully!',
      });
      fetchTodos();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create todo.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateTodo = async (todoData: Partial<TodoFormData>) => {
    if (!selectedTodo) return;

    try {
      setIsProcessing(true);
      const updatedTodo = await TodoService.updateTodo(selectedTodo.id, todoData);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
      setSelectedTodo(updatedTodo);
      setIsCreateModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Todo updated successfully!',
      });
      fetchTodos();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update todo.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setIsProcessing(true);
      await TodoService.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Todo deleted successfully!',
      });
      fetchTodos();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete todo.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsViewModalVisible(true);
  };

  const openEditModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsCreateModalVisible(true);
  };

  // Render
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo List</Text>

      {/* Search input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search todos..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={fetchTodos} // Trigger search when button is pressed
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Status Filter */}
      <View style={styles.filterContainer}>
        <Text>Filter by Status:</Text>
        <Picker
          selectedValue={filterStatus}
          style={styles.picker}
          onValueChange={(itemValue) => setFilterStatus(itemValue)}
        >
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Not Started" value="not started" />
          <Picker.Item label="In Progress" value="in progress" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>
      </View>

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TodoItem
            key={item.id}
            todo={item}
            onEdit={() => {
              setOpenMenuId(null);
              openEditModal(item);
            } }
            onDelete={() => {
              setOpenMenuId(null);
              handleDeleteTodo(item.id);
            } }
            onView={() => {
              setOpenMenuId(null);
              handleViewTodo(item);
            } }
            menuVisible={openMenuId === item.id}
            onToggleMenu={(isVisible) => {
              setOpenMenuId(isVisible ? item.id : null);

            } } 
            viewVisible={openDetails === item.id} 
            onToggleView={(isVisible) => {
              setOpenMenuId(null);
              setOpenDetails(isVisible ? item.id : null);
            }}          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchTodos}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#666" style={{ marginTop: 50 }} />
          ) : (
            <Text style={styles.emptyText}>No todos found</Text>
          )
        }
      />

      {/* Add Todo Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedTodo(null);
          setIsCreateModalVisible(true);
        }}
        disabled={isProcessing}
      >
        <Text style={styles.addButtonText}>+ Add Todo</Text>
      </TouchableOpacity>

      {/* Create/Edit Todo Modal */}
      <CreateTodoModal
        loading={isProcessing}
        visible={isCreateModalVisible}
        todo={selectedTodo}
        onClose={() => {
          setIsCreateModalVisible(false);
          setSelectedTodo(null);
        }}
        onSubmit={async (todoData) => {
          if (selectedTodo) {
            await handleUpdateTodo(todoData as Partial<TodoFormData>);
          } else {
            await handleCreateTodo(todoData as Omit<Todo, 'id'>);
          }
        }}
      />

      {/* View Todo Modal */}
      <ViewModal
        loading={isProcessing}
        visible={isViewModalVisible}
        onClose={() => {
          setIsViewModalVisible(false);
          setSelectedTodo(null);
        }}
        todo={selectedTodo || {
          id: 0,
          title: '',
          description: '',
          status: 'completed',
        } as unknown as Todo} 

        onDelete={async () => {
          if (selectedTodo) {
            await handleDeleteTodo(selectedTodo.id);;
          }
        }} 
        onSubmit={async (todoData) => {
          if (selectedTodo) {
            await handleUpdateTodo(todoData as Partial<TodoFormData>);
          } else {
            await handleCreateTodo(todoData as Omit<Todo, 'id'>);
          }
        }}/>

      {/* Show overlay loader when processing */}
      {isProcessing && <FullScreenLoader />}

      <Toast />
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  picker: {
    width: 200,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TodoListScreen;
