const ngrok = require("ngrok");
const serve = require("serve");
const Bundler = require("parcel");
const Path = require("path");

const files = [
  Path.join(__dirname, "./index.html"),
  Path.join(__dirname, "./authorize.html"),
  Path.join(__dirname, "./auth-success.html")
];

const buildDir = Path.join(__dirname, "./dist");

const watchServer = async () => {
  const bundler = new Bundler(files, {
    publicPath: "/"
  });

  // Run the bundler, this returns the main bundle
  // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
  const bundle = await bundler.bundle();
  await serve(buildDir, {
    port: 5000,
    silent: true
  });
  console.log("📡 Listening on port 5000");

  const url = await ngrok.connect(5000);
  console.log(`🌍 Watcher is set on ${url} !

You can now link your Trello board with this iframe URL to see your changes live to Trello
😎 😎


  `);
};

watchServer();
