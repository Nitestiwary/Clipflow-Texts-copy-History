import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const FilterTags = ({ selected, onSelect }) => {
  const categories = [
    { id: 'all', label: '⚡ All History' },
    { id: 'link', label: '🔗 Links & Domains' },
    { id: 'code', label: '🔑 Codes / OTP' },
    { id: 'text', label: '📝 Plain Text' },
    { id: 'pinned', label: '📌 Pinned Items' },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={[
              styles.tag,
              isActive ? styles.tagActive : styles.tagInactive
            ]}
          >
            <Text style={[
              styles.tagText,
              isActive ? styles.tagTextActive : styles.tagTextInactive
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contentContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tagInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
  tagTextInactive: {
    color: '#4B5563',
  },
});
