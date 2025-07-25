import { useSession } from "@/contexts/ctx";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import default styles for react-datepicker
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../../constants/constants";

export default function CreateEventTab() {
  const router = useRouter();
  const { session } = useSession(); // Use session to get logged-in user info
  const [creatorName, setCreatorName] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [dateTime, setDateTime] = useState(new Date()); // Unified date and time picker
  const [maxSpots, setMaxSpots] = useState("");
  const [contact, setContact] = useState("");
  const [userId, setUserId] = useState(0);

  // Automatically populate the creator name from the session
  useEffect(() => {
    // Safely access user name from session
    if (session && typeof session === "object" && "user" in session) {
      setCreatorName(session.user.fullName);
      setContact(session.user.email);
      setUserId(session.user.userId);
    }
    console.log(session);
  }, [session]);

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
    if (
      !creatorName ||
      !eventName ||
      !location ||
      !dateTime ||
      !maxSpots ||
      !contact ||
      !userId
    ) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("creatorName", creatorName);
    formData.append("eventName", eventName);
    formData.append("location", location);
    formData.append("dateTime", new Date(dateTime).toISOString());
    formData.append("maxSpots", maxSpots);
    formData.append("contact", contact);
    formData.append("userId", String(userId));

    if (image) {
      // Convert the image to a blob-compatible object
      const fileName = image.split("/").pop() || "image.jpg"; // Extract the file name from the URI
      const fileType = fileName.split(".").pop() || "jpeg"; // Extract the file type (extension)

      // Convert the image URI to a Blob
      const response = await fetch(image);
      const blob = await response.blob();

      formData.append("image", blob, fileName); // Append blob with filename
    }

    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json", // Accept header for JSON response
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create event");
      }

      Alert.alert("Success", "Event created successfully!");
      router.replace("/home");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", `Failed to create event: ${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>GreenQuest</Text>
      <View style={styles.card}>
        {/* Image Picker */}
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePlaceholder}>Pick an Image</Text>
          )}
        </TouchableOpacity>

        {/* Event Name */}
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={eventName}
          onChangeText={setEventName}
        />

        {/* Location */}
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        {/* Date & Time */}
        <View style={styles.row}>
          <Text style={styles.iconText}>🕒</Text>
          <DatePicker
            selected={dateTime}
            onChange={(date: Date | null) => onDateChange(date)}
            showTimeSelect
            dateFormat="Pp"
            className="react-datepicker-input"
          />
        </View>

        {/* Max Spots */}
        <View style={styles.row}>
          <Text style={styles.iconText}>👥</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of participants"
            value={maxSpots}
            onChangeText={setMaxSpots}
            keyboardType="numeric"
          />
        </View>

        {/* Create Event Button */}
        <TouchableOpacity onPress={createEvent} style={styles.button}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FFF0", // Light green background
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#2E7D32", // Dark green header text
  },
  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 20,
    marginRight: 8,
    color: "#4CAF50",
  },
  button: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
