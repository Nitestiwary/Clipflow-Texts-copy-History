import React, { useState, useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Switch, 
  Clipboard, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  StatusBar 
} from 'react-native';
import { getHistory, saveHistory, classifyText } from './src/services/storage';
import { Card } from './src/components/Card';
import { FilterTags } from './src/components/FilterTags';
import { FloatingWidget } from './src/components/FloatingWidget';
import { BannerAdUnit, NativeAdUnit } from './src/components/AdUnits';

export default function App() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isWidgetEnabled, setIsWidgetEnabled] = useState(false);
  const [pinnedIds, setPinnedIds] = useState([]);
  
  // Track last clipboard check value to avoid duplicate imports
  const lastCopiedText = useRef('');

  useEffect(() => {
    loadData();
    
    // Clipboard listener setup
    const interval = setInterval(async () => {
      try {
        const text = await Clipboard.getString();
        if (text && text !== lastCopiedText.current) {
          lastCopiedText.current = text;
          addNewCopy(text);
        }
      } catch (e) {
        console.error('Clipboard reading failed', e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const list = await getHistory();
    setHistory(list);
  };

  const addNewCopy = async (text) => {
    const exists = history.some(item => item.text === text);
    if (exists) return; // Prevent duplicates in list

    const classification = classifyText(text);
    const newEntry = {
      id: Date.now().toString(),
      ...classification,
      timestamp: new Date().toISOString()
    };

    const updated = [newEntry, ...history];
    setHistory(updated);
    await saveHistory(updated);
  };

  const handleCopy = (text) => {
    Clipboard.setString(text);
    lastCopiedText.current = text;
    Alert.alert('Copied!', 'Text has been copied to system clipboard.');
  };

  const handleDelete = async (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    await saveHistory(updated);
  };

  const handlePin = (id) => {
    if (pinnedIds.includes(id)) {
      setPinnedIds(pinnedIds.filter(item => item !== id));
    } else {
      setPinnedIds([...pinnedIds, id]);
    }
  };

  // Quick stats extraction
  const linkCount = history.filter(h => h.type === 'link').length;
  const codeCount = history.filter(h => h.type === 'code').length;

  // Search & Tag Filter Logic
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.domain && item.domain.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'pinned') return pinnedIds.includes(item.id);
    return item.type === activeCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header Info Panel */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>Clipflow</Text>
          <Text style={styles.brandSubtitle}>High-Performance Copy Engine</Text>
        </View>
        <View style={styles.privacyBadge}>
          <Text style={styles.privacyText}>🛡️ Local Core</Text>
        </View>
      </View>

      {/* Dynamic System Stats Section */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{history.length}</Text>
          <Text style={styles.statLabel}>Total Snips</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: '#3B82F6' }]}>{linkCount}</Text>
          <Text style={styles.statLabel}>Links Cached</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: '#D97706' }]}>{codeCount}</Text>
          <Text style={styles.statLabel}>OTP & Codes</Text>
        </View>
      </View>

      {/* System Alert / Overlay Permission Toggle */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.toggleLabel}>Enable Floating Sticky Window</Text>
          <Text style={styles.toggleDesc}>Interactive draggable bubble overlay</Text>
        </View>
        <Switch
          value={isWidgetEnabled}
          onValueChange={(val) => {
            setIsWidgetEnabled(val);
            if (val) {
              Alert.alert(
                'Draw Over Other Apps',
                'This simulates SYSTEM_ALERT_WINDOW permissions. The interactive drag & snap widget is now active.'
              );
            }
          }}
          trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
          thumbColor={isWidgetEnabled ? '#2563EB' : '#9CA3AF'}
        />
      </View>

      {/* Sticky Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search snippets, domains or codes..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Horizontal categories */}
      <FilterTags selected={activeCategory} onSelect={setActiveCategory} />

      {/* Banner Ad Placement */}
      <BannerAdUnit adUnitId="ca-app-pub-3940256099942544/6300978111" />

      {/* Clipboard cards list */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <View>
            <Card 
              item={item} 
              onCopy={handleCopy} 
              onDelete={handleDelete} 
              onPin={handlePin}
              isPinned={pinnedIds.includes(item.id)}
            />
            {/* Native Ad Placement in-between list items (e.g. after every 3rd card) */}
            {index > 0 && index % 3 === 0 && (
              <NativeAdUnit adUnitId="ca-app-pub-3940256099942544/2247696110" />
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>Your Clipboard is Empty</Text>
            <Text style={styles.emptyDesc}>Copy any text or link. It will automatically populate here in high-fidelity cards.</Text>
          </View>
        }
      />

      {/* Floating System Overlay Widget */}
      {isWidgetEnabled && (
        <FloatingWidget 
          lastFiveItems={history.slice(0, 5)} 
          onCopyItem={handleCopy}
          onCloseWidget={() => setIsWidgetEnabled(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  privacyBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  privacyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#03543F',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  toggleDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#111827',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginTop: 8,
    lineHeight: 18,
  },
});
