import session from "express-session";
import FileStoreFactory from "session-file-store";
import path from "path";

// Khởi tạo FileStore từ express-session
const FileStore = FileStoreFactory(session);

const configSession = (app) => {
  const storagePath = path.join(process.cwd(), "sessions");
  
  // Optimize file store options for better performance and reliability
  const fileStoreOptions = {
    path: storagePath,
    useAsyncWrite: true,
    reapInterval: 3600, // Tự động dọn các session cũ mỗi giờ
    logFn: () => {}, // Tắt log mặc định
    retries: 5, // Number of retries when accessing session files
    retryDelay: 50, // Delay between retries in ms
    ttl: 86400, // Time to live in seconds (24 hours)
    encoding: 'utf8',
    fileExtension: '.json',
    keyFunction: (filename) => filename.replace(/\.json$/, ""), // Extract session ID from filename
    dirPath: (sessionId) => path.join(storagePath, sessionId.substring(0, 2)), // Organize sessions in subdirectories
    fdLimit: 1000, // Maximum number of open file descriptors
    disposeFn: (sid, filePath) => {} // Custom dispose function - can be enhanced if needed
  };

  app.use(
    session({
      store: new FileStore(fileStoreOptions),
      secret: "yennhicute",
      resave: false,
      saveUninitialized: false, // Changed to false to avoid creating unnecessary sessions
      rolling: true, // Refresh cookie expiration on every response
      cookie: {
        secure: process.env.NODE_ENV === "production", // Use secure in production
        httpOnly: true,
        sameSite: "lax",
        maxAge: 86400000, // 24 hours in milliseconds
      },
      // Add error handling for session store
      unset: 'destroy',
      name: 'bookstore.sid' // Custom name to avoid using default connect.sid
    })
  );
  
  // Add session error handling middleware
  app.use((req, res, next) => {
    if (!req.session) {
      return next(new Error('Session store unavailable'));
    }
    next();
  });
};

export default configSession;
