import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { User, Album } from '../types';
import StorageService from '../services/StorageService';

const ProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAlbums, setUserAlbums] = useState<Album[]>([]);
  const [purchasedAlbums, setPurchasedAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await StorageService.getCurrentUser();
      const allAlbums = await StorageService.getAlbums();
      const purchased = await StorageService.getUserPurchasedAlbums();

      setCurrentUser(user);
      setUserAlbums(allAlbums.filter(album => album.artistId === user?.id));
      setPurchasedAlbums(purchased);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArtistMode = async () => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      isArtist: !currentUser.isArtist,
    };

    await StorageService.saveUser(updatedUser);
    setCurrentUser(updatedUser);

    Alert.alert(
      'Success',
      updatedUser.isArtist
        ? 'Artist mode enabled! You can now upload music.'
        : 'Artist mode disabled.'
    );
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.statValue, { color: colors.onSurface }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.onSurfaceVariant }]}>{title}</Text>
    </View>
  );

  const SettingItem: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    iconColor?: string;
  }> = ({ icon, title, subtitle, onPress, rightElement, iconColor }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Ionicons name={icon} size={24} color={iconColor || colors.primary} />
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.onSurface }]}>{title}</Text>
        <Text style={[styles.settingSubtitle, { color: colors.onSurfaceVariant }]}>
          {subtitle}
        </Text>
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.profileHeader}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{currentUser?.name || 'User'}</Text>
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>
                  {currentUser?.isArtist ? '🎤 Artist' : '🎵 Music Lover'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Stats */}
          <View style={styles.statsContainer}>
            <StatCard
              title="Purchased"
              value={purchasedAlbums.length.toString()}
              icon="library"
              color={colors.primary}
            />
            <StatCard
              title={currentUser?.isArtist ? 'Uploaded' : 'Downloaded'}
              value={
                currentUser?.isArtist
                  ? userAlbums.length.toString()
                  : (currentUser?.downloadedAlbums.length || 0).toString()
              }
              icon={currentUser?.isArtist ? 'cloud-upload' : 'download'}
              color={colors.secondary}
            />
          </View>

          {/* Settings */}
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Settings
          </Text>

          <View style={styles.settingsCard}>
            <SettingItem
              icon={currentUser?.isArtist ? 'mic' : 'person-add'}
              title={currentUser?.isArtist ? 'Disable Artist Mode' : 'Enable Artist Mode'}
              subtitle={
                currentUser?.isArtist
                  ? 'Switch back to music listener mode'
                  : 'Start uploading and selling your music'
              }
              rightElement={
                <Switch
                  value={currentUser?.isArtist || false}
                  onValueChange={toggleArtistMode}
                  trackColor={{ false: colors.outline, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              }
              iconColor={colors.primary}
            />

            <View style={[styles.divider, { backgroundColor: colors.outline }]} />

            <SettingItem
              icon="musical-note"
              title="Audio Quality"
              subtitle="High (320 kbps)"
              onPress={() => Alert.alert('Coming Soon', 'Audio quality settings coming soon!')}
              iconColor={colors.secondary}
            />

            <View style={[styles.divider, { backgroundColor: colors.outline }]} />

            <SettingItem
              icon="download"
              title="Auto Download"
              subtitle="Download purchased music automatically"
              rightElement={
                <Switch
                  value={true}
                  onValueChange={() => Alert.alert('Coming Soon', 'Auto download settings coming soon!')}
                  trackColor={{ false: colors.outline, true: colors.tertiary }}
                  thumbColor={colors.surface}
                />
              }
              iconColor={colors.tertiary}
            />

            <View style={[styles.divider, { backgroundColor: colors.outline }]} />

            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle="New releases and recommendations"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
              iconColor={colors.error}
            />

            <View style={[styles.divider, { backgroundColor: colors.outline }]} />

            <SettingItem
              icon="color-palette"
              title="Theme"
              subtitle="System default"
              onPress={() => Alert.alert('Coming Soon', 'Theme settings coming soon!')}
              iconColor={colors.onSurfaceVariant}
            />
          </View>

          {/* Artist Dashboard */}
          {currentUser?.isArtist && (
            <>
              <View style={[styles.artistDashboard, { backgroundColor: colors.primaryContainer }]}>
                <View style={styles.dashboardHeader}>
                  <Ionicons name="trending-up" size={24} color={colors.primary} />
                  <Text style={[styles.dashboardTitle, { color: colors.primary }]}>
                    Artist Dashboard
                  </Text>
                </View>
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    style={[styles.quickAction, { backgroundColor: colors.surface }]}
                    onPress={() => Alert.alert('Info', 'Navigate to upload screen from bottom nav!')}
                  >
                    <Ionicons name="cloud-upload" size={20} color={colors.primary} />
                    <Text style={[styles.quickActionText, { color: colors.onSurface }]}>
                      Upload
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickAction, { backgroundColor: colors.surface }]}
                    onPress={() => Alert.alert('Coming Soon', 'Analytics feature coming soon!')}
                  >
                    <Ionicons name="analytics" size={20} color={colors.primary} />
                    <Text style={[styles.quickActionText, { color: colors.onSurface }]}>
                      Analytics
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickAction, { backgroundColor: colors.surface }]}
                    onPress={() => Alert.alert('Coming Soon', 'Earnings dashboard coming soon!')}
                  >
                    <Ionicons name="wallet" size={20} color={colors.primary} />
                    <Text style={[styles.quickActionText, { color: colors.onSurface }]}>
                      Earnings
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* About */}
          <View style={[styles.aboutCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.aboutTitle, { color: colors.onSurface }]}>
              About MelodyMarket
            </Text>
            <Text style={[styles.aboutText, { color: colors.onSurfaceVariant }]}>
              A revolutionary music marketplace where artists can share their music and fans can
              discover and support their favorite musicians. Built with love for the music community.
            </Text>
            <Text style={[styles.versionText, { color: colors.onSurfaceVariant }]}>
              Version 1.0.0
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    paddingTop: 40,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingsCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
  artistDashboard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  aboutCard: {
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 12,
  },
});

export default ProfileScreen;