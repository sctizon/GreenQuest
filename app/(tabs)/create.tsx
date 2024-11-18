import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../../constants/constants';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import default styles for react-datepicker
import * as ImagePicker from 'expo-image-picker';

export default function CreateEventTab() {
  const router = useRouter();
  const [creatorName, setCreatorName] = useState('');
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [dateTime, setDateTime] = useState(new Date()); // Unified date and time picker
  const [maxSpots, setMaxSpots] = useState('');
  const [contact, setContact] = useState('');

  const onDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setDateTime(selectedDate); // Only update if selectedDate is not null
    }
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri); // Access the `uri` from the `assets` array
    }
  };  

  const createEvent = async () => {
    if (!creatorName || !eventName || !location || !dateTime || !maxSpots || !contact) {
        Alert.alert('Error', 'All fields are required');
        return;
    }
  
    const formData = new FormData();
    formData.append('creatorName', creatorName);
    formData.append('eventName', eventName);
    formData.append('location', location);
    formData.append('dateTime', new Date(dateTime).toISOString());
    formData.append('maxSpots', maxSpots);
    formData.append('contact', contact);

    if (image) {
        // Convert the image to a blob-compatible object
        const fileName = image.split('/').pop() || 'image.jpg'; // Extract the file name from the URI
        const fileType = fileName.split('.').pop() || 'jpeg'; // Extract the file type (extension)
    
        // Convert the image URI to a Blob
        const response = await fetch(image);
        const blob = await response.blob();

        formData.append('image', blob, fileName); // Append blob with filename
    }

    try {
        const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json', // Accept header for JSON response
          },
        });
    
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create event');
        }
    
        Alert.alert('Success', 'Event created successfully!');
        router.push('/home');
    } catch (err: any) {
        console.error(err);
        Alert.alert('Error', `Failed to create event: ${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Creator Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={creatorName}
        onChangeText={setCreatorName}
      />

      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the event name"
        value={eventName}
        onChangeText={setEventName}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the location"
        value={location}
        onChangeText={setLocation}
      />

<       Text style={styles.label}>Image</Text>
        {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Text style={styles.imagePickerText}>Pick an Image</Text>
            </TouchableOpacity>
        )}

      <Text style={styles.label}>Date & Time</Text>
      <DatePicker
            selected={dateTime}
            onChange={(date: Date | null) => onDateChange(date)} // Pass the handler
            showTimeSelect
            dateFormat="Pp"
            className="react-datepicker-input"
        />


      <Text style={styles.label}>Max Spots</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the maximum number of spots"
        value={maxSpots}
        onChangeText={setMaxSpots}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Contact Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your contact info"
        value={contact}
        onChangeText={setContact}
      />

      <Button title="Create Event" onPress={createEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 8,
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 8,
      fontSize: 16,
      marginBottom: 12,
    },
    imagePicker: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9f9f9',
      marginBottom: 12,
    },
    imagePickerText: {
      color: '#007BFF',
      fontSize: 16,
    },
    imagePreview: {
      width: '100%',
      height: 200,
      marginBottom: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
    },
  });
  