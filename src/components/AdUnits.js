import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

// Placeholder/Mock for AdMob integration using standard packages like react-native-google-mobile-ads
// In production, you would run: npm install react-native-google-mobile-ads

export const BannerAdUnit = ({ adUnitId }) => {
  // Safe fallback if package is not yet fully linked or in development environment
  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.adBadge}>AD</Text>
      <Text style={styles.adText}>Sponsored Content Panel</Text>
      <Text style={styles.adUnit}>{adUnitId || 'ca-app-pub-3940256099942544/6300978111'}</Text>
    </View>
  );
};

export const NativeAdUnit = ({ adUnitId }) => {
  return (
    <View style={styles.nativeContainer}>
      <View style={styles.nativeHeader}>
        <View style={styles.nativeBadgeWrapper}>
          <Text style={styles.adBadge}>AD</Text>
        </View>
        <View>
          <Text style={styles.nativeTitle}>Premium Utility Promotion</Text>
          <Text style={styles.nativeSubtitle}>Upgrade your workflow securely</Text>
        </View>
      </View>
      <Text style={styles.nativeBody}>
        Get high-speed offline capabilities and cloud-sync backups with our optional upgrade tier.
      </Text>
      <View style={styles.nativeButton}>
        <Text style={styles.nativeButtonText}>Install Now</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  adBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#047857',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
    alignSelf: 'center',
  },
  adText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  adUnit: {
    fontSize: 9,
    color: '#9CA3AF',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  nativeContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  nativeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nativeBadgeWrapper: {
    marginRight: 10,
  },
  nativeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  nativeSubtitle: {
    fontSize: 11,
    color: '#6B7280',
  },
  nativeBody: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 12,
  },
  nativeButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  nativeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
