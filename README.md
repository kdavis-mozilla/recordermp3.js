[![Code Climate](https://codeclimate.com/github/welll/record-encode-audio-from-browser/badges/gpa.svg)](https://codeclimate.com/github/welll/record-encode-audio-from-browser) [![Test Coverage](https://codeclimate.com/github/welll/record-encode-audio-from-browser/badges/coverage.svg)](https://codeclimate.com/github/welll/record-encode-audio-from-browser)

# Record/Encode Audio from Browser


__recordermp3.js__ is a small Javascript library for mp3 encoding the output of Web Audio API nodes.

### Quick Start

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Recorder Test</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
</head>
<body>
<!-- recordermp3.js -->
<script src="vendor/recordermp3.js/js/recorder.js"></script>
<script type="text/javascript">
  // Define mp3 callback 
  function mp3Callback(blob) {
    config.log('Got mp3 blob');
  }
  
  // Create AudioContext
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext();

  // Define function called by getUserMedia 
  function startUserMedia(stream) {
    // Create MediaStreamAudioSourceNode
    var source = audioContext.createMediaStreamSource(stream);

    // Setup config
    var config = {
     mp3Callback : mp3Callback,
     mp3WorkerPath: 'vendor/recordermp3.js/js/enc/mp3/mp3Worker.js'
    }; 
    
    // Create Recorder
    var recorder = new Recorder(source, config);
  }

  // Ask for audio device
  navigator.getUserMedia = navigator.getUserMedia || 
                           navigator.mozGetUserMedia || 
                           navigator.webkitGetUserMedia;
  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
          console.log("No live audio input in this browser: " + e);
  });
</script>
</body>
</html>
```

Recording is started by calling ```recorder.record()``` and stoped by calling ```recorder.stop()```.

To see a fuller example refer to [dictatemp3.js](https://github.com/kdavis-mozilla/dictatemp3.js) in particular [dictate.js](https://github.com/kdavis-mozilla/dictatemp3.js/blob/master/lib/dictate.js).


### Compatibility - Browser
* Firefox 45.0a1+

### Codecs
* MP3: 22.050Hz && 128Kbps using the ported liblame

##Author

* Wellington Soares well.cco@gmail.com
* Kelly Davis kdavis@mozilla.com


##Thanks
The code is based on the following implementations: 

+ https://github.com/nusofthq/Recordmp3js 
+ https://github.com/akrennmair/speech-to-server
+ https://github.com/remusnegrota/Recorderjs

##Contribution

Any contribution will be welcome!

##License

The MIT License (MIT)

Copyright (c) 2014 welll

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

