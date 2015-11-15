(function(window) {

  var BUFFER_LEN = 4096;
  var WAV_CALLBACK = function(b){};
  var MP3_CALLBACK = function(b){};
  var WAV_WORKER_PATH = 'js/enc/wav/recorderWorker.js';
  var MP3_WORKER_PATH = 'js/enc/mp3/mp3Worker.js';

  var Recorder = function(source, config) {
    var recording = false;
    var bufferLen = config.bufferLen || BUFFER_LEN;
    var wavCallback = config.wavCallback || WAV_CALLBACK;
    var mp3Callback = config.mp3Callback || MP3_CALLBACK;

    this.context = source.context;

    this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, bufferLen, 1, 1);
    this.node.connect(this.context.destination); //this should not be necessary

    var recordWavWorker = new Worker(config.wavWorkerPath || WAV_WORKER_PATH);
    var encoderMp3Worker = new Worker(config.wavWorkerPath || MP3_WORKER_PATH);

    this.node.onaudioprocess = function(e) {

      if (!recording)
        return;

      var channelLeft = e.inputBuffer.getChannelData(0);

      console.log('onAudioProcess' + channelLeft.length);

      encoderMp3Worker.postMessage({
        command: 'encode',
        buf: channelLeft
      });

      recordWavWorker.postMessage({
        command: 'record',
        buffer: channelLeft
      });

    }

    source.connect(this.node);

    this.record = function() {
      if (recording)
        return false;

      recording = true;

      var sampleRate = this.context.sampleRate;

      console.log("Initializing WAV");

      recordWavWorker.postMessage({
        command: 'init',
        config: {
          sampleRate: sampleRate
        }
      });

      console.log("Initializing to Mp3");

      encoderMp3Worker.postMessage({
        command: 'init',
        config: {
          channels: 1,
          mode: 3 /* means MONO*/ ,
          samplerate: 22050,
          bitrate: 64,
          insamplerate: sampleRate
        }
      });

    }

    this.stop = function() {
      if (!recording)
        return;

      recordWavWorker.postMessage({
        command: 'finish'
      });

      encoderMp3Worker.postMessage({
        command: 'finish'
      });

      recording = false;
    }

    encoderMp3Worker.onmessage = function(e) {
      var command = e.data.command;

      console.log('encoderMp3Worker - onmessage: ' + command);

      switch (command) {
        case 'data':
          var buf = e.data.buf;
          console.log('Receiving data from mp3-Encoder');
          break;

        case 'mp3':
          var blob = e.data;
          mp3Callback(blob);
          break;
      }

    };

    recordWavWorker.onmessage = function(e) {
      var command = e.data.command;

      console.log('recordWavWorker - onmessage: ' + command);

      switch (command) {
        case 'wav':
          var blob = e.data;
          wavCallback(blob);
          break;
      }

    };
  };

  window.Recorder = Recorder;

})(window);
