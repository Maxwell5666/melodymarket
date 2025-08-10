import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Album, User, Purchase } from '../types';
import StorageService from '../services/StorageService';
import AlbumCard from '../components/AlbumCard';

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const genres = ['All', 'Electronic', 'Acoustic', 'EDM', 'Jazz', 'Rock'];

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await loadData();
    setIsLoading(false);
  };

  const loadData = async () => {
    try {
      const albumsData = await StorageService.getAlbums();
      const userData = await StorageService.getCurrentUser();
      
      if (!userData) {
        await StorageService.setCurrentUser('Music Lover', 'user@example.com');
        const newUser = await StorageService.getCurrentUser();
        setCurrentUser(newUser);
      } else {
        setCurrentUser(userData);
      }
      
      setAlbums(albumsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredAlbums = selectedGenre === 'All' 
    ? albums 
    : albums.filter(album => album.genre === selectedGenre);

  const navigateToAlbumDetail = (album: Album) => {
    // TODO: Navigate to album detail screen
    Alert.alert('Album Detail', `Opening ${album.title} by ${album.artistName}`);
  };

  const purchaseAlbum = async (album: Album) => {
    Alert.alert(
      'Purchase Album',
      `Purchase "${album.title}" for $${album.price.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: async () => {
            if (currentUser) {
              const purchase: Purchase = {
                id: Date.now().toString(),
                userId: currentUser.id,
                albumId: album.id,
                purchaseDate: new Date(),
                price: album.price,
              };
              
              await StorageService.savePurchase(purchase);
              await loadData();
              
              Alert.alert('Success', `Successfully purchased "${album.title}"!`);
            }
          },
        },
      ]
    );
  };

  const renderGenreFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.genreContainer}
      contentContainerStyle={styles.genreContent}
    >
      {genres.map((genre) => (
        <TouchableOpacity
          key={genre}
          style={[
            styles.genreChip,
            {
              backgroundColor: selectedGenre === genre ? colors.primary : colors.surface,
              borderColor: selectedGenre === genre ? colors.primary : colors.outline,
            },
          ]}
          onPress={() => setSelectedGenre(genre)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.genreText,
              {
                color: selectedGenre === genre ? colors.onPrimary : colors.onSurface,
                fontWeight: selectedGenre === genre ? '600' : 'normal',
              },
            ]}
          >
            {genre}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFeaturedSection = () => {
    if (filteredAlbums.length === 0) return null;
    
    const featuredAlbum = filteredAlbums[0];
    
    return (
      <View style={styles.featuredSection}>
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
          Featured Album
        </Text>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.featuredCard}
        >
          <View style={styles.featuredContent}>
            <View style={styles.featuredText}>
              <Text style={styles.featuredTitle} numberOfLines={2}>
                {featuredAlbum.title}
              </Text>
              <Text style={styles.featuredArtist}>
                by {featuredAlbum.artistName}
              </Text>
              <TouchableOpacity
                style={styles.listenButton}
                onPress={() => navigateToAlbumDetail(featuredAlbum)}
                activeOpacity={0.8}
              >
                <Text style={[styles.listenButtonText, { color: colors.primary }]}>
                  Listen Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderAlbumGrid = () => (
    <View style={styles.albumGrid}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
          All Albums
        </Text>
        <TouchableOpacity onPress={() => setSelectedGenre('All')}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredAlbums}
        renderItem={({ item }) => (
          <AlbumCard
            album={item}
            onTap={() => navigateToAlbumDetail(item)}
            onPurchase={() => purchaseAlbum(item)}
            isPurchased={currentUser?.purchasedAlbums.includes(item.id) ?? false}
            isDownloaded={currentUser?.downloadedAlbums.includes(item.id) ?? false}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.albumList}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.onBackground }]}>
          Loading amazing music...
        </Text>
      </View>
    );
  }

  if (filteredAlbums.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="musical-notes-outline" size={80} color={colors.onSurfaceVariant} />
          <Text style={[styles.emptyTitle, { color: colors.onBackground }]}>
            No music found
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
            Try selecting a different genre or check back later
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.onBackground }]}>
              Discover Music 🎵
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant }]}>
              {filteredAlbums.length} albums available
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="search" size={24} color={colors.onBackground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={24} color={colors.onBackground} />
            </TouchableOpacity>
          </View>
        </View>

        {renderFeaturedSection()}
        {renderGenreFilter()}
        {renderAlbumGrid()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  featuredSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  featuredCard: {
    height: 200,
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredText: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredArtist: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  listenButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  listenButtonText: {
    fontWeight: '600',
  },
  genreContainer: {
    marginBottom: 16,
  },
  genreContent: {
    paddingHorizontal: 16,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  albumGrid: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  albumList: {
    paddingBottom: 20,
  },
});

export default HomeScreen;