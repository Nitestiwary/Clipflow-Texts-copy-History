import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert } from 'react-native';

export const Card = ({ item, onCopy, onDelete, onPin, isPinned }) => {
  const renderIcon = () => {
    switch (item.type) {
      case 'link':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#EFF6FF' }]}>
            <Text style={{ fontSize: 18, color: '#3B82F6' }}>🌐</Text>
          </View>
        );
      case 'code':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#FEF3C7' }]}>
            <Text style={{ fontSize: 18, color: '#D97706' }}>🔑</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#F3F4F6' }]}>
            <Text style={{ fontSize: 18, color: '#4B5563' }}>📝</Text>
          </View>
        );
    }
  };

  const handleOpenLink = () => {
    const url = item.text.startsWith('http') ? item.text : `https://${item.text}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Invalid or unopenable link'));
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          {renderIcon()}
          <View style={styles.headerMeta}>
            <Text style={styles.typeBadge}>
              {item.type.toUpperCase()}
            </Text>
            {item.type === 'link' && (
              <Text style={styles.domainText} numberOfLines={1}>
                {item.domain}
              </Text>
            )}
            {item.type === 'text' && (
              <Text style={styles.statsText}>
                {item.stats.words} words • {item.stats.chars} chars
              </Text>
            )}
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onPin(item.id)} style={styles.actionButton}>
            <Text style={{ fontSize: 16 }}>{isPinned ? '📌' : '📍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.actionButton}>
            <Text style={{ fontSize: 16 }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentBody}>
        {item.type === 'code' ? (
          <Text style={styles.monospaceCode} numberOfLines={2}>
            {item.text}
          </Text>
        ) : (
          <Text style={styles.bodyText} numberOfLines={4}>
            {item.text}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryActionButton} onPress={() => onCopy(item.text)}>
          <Text style={styles.primaryActionText}>📋 Copy Snippet</Text>
        </TouchableOpacity>
        {item.type === 'link' && (
          <TouchableOpacity style={styles.secondaryActionButton} onPress={handleOpenLink}>
            <Text style={styles.secondaryActionText}>🌐 Open Link</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerMeta: {
    flex: 1,
  },
  typeBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  domainText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  statsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  contentBody: {
    marginBottom: 12,
  },
  monospaceCode: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    letterSpacing: 2,
  },
  bodyText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  primaryActionButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  secondaryActionButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  secondaryActionText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 12,
  },
});
