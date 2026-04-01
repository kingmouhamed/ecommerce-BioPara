{{flutter_js}}
{{flutter_build_config}}

const config = _flutter.buildConfig || {};
// Use the local 'canvaskit' folder to completely bypass all network and CORS restrictions
config.canvasKitBaseUrl = "canvaskit/";

_flutter.loader.load({
  config: config
});
