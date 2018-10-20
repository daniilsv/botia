const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

module.exports = (text, file) => {
    client.synthesizeSpeech({
        input: { text: text },
        voice: { languageCode: 'en-US', Voicetype: "WaveNet", ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    }, (err, response) => {
        if (err) {
            console.error('ERROR:', err);
            return;
        }
        fs.writeFileSync(`/home/adminus/PROJECTS/botia/static/files/${file}.mp3`, response.audioContent, 'binary');
        const { execSync } = require('child_process');
        execSync(`ffmpeg -i /home/adminus/PROJECTS/botia/static/files/${file}.mp3 -acodec pcm_alaw -ar 8000 -ac 1 /home/adminus/PROJECTS/botia/static/files/${file}.wav`);
        fs.unlinkSync(`/home/adminus/PROJECTS/botia/static/files/${file}.mp3`);
    });
};