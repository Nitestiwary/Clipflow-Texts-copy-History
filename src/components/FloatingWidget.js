import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  PanResponder, 
  Dimensions, 
  StyleSheet 
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUBBLE_SIZE = 60;

export const FloatingWidget = ({ lastFiveItems, onCopyItem, onCloseWidget }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Animated values
  const pan = useRef(new Animated.ValueXY({ x: 16, y: SCREEN_HEIGHT - 180 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  // Snapping logic on touch release
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        scale.setValue(1.15);
      },
      onPanResponderMove: Animated.event([
        null, 
        { dx: pan.x, dy: pan.y }
      ], { useNativeDriver: false }),
      onPanResponderRelease: (e, gestureState) => {
        scale.setValue(1);
        const finalX = gestureState.moveX;
        
        // Target snapping coordinates (Left or Right wall edge)
        let snapX = 16; 
        if (finalX > SCREEN_WIDTH / 2) {
          snapX = SCREEN_WIDTH - BUBBLE_SIZE - 16;
        }

        Animated.spring(pan, {
          toValue: { x: snapX, y: Math.max(80, Math.min(gestureState.moveY, SCREEN_HEIGHT - 120)) },
          useNativeDriver: false,
          tension: 80,
          friction: 8,
        }).start();
      },
    })
  ).current;

  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setExpanded(false));
    } else {
      setExpanded(true);
      Animated.spring(menuAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  };

  const handleItemPress = (text) => {
    onCopyItem(text);
    toggleExpand();
  };

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      {/* Draggable Bubble */}
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: scale }
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity style={styles.bubbleTouch} onPress={toggleExpand}>
          <Text style={styles.bubbleText}>⚡</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Expanded Quick-View List Overlay (rendered when active) */}
      {expanded && (
        <Animated.View
          style={[
            styles.menuPanel,
            {
              top: Animated.add(pan.y, BUBBLE_SIZE + 8),
              left: pan.x.interpolate({
                inputRange: [0, SCREEN_WIDTH],
                outputRange: [16, -16] // Clamp inside screen boundaries
              }),
              opacity: menuAnim,
              transform: [{
                scale: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}
        >
          <Text style={styles.menuTitle}>📋 Quick Copy History</Text>
          <View style={styles.divider} />
          
          {lastFiveItems.length === 0 ? (
            <Text style={styles.emptyText}>No copied text items yet.</Text>
          ) : (
            lastFiveItems.map((item, idx) => (
              <TouchableOpacity 
                key={item.id || idx} 
                style={styles.menuItem} 
                onPress={() => handleItemPress(item.text)}
              >
                <Text style={styles.itemIcon}>{item.type === 'link' ? '🔗' : item.type === 'code' ? '🔑' : '📝'}</Text>
                <Text style={styles.itemText} numberOfLines={1}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))
          )}
          
          <View style={styles.divider} />
          <TouchableOpacity style={styles.footerButton} onPress={onCloseWidget}>
            <Text style={styles.footerText}>Close Sticky Widget ✖</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  bubble: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bubbleTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleText: {
    fontSize: 26,
    color: '#FFFFFF',
  },
  menuPanel: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 6,
  },
  itemIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  footerButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
});
