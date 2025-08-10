import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Album } from '../types';
import { Colors } from '../constants/Colors';

interface AlbumCardProps {
  album: Album;
  onTap?: () => void;
  showPurchaseButton?: boolean;
  onPurchase?: () => void;
  isPurchased?: boolean;
  isDownloaded?: boolean;
  onDownload?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onTap,
  showPurchaseButton = true,
  onPurchase,
  isPurchased = false,
  isDownloaded = false,
  onDownload,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const formatDate = (date: Date): string => {
    const now = new Date();
    const difference = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (difference === 0) return 'Today';
    if (difference === 1) return 'Yesterday';
    if (difference < 7) return `${difference}d ago`;
    if (difference < 30) return `${Math.floor(difference / 7)}w ago`;
    return `${Math.floor(difference / 30)}m ago`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onTap}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: album.coverImageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        {isPurchased && (
          <View style={[styles.purchasedBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
          </View>
        )}
        <View style={styles.genreBadge}>
          <Text style={[styles.genreText, { color: colors.onPrimary }]}>
            {album.genre}
          </Text>
        </View>
        {!isPurchased && (
          <View style={[styles.priceBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.priceText, { color: colors.onPrimary }]}>
              ${album.price.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colors.onSurface }]}
          numberOfLines={1}
        >
          {album.title}
        </Text>
        <Text
          style={[styles.artist, { color: colors.onSurfaceVariant }]}
          numberOfLines={1}
        >
          {album.artistName}
        </Text>
        
        <View style={styles.metadata}>
          <Ionicons
            name="musical-notes"
            size={14}
            color={colors.onSurfaceVariant}
          />
          <Text style={[styles.trackCount, { color: colors.onSurfaceVariant }]}>
            {album.tracks.length} tracks
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons
              name="time"
              size={12}
              color={colors.onSurfaceVariant}
            />
            <Text style={[styles.date, { color: colors.onSurfaceVariant }]}>
              {formatDate(album.createdAt)}
            </Text>
          </View>
        </View>
        
        {showPurchaseButton && !isPurchased && (
          <TouchableOpacity
            style={[styles.purchaseButton, { backgroundColor: colors.primary }]}
            onPress={onPurchase}
            activeOpacity={0.8}
          >
            <Ionicons name="cart" size={16} color={colors.onPrimary} />
            <Text style={[styles.purchaseButtonText, { color: colors.onPrimary }]}>
              Buy Now
            </Text>
          </TouchableOpacity>
        )}
        
        {isPurchased && (
          <View style={styles.ownedContainer}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            <Text style={[styles.ownedText, { color: colors.primary }]}>
              Owned
            </Text>
            {onDownload && !isDownloaded && (
              <TouchableOpacity
                style={[styles.downloadButton, { backgroundColor: colors.tertiary }]}
                onPress={onDownload}
                activeOpacity={0.8}
              >
                <Ionicons name="download" size={16} color={colors.onTertiary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 8,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  purchasedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    marginLeft: 2,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  purchaseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  ownedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ownedText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    flex: 1,
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlbumCard;