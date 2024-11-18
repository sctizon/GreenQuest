import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../../constants/constants';
import { SignUpModal } from '../../components/SignUpModal'; // Import the modal

interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Event {
  id: number;
  eventName: string;
  location: string;
  image: string;
  dateTime: string;
  maxSpots: number;
  participants: Participant[];
}

export default function HomeTab() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            console.log('Fetching events...');
            const response = await fetch(`${API_URL}/events`);
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const data: Event[] = await response.json();
            console.log('Fetched events data:', data);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
      };
    
      fetchEvents();
  }, []);

  const openModal = (event: Event) => {
    console.log("opening modal")
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    console.log("closing modal")
    setModalVisible(false); // Close the modal
    setSelectedEvent(null); // Clear the selected event
  };
  

  const handleSignUp = async (name: string, email: string, phone: string) => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`${API_URL}/participants/${selectedEvent.id}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      alert('Signed up successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Media Section */}
            <Image
                source={{
                    uri: `${API_URL}${item.image}`,
                }}
                onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
                style={styles.image}
            />

            {/* Content Section */}
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.eventName}</Text>
              <Text style={styles.subtitle}>{item.location}</Text>
              <Text style={styles.description}>
                Join us on {new Date(item.dateTime).toLocaleDateString()} at{' '}
                {new Date(item.dateTime).toLocaleTimeString()}. Only{' '}
                {item.maxSpots - item.participants.length} spots left!
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/events/${item.id}`)}
              >
                <Text style={styles.actionButtonText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openModal(item)}
              >
                <Text style={styles.actionButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Sign Up Modal */}
      {selectedEvent && (
        <SignUpModal
          visible={modalVisible}
          eventName={selectedEvent.eventName}
          onClose={closeModal}
          onSubmit={handleSignUp}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc', // Placeholder color in case image is missing
    resizeMode: 'cover',
},
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
