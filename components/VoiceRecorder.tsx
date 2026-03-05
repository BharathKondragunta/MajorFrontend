import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Mic, Square, Play, Pause, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

interface VoiceRecorderProps {
    onRecordingComplete: (uri: string, filename: string) => void;
    onReset: () => void;
}

export const VoiceRecorder = ({ onRecordingComplete, onReset }: VoiceRecorderProps) => {
    const { colorScheme } = useColorScheme();
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [recordedUri, setRecordedUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const isDarkMode = colorScheme === 'dark';
    const accentColor = '#3b82f6'; // Blue-500
    const recordRed = '#ef4444'; // Red-500

    useEffect(() => {
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
            if (sound) {
                sound.unloadAsync();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [recording, sound]);

    // Pulsating animation for recording
    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );

                setRecording(recording);
                setIsRecording(true);
                setDuration(0);

                timerRef.current = setInterval(() => {
                    setDuration((prev) => prev + 1);
                }, 1000) as any;
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);

        try {
            await recording?.stopAndUnloadAsync();
            const uri = recording?.getURI();
            if (uri) {
                setRecordedUri(uri);
                const filename = `VOICE-${Date.now()}.m4a`;
                onRecordingComplete(uri, filename);
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };

    const playRecording = async () => {
        if (recordedUri) {
            const { sound } = await Audio.Sound.createAsync(
                { uri: recordedUri },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );
            setSound(sound);
            setIsPlaying(true);
        }
    };

    const stopPlayback = async () => {
        if (sound) {
            await sound.stopAsync();
            setIsPlaying(false);
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.didJustFinish) {
            setIsPlaying(false);
        }
    };

    const resetRecording = () => {
        setRecordedUri(null);
        setDuration(0);
        setSound(null);
        setIsPlaying(false);
        onReset();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <View className="items-center mb-6">
                <Text className="text-secondary dark:text-gray-400 font-bold text-xs uppercase mb-4 tracking-widest">
                    {recordedUri ? 'VOICE CAPTURED' : isRecording ? 'RECORDING STATEMENT...' : 'VOICE RECORDER'}
                </Text>

                <Text className={`text-4xl font-mono font-bold mb-4 ${isRecording ? 'text-red-500' : 'text-primary dark:text-white'}`}>
                    {formatDuration(duration)}
                </Text>

                {/* Animated Waveform Simulation */}
                {isRecording && (
                    <View className="flex-row items-center justify-center gap-1 h-8 mb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Animated.View
                                key={i}
                                style={{
                                    height: pulseAnim.interpolate({
                                        inputRange: [1, 1.2],
                                        outputRange: [10, 20 + Math.random() * 15],
                                    }),
                                    width: 4,
                                    backgroundColor: recordRed,
                                    borderRadius: 2,
                                }}
                            />
                        ))}
                    </View>
                )}
            </View>

            <View className="flex-row justify-center items-center gap-6">
                {!recordedUri ? (
                    <TouchableOpacity
                        onPress={isRecording ? stopRecording : startRecording}
                        className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${isRecording ? 'bg-red-500' : 'bg-primary dark:bg-white'}`}
                    >
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                            {isRecording ? (
                                <Square size={32} color="white" fill="white" />
                            ) : (
                                <Mic size={32} color={isDarkMode ? 'black' : 'white'} />
                            )}
                        </Animated.View>
                    </TouchableOpacity>
                ) : (
                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity
                            onPress={resetRecording}
                            className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center"
                        >
                            <Trash2 size={24} color="#ef4444" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={isPlaying ? stopPlayback : playRecording}
                            className="w-20 h-20 rounded-full bg-blue-500 items-center justify-center shadow-lg"
                        >
                            {isPlaying ? (
                                <Pause size={32} color="white" fill="white" />
                            ) : (
                                <Play size={32} color="white" fill="white" />
                            )}
                        </TouchableOpacity>

                        <View className="w-12 h-12 items-center justify-center">
                            <CheckCircle2 size={32} color="#10b981" />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};
