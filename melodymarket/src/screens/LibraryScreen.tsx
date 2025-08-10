import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Album } from '../types';
import StorageService from '../services/StorageService';
import AlbumCard from '../components/AlbumCard';

const Tab = createMaterialTopTabNavigator();

const LibraryScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const DownloadedTab = () => {
    const [downloadedAlbums, setDownloadedAlbums] = useState<Album[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
      loadDownloadedAlbums();
    }, []);

    const loadDownloadedAlbums = async () => {
      try {
        const albums = await StorageService.getUserDownloadedAlbums();
        setDownloadedAlbums(albums);
      } catch (error) {
        console.error('Error loading downloaded albums:', error);
      }
    };

    const onRefresh = async () => {
      setRefreshing(true);
      await loadDownloadedAlbums();
      setRefreshing(false);
    };

    const navigateToAlbumDetail = (album: Album) => {
      Alert.alert('Album Detail', `Opening ${album.title} by ${album.artistName}`);
    };

    if (downloadedAlbums.length === 0) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="download-outline" size={80} color={colors.onSurfaceVariant} />
          <Text style={[styles.emptyTitle, { color: colors.onBackground }]}>
            No downloaded albums
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
            Purchase some albums to start building your collection
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={downloadedAlbums}
        renderItem={({ item }) => (
          <AlbumCard
            album={item}
            onTap={() => navigateToAlbumDetail(item)}
            isPurchased={true}
            isDownloaded={true}
            showPurchaseButton={false}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.albumList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  const PurchasedTab = () => {
    const [purchasedAlbums, setPurchasedAlbums] = useState<Album[]>([]);
    const [downloadedAlbums, setDownloadedAlbums] = useState<Album[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
      loadPurchasedAlbums();
    }, []);

    const loadPurchasedAlbums = async () => {
      try {
        const purchased = await StorageService.getUserPurchasedAlbums();
        const downloaded = await StorageService.getUserDownloadedAlbums();
        setPurchasedAlbums(purchased);
        setDownloadedAlbums(downloaded);
      } catch (error) {
        console.error('Error loading purchased albums:', error);
      }
    };

    const onRefresh = async () => {
      setRefreshing(true);
      await loadPurchasedAlbums();
      setRefreshing(false);
    };

    const downloadAlbum = async (album: Album) => {
      Alert.alert(
        'Download Album',
        `Download "${album.title}" for offline listening?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              try {
                await StorageService.markAlbumAsDownloaded(album.id);
                await loadPurchasedAlbums();
                Alert.alert('Success', `"${album.title}" downloaded successfully!`);
              } catch (error) {
                Alert.alert('Error', 'Failed to download album');
              }
            },
          },
        ]
      );
    };

    const navigateToAlbumDetail = (album: Album) => {
      Alert.alert('Album Detail', `Opening ${album.title} by ${album.artistName}`);
    };

    if (purchasedAlbums.length === 0) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="library-outline" size={80} color={colors.onSurfaceVariant} />
          <Text style={[styles.emptyTitle, { color: colors.onBackground }]}>
            No purchased albums
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
            Purchase some albums to start building your collection
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={purchasedAlbums}
        renderItem={({ item }) => (
          <AlbumCard
            album={item}
            onTap={() => navigateToAlbumDetail(item)}
            isPurchased={true}
            isDownloaded={downloadedAlbums.some(downloaded => downloaded.id === item.id)}
            showPurchaseButton={false}
            onDownload={
              downloadedAlbums.some(downloaded => downloaded.id === item.id)
                ? undefined
                : () => downloadAlbum(item)
            }
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.albumList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.onBackground }]}>
            My Library 📚
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant }]}>
            Your music collection
          </Text>
        </View>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.onSurfaceVariant,
          tabBarIndicatorStyle: { backgroundColor: colors.primary },
          tabBarStyle: { backgroundColor: colors.surface },
          tabBarLabelStyle: { fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="Downloaded"
          component={DownloadedTab}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="download" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Purchased"
          component={PurchasedTab}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="library" size={20} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  albumList: {
    padding: 16,
  },
});

export default LibraryScreen;