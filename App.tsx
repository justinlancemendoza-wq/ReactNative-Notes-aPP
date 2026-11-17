
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Load saved notes when app opens
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('myNotes');

      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.log('Error loading notes:', error);
    }
  };

  // Save notes to storage
  const saveNotes = async (newNotes: string[]) => {
    try {
      await AsyncStorage.setItem(
        'myNotes',
        JSON.stringify(newNotes),
      );
      setNotes(newNotes);
    } catch (error) {
      console.log('Error saving notes:', error);
    }
  };

  // Add or update a note
  const addNote = () => {
    if (note.trim() === '') {
      return;
    }

    let newNotes = [...notes];

    if (editIndex !== null) {
      newNotes[editIndex] = note;
      setEditIndex(null);
    } else {
      newNotes.push(note);
    }

    saveNotes(newNotes);
    setNote('');
  };

  // Edit a note
  const editNote = (index: number) => {
    setNote(notes[index]);
    setEditIndex(index);
  };

  // Delete a note
  const deleteNote = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index);
    saveNotes(newNotes);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your note"
        value={note}
        onChangeText={setNote}
      />

      <Button
        title={editIndex !== null ? 'Update Note' : 'Add Note'}
        onPress={addNote}
      />

      <Text style={styles.subtitle}>Saved Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteText}>{item}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => editNote(index)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteNote(index)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
  },
  noteItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
  },
  noteText: {
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  edit: {
    color: 'blue',
    fontWeight: 'bold',
  },
  delete: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default App;
