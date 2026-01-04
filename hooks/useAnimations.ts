import { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";

export const useFadeIn = (duration: number = 500, delay: number = 0) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return opacity;
};

export const useSlideIn = (
  direction: "left" | "right" | "up" | "down" = "up",
  duration: number = 500,
  delay: number = 0
) => {
  const translate = useRef(
    new Animated.Value(direction === "up" || direction === "down" ? 50 : 50)
  ).current;

  useEffect(() => {
    Animated.timing(translate, {
      toValue: 0,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case "left":
        return { translateX: translate };
      case "right":
        return { translateX: Animated.multiply(translate, -1) };
      case "up":
        return { translateY: translate };
      case "down":
        return { translateY: Animated.multiply(translate, -1) };
    }
  };

  return getTransform();
};

export const useScale = (duration: number = 500, delay: number = 0) => {
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return scale;
};

export const usePulse = (duration: number = 1000) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.05,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, []);

  return scale;
};

export const useShake = () => {
  const translateX = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { translateX, shake };
};

export const useRotate = (duration: number = 1000) => {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return spin;
};
