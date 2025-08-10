import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../constants/Colors';
import { Album, Track, User } from '../types';
import StorageService from '../services/StorageService';

const ArtistUploadScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('Pop');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const genres = [
    'Pop', 'Rock', 'Jazz', 'Electronic', 'Hip Hop', 'R&B', 'Country',
    'Classical', 'Blues', 'Folk', 'Reggae', 'EDM', 'Acoustic'
  ];

  const sampleImages = [
    'https://picsum.photos/400/400?random=10',
    'https://picsum.photos/400/400?random=11',
    'https://picsum.photos/400/400?random=12',
    'https://picsum.photos/400/400?random=13',
    'https://picsum.photos/400/400?random=14',
    'https://picsum.photos/400/400?random=15',
  ];

  useEffect(() => {
    loadCurrentUser();
    setSelectedImageUri(sampleImages[0]);
  }, []);

  const loadCurrentUser = async () => {
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);
  };

  const selectCoverImage = () => {
    Alert.alert(
      'Choose Album Cover',
      'Select from sample images or take a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sample Images', onPress: showSampleImages },
        { text: 'Camera/Gallery', onPress: pickImage },
      ]
    );
  };

  const showSampleImages = () => {
    Alert.alert(
      'Sample Images',
      'Choose a sample image',
      sampleImages.map((uri, index) => ({
        text: `Image ${index + 1}`,
        onPress: () => setSelectedImageUri(uri),
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const addTrack = () => {
    Alert.prompt(
      'Add Track',
      'Enter track title',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (trackTitle) => {
            if (trackTitle && trackTitle.trim()) {
              const newTrack: Track = {
                id: `track_${Date.now()}`,
                title: trackTitle.trim(),
                artist: currentUser?.name || 'Unknown Artist',
                artistId: currentUser?.id || 'unknown',
                duration: '3:30', // Default duration
                albumId: 'temp_album',
                trackNumber: tracks.length + 1,
                price: 0,
                isFree: true,
                streamCount: 0,
                purchaseCount: 0,
                genre,
                createdAt: new Date(),
                tags: [],
                isDownloaded: false,
              };
              setTracks([...tracks, newTrack]);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const removeTrack = (index: number) => {
    const updatedTracks = tracks.filter((_, i) => i !== index);
    setTracks(updatedTracks);
  };

  const uploadAlbum = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an album title');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Error', 'Please enter a price');
      return;
    }

    if (tracks.length === 0) {
      Alert.alert('Error', 'Please add at least one track');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const albumId = Date.now().toString();
      const album: Album = {
        id: albumId,
        title: title.trim(),
        artistId: currentUser.id,
        artistName: currentUser.name,
        price: parseFloat(price),
        coverImageUrl: selectedImageUri || sampleImages[0],
        tracks: tracks.map(track => ({
          ...track,
          albumId,
        })),
        createdAt: new Date(),
        genre,
        description: description.trim(),
        isDownloaded: false,
      };

      await StorageService.saveAlbum(album);

      Alert.alert(
        'Success',
        `Album "${album.title}" uploaded successfully!`,
        [{ text: 'OK', onPress: clearForm }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to upload album. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setGenre('Pop');
    setSelectedImageUri(sampleImages[0]);
    setTracks([]);
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.onBackground }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.onBackground }]}>
            Create Album 🎤
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant }]}>
            Share your creativity with the world
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.publishButton, { backgroundColor: colors.primary }]}
          onPress={uploadAlbum}
          disabled={isUploading}
        >
          <Text style={[styles.publishButtonText, { color: colors.onPrimary }]}>
            {isUploading ? 'Publishing...' : 'Publish'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.onPrimaryContainer }]}>
              Fill in the details below to create your album. All fields marked with * are required.
            </Text>
          </View>

          {/* Album Cover */}
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Album Cover *
          </Text>
          <View style={styles.coverSection}>
            <TouchableOpacity
              style={[styles.coverImageContainer, { borderColor: colors.primary }]}
              onPress={selectCoverImage}
            >
              {selectedImageUri ? (
                <Image source={{ uri: selectedImageUri }} style={styles.coverImage} />
              ) : (
                <Ionicons name="add-circle" size={40} color={colors.onSurfaceVariant} />
              )}
            </TouchableOpacity>
            <View style={styles.coverInfo}>
              <Text style={[styles.coverTitle, { color: colors.onBackground }]}>
                Choose a cover image
              </Text>
              <Text style={[styles.coverDescription, { color: colors.onSurfaceVariant }]}>
                Select an eye-catching image that represents your album.
              </Text>
              <TouchableOpacity
                style={[styles.changeImageButton, { borderColor: colors.primary }]}
                onPress={selectCoverImage}
              >
                <Ionicons name="image" size={18} color={colors.primary} />
                <Text style={[styles.changeImageText, { color: colors.primary }]}>
                  {selectedImageUri ? 'Change Image' : 'Select Image'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Album Title */}
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Album Title *
          </Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.surface, color: colors.onSurface }]}
            placeholder="Enter album title"
            placeholderTextColor={colors.onSurfaceVariant}
            value={title}
            onChangeText={setTitle}
          />

          {/* Genre */}
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Genre *
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreContainer}>
            {genres.map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genreChip,
                  {
                    backgroundColor: genre === g ? colors.primary : colors.surface,
                    borderColor: genre === g ? colors.primary : colors.outline,
                  },
                ]}
                onPress={() => setGenre(g)}
              >
                <Text
                  style={[
                    styles.genreText,
                    { color: genre === g ? colors.onPrimary : colors.onSurface },
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Price */}
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Price (USD) *
          </Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.surface, color: colors.onSurface }]}
            placeholder="9.99"
            placeholderTextColor={colors.onSurfaceVariant}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Description
          </Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.surface, color: colors.onSurface }]}
            placeholder="Describe your album..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* Tracks */}
          <View style={styles.tracksHeader}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
              Tracks ({tracks.length}) *
            </Text>
            <TouchableOpacity
              style={[styles.addTrackButton, { backgroundColor: colors.primary }]}
              onPress={addTrack}
            >
              <Ionicons name="add" size={16} color={colors.onPrimary} />
              <Text style={[styles.addTrackText, { color: colors.onPrimary }]}>
                Add Track
              </Text>
            </TouchableOpacity>
          </View>

          {tracks.length === 0 ? (
            <View style={[styles.emptyTracks, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
              <Ionicons name="musical-notes-outline" size={48} color={colors.onSurfaceVariant} />
              <Text style={[styles.emptyTracksTitle, { color: colors.onSurfaceVariant }]}>
                No tracks added yet
              </Text>
              <Text style={[styles.emptyTracksSubtitle, { color: colors.onSurfaceVariant }]}>
                Add at least one track to create your album
              </Text>
            </View>
          ) : (
            <View style={styles.tracksList}>
              {tracks.map((track, index) => (
                <View key={track.id} style={[styles.trackItem, { backgroundColor: colors.surface }]}>
                  <View style={[styles.trackNumber, { backgroundColor: colors.primaryContainer }]}>
                    <Text style={[styles.trackNumberText, { color: colors.onPrimaryContainer }]}>
                      {track.trackNumber}
                    </Text>
                  </View>
                  <View style={styles.trackInfo}>
                    <Text style={[styles.trackTitle, { color: colors.onSurface }]}>
                      {track.title}
                    </Text>
                    <Text style={[styles.trackDuration, { color: colors.onSurfaceVariant }]}>
                      Duration: {track.duration}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeTrackButton}
                    onPress={() => removeTrack(index)}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Upload Button */}
          <TouchableOpacity
            style={[
              styles.uploadButton,
              {
                backgroundColor: colors.primary,
                opacity: isUploading ? 0.6 : 1,
              },
            ]}
            onPress={uploadAlbum}
            disabled={isUploading}
          >
            <Ionicons name="cloud-upload" size={20} color={colors.onPrimary} />
            <Text style={[styles.uploadButtonText, { color: colors.onPrimary }]}>
              {isUploading ? 'Publishing Album...' : 'Publish Album'}
            </Text>
          </TouchableOpacity>

          {/* Guidelines */}
          <View style={[styles.guidelines, { backgroundColor: colors.surfaceVariant }]}>
            <View style={styles.guidelinesHeader}>
              <Ionicons name="information-circle" size={16} color={colors.onSurfaceVariant} />
              <Text style={[styles.guidelinesTitle, { color: colors.onSurfaceVariant }]}>
                Publishing Guidelines
              </Text>
            </View>
            <Text style={[styles.guidelinesText, { color: colors.onSurfaceVariant }]}>
              • Ensure you own all rights to the music you upload{'\n'}
              • Albums will be reviewed before going live{'\n'}
              • You can edit pricing and details after publishing{'\n'}
              • Earnings are available for withdrawal after 24 hours
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonText: {
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  coverSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  coverImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  coverInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  coverTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  coverDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  changeImageText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  genreContainer: {
    marginBottom: 16,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  genreText: {
    fontSize: 14,
  },
  tracksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addTrackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addTrackText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  emptyTracks: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTracksTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  emptyTracksSubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  tracksList: {
    marginBottom: 24,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  trackNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trackNumberText: {
    fontWeight: 'bold',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  trackDuration: {
    fontSize: 14,
    marginTop: 2,
  },
  removeTrackButton: {
    padding: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  guidelines: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  guidelinesText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default ArtistUploadScreen;