'use client'

import React, { useState} from 'react';
import Image from 'next/image';
import { Song } from '@/app/lib/definitions'; 

interface SongComponentProps {
    song: Song;
}

const SongComponent: React.FC<SongComponentProps> = ({ song }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const handlePlayPreview = () => {
        if (song.preview_url && audioRef.current) {
            audioRef.current.src = song.preview_url;
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            console.log('No preview available for this song.');
        }
    };

    const handleStopPreview = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div
            className="flex items-center gap-3"
            onClick={!isPlaying ? handlePlayPreview : handleStopPreview }>
            <Image
                src={song.album.images[0].url}
                alt={`${song.name}'s picture`}
                width={80}
                height={80}
            />
            <div>
                <p className="font-bold text-lg">
                    {song.name}
                </p>
                <p className="font-italic text-medium">
                    {isPlaying 
                        ? 'Playing...' 
                        : song.preview_url
                            ? 'Try it!'
                            : 'No preview, sorry'}
                </p>
                <audio ref={audioRef} />
            </div>
        </div>
    );
};

export default SongComponent;
