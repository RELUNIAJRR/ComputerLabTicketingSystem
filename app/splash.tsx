import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';

export default function SplashScreen() {
  const iconScale = new Animated.Value(0);
  const iconOpacity = new Animated.Value(0);
  const progressOpacity = new Animated.Value(0);
  const containerOpacity = new Animated.Value(1);

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // 1. Fade in and scale up the icon
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // 2. Show progress bar
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. After a delay, fade out everything and navigate
    setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/login');
      });
    }, 3000);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: iconOpacity,
            transform: [{ scale: iconScale }],
          },
        ]}
      >
        <View style={styles.iconBackground}>
          <FontAwesome name="desktop" size={64} color="#1e40af" />
        </View>
        <View style={styles.ticketIcon}>
          <FontAwesome name="ticket" size={32} color="#1e40af" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.progressContainer, { opacity: progressOpacity }]}>
        <Progress.Bar
          width={Dimensions.get('window').width * 0.5}
          height={4}
          color="#1e40af"
          indeterminate={true}
          borderWidth={0}
          unfilledColor="#e5e7eb"
          animated={true}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  ticketIcon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  progressContainer: {
    marginTop: 40,
  },
}); 