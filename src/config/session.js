import session from "express-session";
import FileStoreFactory from "session-file-store";
import path from "path";

// Khởi tạo FileStore từ express-session
const FileStore = FileStoreFactory(session);

const configSession = (app) => {
  const storagePath = path.join(process.cwd(), "sessions");
  const fileStoreOptions = {
    path: storagePath,
    useAsyncWrite: true,
    reapInterval: 3600, // Tự động dọn các session cũ mỗi giờ
    logFn: () => {}, // Tắt log mặc định
  };

  app.use(
    session({
      store: new FileStore(fileStoreOptions),
      secret: "yennhicute",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600000,
      },
    })
  );
};

export default configSession;
